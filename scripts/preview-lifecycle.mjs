import { createHash } from "node:crypto";

export const marker = "<!-- fall-cloudflare-preview-status:v1 -->";

// Repository identity and PR number survive title/branch/label changes.
export function previewName(repositoryId, number) {
  if (!/^\d+$/.test(String(repositoryId)) || !/^\d+$/.test(String(number))) {
    throw new Error("Invalid repository or PR identity");
  }
  return `pr-${repositoryId}-${number}`;
}

export function manualName(source) {
  const slug = source
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)
    .replace(/-+$/, "");
  if (!slug) throw new Error("Manual preview name must contain letters or numbers");
  const hash = createHash("sha256").update(source).digest("hex").slice(0, 8);
  return `manual-${slug}-${hash}`;
}

export function eligible(pr, repository, sha) {
  return (
    pr.state === "open" &&
    pr.head.repo?.full_name === repository &&
    pr.head.sha === sha &&
    pr.labels.some(({ name }) => name === "autodeploy")
  );
}

export async function current({ github, context, sha, cleanup = false }) {
  const number = context.payload.pull_request?.number || Number(process.env.PR_NUMBER);
  const { data: pr } = await github.rest.pulls.get({ ...context.repo, pull_number: number });
  if (cleanup) return pr.merged && pr.state === "closed" ? pr : null;
  if (!eligible(pr, `${context.repo.owner}/${context.repo.repo}`, sha)) return null;
  // Queue order is not guaranteed. Never let an older same-head run replace a newer outcome.
  const runs = await github.paginate(github.rest.actions.listWorkflowRuns, {
    ...context.repo,
    workflow_id: "deploy-cloudflare.yml",
    head_sha: sha,
    event: "pull_request",
    per_page: 100,
  });
  for (const run of runs) {
    if (
      run.id <= context.runId ||
      run.status !== "completed" ||
      !["success", "failure"].includes(run.conclusion) ||
      !run.pull_requests?.some((item) => item.number === number)
    )
      continue;
    const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRun, {
      ...context.repo,
      run_id: run.id,
      per_page: 100,
    });
    // Unrelated-label events create skipped jobs, not newer deployment attempts.
    if (
      jobs.some((job) => job.name === "preview" && ["success", "failure"].includes(job.conclusion))
    )
      return null;
  }
  return pr;
}

export function statusBody({ status, sha, url, stage, runUrl }) {
  const detail =
    status === "success"
      ? `Preview verified: ${url}`
      : status === "removed"
        ? "Preview removed after merge."
        : status === "cleanup-failed"
          ? "Preview cleanup failed after merge. The previous URL is no longer advertised; inspect the run and retry cleanup."
          : `Preview deployment failed${stage ? ` during **${stage}**` : ""}. No new preview URL was verified.`;
  return `${marker}\n### Cloudflare preview: ${status}\n\n${detail}\n\nCommit: \`${sha}\`\n\n[Workflow run and diagnostics](${runUrl})`;
}

export async function replaceStatus({ github, context, valid, body }) {
  const { data: bot } = await github.rest.users.getByUsername({ username: "github-actions[bot]" });
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo,
    issue_number: context.payload.pull_request?.number || Number(process.env.PR_NUMBER),
    per_page: 100,
  });
  for (const comment of comments) {
    if (
      comment.user?.id === bot.id &&
      comment.user?.type === "Bot" &&
      comment.body?.startsWith(marker)
    ) {
      if (!(await valid())) return;
      await github.rest.issues.deleteComment({ ...context.repo, comment_id: comment.id });
    }
  }
  if (!(await valid())) return;
  await github.rest.issues.createComment({
    ...context.repo,
    issue_number: context.payload.pull_request?.number || Number(process.env.PR_NUMBER),
    body,
  });
}

// Delete only this PR's named Preview, which deletes all of its deployments.
// An absent resource is idempotent; authentication/server/network failures must fail visibly.
export async function deletePreview({ accountId, token, name, fetchImpl = fetch }) {
  if (!accountId || !token) throw new Error("Missing Cloudflare cleanup credentials");
  if (!/^pr-\d+-\d+$/.test(name)) throw new Error("Refusing non-PR preview deletion");
  const response = await fetchImpl(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/workers/workers/fall/previews/${name}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
  );
  if (response.status === 404) return;
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(
      `Cloudflare cleanup HTTP ${response.status}: ${JSON.stringify(result.errors || [])}`,
    );
  }
}
