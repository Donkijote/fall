import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const projectId = "PVT_kwHOAHnGTc4BBVie"; // https://github.com/users/Donkijote/projects/5
export const statuses = { start: "In progress", review: "In review", done: "Done" };

export async function moveIssue({
  graphql,
  issueId,
  status,
  log = console.log,
  valid = async () => true,
}) {
  const { node: project } = await graphql(
    `
      query ($id: ID!) {
        node(id: $id) {
          ... on ProjectV2 {
            fields(first: 100) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    { id: projectId },
  );
  const field = project?.fields.nodes.find((item) => item.name === "Status");
  const option = field?.options.find((item) => item.name === status);
  if (!option) throw new Error(`Fall project Status option missing: ${status}`);
  let after = null;
  let item;
  do {
    const { node: issue } = await graphql(
      `
        query ($id: ID!, $after: String) {
          node(id: $id) {
            ... on Issue {
              state
              projectItems(first: 100, after: $after) {
                nodes {
                  id
                  project {
                    id
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      `,
      { id: issueId, after },
    );
    if (!issue || (status === statuses.done ? issue.state !== "CLOSED" : issue.state !== "OPEN"))
      return;
    item = issue.projectItems.nodes.find((entry) => entry.project.id === projectId);
    if (item || !issue.projectItems.pageInfo.hasNextPage) break;
    after = issue.projectItems.pageInfo.endCursor;
  } while (after);
  if (!item) {
    log(`Skipping ${issueId}: issue is not in the Fall project`);
    return;
  }
  if (!(await valid())) return;
  await graphql(
    `
      mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $project
            itemId: $item
            fieldId: $field
            value: { singleSelectOptionId: $option }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `,
    { project: projectId, item: item.id, field: field.id, option: option.id },
  );
  log(`Moved ${issueId} to ${status}`);
}

export async function closingIssues(graphql, owner, repo, number) {
  const issues = [];
  let after = null;
  do {
    const { repository } = await graphql(
      `
        query ($owner: String!, $repo: String!, $number: Int!, $after: String) {
          repository(owner: $owner, name: $repo) {
            pullRequest(number: $number) {
              closingIssuesReferences(first: 100, after: $after) {
                nodes {
                  id
                  number
                  repository {
                    nameWithOwner
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      `,
      { owner, repo, number, after },
    );
    const page = repository.pullRequest.closingIssuesReferences;
    issues.push(
      ...page.nodes.filter((issue) => issue.repository.nameWithOwner === `${owner}/${repo}`),
    );
    if (!page.pageInfo.hasNextPage) return issues;
    after = page.pageInfo.endCursor;
  } while (after);
  return issues;
}

export async function reviewDeployment({ github, context, run, log }) {
  if (
    run.event !== "pull_request" ||
    run.conclusion !== "success" ||
    run.repository.full_name !== `${context.repo.owner}/${context.repo.repo}`
  )
    return;
  const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRun, {
    ...context.repo,
    run_id: run.id,
    filter: "latest",
    per_page: 100,
  });
  if (
    !jobs.some(
      (job) =>
        job.name === "preview" &&
        job.steps?.some(
          (step) => step.name === "Probe Preview deep link" && step.conclusion === "success",
        ),
    )
  )
    return;
  for (const linked of run.pull_requests || []) {
    const valid = async () => {
      const { data: pr } = await github.rest.pulls.get({
        ...context.repo,
        pull_number: linked.number,
      });
      return (
        pr.state === "open" &&
        pr.head.sha === run.head_sha &&
        pr.head.repo?.full_name === run.repository.full_name &&
        ["develop", "main"].includes(pr.base.ref) &&
        pr.labels.some((label) => label.name === "autodeploy")
      );
    };
    if (!(await valid())) continue;
    const issues = await closingIssues(
      github.graphql,
      context.repo.owner,
      context.repo.repo,
      linked.number,
    );
    for (const issue of issues) {
      await moveIssue({
        graphql: github.graphql,
        issueId: issue.id,
        status: statuses.review,
        valid,
        log,
      });
    }
  }
}

export async function completeIssue({ github, context, issue, log }) {
  if (issue.state !== "closed" || issue.state_reason !== "completed") return;
  // Use the actual closing event, not a PR that happened to reference this issue.
  const valid = async () => {
    const { repository } = await github.graphql(
      `query($owner:String!, $repo:String!, $number:Int!) {
      repository(owner:$owner, name:$repo) { issue(number:$number) {
        state timelineItems(last:1, itemTypes:[CLOSED_EVENT]) { nodes {
          ... on ClosedEvent { closer { ... on PullRequest { merged repository { nameWithOwner } } } }
        } }
      } }
    }`,
      { ...context.repo, number: issue.number },
    );
    const current = repository.issue;
    const closer = current.timelineItems.nodes[0]?.closer;
    return (
      current.state === "CLOSED" &&
      closer?.merged === true &&
      closer.repository.nameWithOwner === `${context.repo.owner}/${context.repo.repo}`
    );
  };
  if (!(await valid())) return;
  await moveIssue({
    graphql: github.graphql,
    issueId: issue.node_id,
    status: statuses.done,
    valid,
    log,
  });
}

async function start(number) {
  if (!/^\d+$/.test(number || ""))
    throw new Error("Usage: node scripts/project-status.mjs start <issue-number>");
  const repository = JSON.parse(
    execFileSync("gh", ["repo", "view", "--json", "owner,name"], { encoding: "utf8" }),
  );
  const graphql = async (query, variables) => {
    const args = ["api", "graphql", "-f", `query=${query}`];
    for (const [key, value] of Object.entries(variables)) {
      if (value !== null) args.push("-F", `${key}=${value}`);
    }
    const result = JSON.parse(execFileSync("gh", args, { encoding: "utf8" }));
    if (result.errors) throw new Error(JSON.stringify(result.errors));
    return result.data;
  };
  const { repository: data } = await graphql(
    `
      query ($owner: String!, $repo: String!, $number: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $number) {
            id
          }
        }
      }
    `,
    { owner: repository.owner.login, repo: repository.name, number: Number(number) },
  );
  await moveIssue({ graphql, issueId: data.issue.id, status: statuses.start });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] !== "start")
    throw new Error("Usage: node scripts/project-status.mjs start <issue-number>");
  await start(process.argv[3]);
}
