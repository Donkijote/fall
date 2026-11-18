// @vitest-environment node
import { expect, test, vi } from "vitest";

import {
  closingIssues,
  completeIssue,
  moveIssue,
  projectId,
  reviewDeployment,
  statuses,
} from "./project-status.mjs";

function fixture({ state = "OPEN", member = true, merged = true } = {}) {
  const graphql = vi.fn(async (query) => {
    if (query.includes("updateProjectV2ItemFieldValue")) return {};
    if (query.includes("ProjectV2SingleSelectField"))
      return {
        node: {
          fields: {
            nodes: [
              {
                id: "status-field",
                name: "Status",
                options: Object.values(statuses).map((name) => ({ id: name, name })),
              },
            ],
          },
        },
      };
    if (query.includes("projectItems"))
      return {
        node: {
          state,
          projectItems: {
            nodes: member ? [{ id: "item", project: { id: projectId } }] : [],
            pageInfo: { hasNextPage: false },
          },
        },
      };
    if (query.includes("closingIssuesReferences"))
      return {
        repository: {
          pullRequest: {
            closingIssuesReferences: {
              nodes: [{ id: "issue", number: 130, repository: { nameWithOwner: "owner/fall" } }],
              pageInfo: { hasNextPage: false },
            },
          },
        },
      };
    if (query.includes("timelineItems"))
      return {
        repository: {
          issue: {
            state,
            timelineItems: {
              nodes: [{ closer: { merged, repository: { nameWithOwner: "owner/fall" } } }],
            },
          },
        },
      };
    throw new Error("Unexpected query");
  });
  return graphql;
}
const context = { repo: { owner: "owner", repo: "fall" } };
const run = {
  id: 10,
  event: "pull_request",
  conclusion: "success",
  head_sha: "abc",
  repository: { full_name: "owner/fall" },
  pull_requests: [{ number: 133 }],
};
function client() {
  return {
    graphql: fixture(),
    rest: {
      actions: { listJobsForWorkflowRun: vi.fn() },
      pulls: {
        get: vi.fn().mockResolvedValue({
          data: {
            state: "open",
            head: { sha: "abc", repo: { full_name: "owner/fall" } },
            base: { ref: "develop" },
            labels: [{ name: "autodeploy" }],
          },
        }),
      },
    },
    paginate: vi
      .fn()
      .mockResolvedValue([
        { name: "preview", steps: [{ name: "Probe Preview deep link", conclusion: "success" }] },
      ]),
  };
}
const mutations = (graphql) => graphql.mock.calls.filter(([query]) => query.includes("mutation"));

test("moves only existing Fall project items to the exact requested option", async () => {
  const graphql = fixture();
  await moveIssue({ graphql, issueId: "issue", status: statuses.start, log: vi.fn() });
  expect(mutations(graphql)[0][1]).toEqual({
    project: projectId,
    item: "item",
    field: "status-field",
    option: "In progress",
  });
  const missing = fixture({ member: false });
  await moveIssue({ graphql: missing, issueId: "issue", status: statuses.start, log: vi.fn() });
  expect(mutations(missing)).toHaveLength(0);
});

test("does not move closed issues backwards or update after the deployment becomes stale", async () => {
  for (const args of [
    { graphql: fixture({ state: "CLOSED" }) },
    { graphql: fixture(), valid: async () => false },
  ]) {
    await moveIssue({ ...args, issueId: "issue", status: statuses.review });
    expect(mutations(args.graphql)).toHaveLength(0);
  }
});

test("only a current, opted-in PR with a verified preview moves closing issues to review", async () => {
  const github = client();
  await reviewDeployment({ github, context, run, log: vi.fn() });
  expect(mutations(github.graphql)[0][1].option).toBe("In review");
  for (const change of [
    { state: "closed" },
    { head: { sha: "stale", repo: { full_name: "owner/fall" } } },
    { head: { sha: "abc", repo: { full_name: "fork/fall" } } },
    { labels: [] },
  ]) {
    const stale = client();
    const { data } = await stale.rest.pulls.get();
    stale.rest.pulls.get.mockResolvedValue({ data: { ...data, ...change } });
    await reviewDeployment({ github: stale, context, run });
    expect(mutations(stale.graphql)).toHaveLength(0);
  }
});

test("skipped/failed/canceled/manual deployments and missing probes never promote issues", async () => {
  for (const change of [
    { conclusion: "failure" },
    { conclusion: "cancelled" },
    { event: "workflow_dispatch" },
  ]) {
    const github = client();
    await reviewDeployment({ github, context, run: { ...run, ...change } });
    expect(mutations(github.graphql)).toHaveLength(0);
  }
  const github = client();
  github.paginate.mockResolvedValue([{ name: "preview", conclusion: "skipped", steps: [] }]);
  await reviewDeployment({ github, context, run });
  expect(mutations(github.graphql)).toHaveLength(0);
});

test("Done requires the current closing event to be a merged PR", async () => {
  const issue = { number: 130, node_id: "issue", state: "closed", state_reason: "completed" };
  const github = { graphql: fixture({ state: "CLOSED" }) };
  await completeIssue({ github, context, issue, log: vi.fn() });
  expect(mutations(github.graphql)[0][1].option).toBe("Done");
  for (const args of [
    { graphql: fixture({ state: "CLOSED", merged: false }), issue },
    { graphql: fixture({ state: "OPEN" }), issue },
    { graphql: fixture({ state: "CLOSED" }), issue: { ...issue, state_reason: "not_planned" } },
  ]) {
    await completeIssue({ github: { graphql: args.graphql }, context, issue: args.issue });
    expect(mutations(args.graphql)).toHaveLength(0);
  }
});

test("closing references are paginated and unrelated repositories are excluded", async () => {
  const graphql = vi
    .fn()
    .mockResolvedValueOnce({
      repository: {
        pullRequest: {
          closingIssuesReferences: {
            nodes: [{ id: "foreign", repository: { nameWithOwner: "other/repo" } }],
            pageInfo: { hasNextPage: true, endCursor: "next" },
          },
        },
      },
    })
    .mockResolvedValueOnce({
      repository: {
        pullRequest: {
          closingIssuesReferences: {
            nodes: [{ id: "local", repository: { nameWithOwner: "owner/fall" } }],
            pageInfo: { hasNextPage: false },
          },
        },
      },
    });
  expect(await closingIssues(graphql, "owner", "fall", 133)).toEqual([
    { id: "local", repository: { nameWithOwner: "owner/fall" } },
  ]);
  expect(graphql.mock.calls[1][1].after).toBe("next");
});
