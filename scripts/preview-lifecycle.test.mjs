// @vitest-environment node
import { expect, test, vi } from "vitest";

import {
  current,
  deletePreview,
  eligible,
  manualName,
  marker,
  previewName,
  replaceStatus,
  statusBody,
} from "./preview-lifecycle.mjs";

const pr = {
  number: 130,
  state: "open",
  merged: false,
  draft: true,
  head: { sha: "abc", repo: { full_name: "owner/fall" } },
  labels: [{ name: "autodeploy" }],
};
const context = {
  repo: { owner: "owner", repo: "fall" },
  runId: 10,
  payload: { pull_request: pr },
};

function client(pull = pr, runs = []) {
  return {
    rest: {
      pulls: { get: vi.fn().mockResolvedValue({ data: pull }) },
      actions: { listWorkflowRuns: vi.fn(), listJobsForWorkflowRun: vi.fn() },
      users: { getByUsername: vi.fn().mockResolvedValue({ data: { id: 42 } }) },
      issues: { listComments: vi.fn(), deleteComment: vi.fn(), createComment: vi.fn() },
    },
    paginate: vi.fn().mockResolvedValue(runs),
  };
}

test("draft and ready PRs require current opt-in, same repository, open state and current head", () => {
  expect(eligible(pr, "owner/fall", "abc")).toBe(true);
  expect(eligible({ ...pr, draft: false }, "owner/fall", "abc")).toBe(true);
  expect(eligible({ ...pr, labels: [] }, "owner/fall", "abc")).toBe(false);
  expect(eligible({ ...pr, state: "closed" }, "owner/fall", "abc")).toBe(false);
  expect(eligible(pr, "fork/fall", "abc")).toBe(false);
  expect(eligible(pr, "owner/fall", "old")).toBe(false);
});

test("PR resource identity is stable and separate from manual previews and other repositories/PRs", () => {
  expect(previewName(123, 130)).toBe("pr-123-130");
  expect(previewName(123, 131)).not.toBe(previewName(123, 130));
  expect(previewName(124, 130)).not.toBe(previewName(123, 130));
  expect(manualName("pr-123-130")).toMatch(/^manual-/);
  expect(manualName("feature/login")).not.toBe(manualName("feature-login"));
  expect(() => previewName("../production", 130)).toThrow();
  expect(() => manualName("!!!")).toThrow();
});

test("late, superseded and opted-out runs cannot deploy or report; merge cleanup ignores opt-in", async () => {
  expect(await current({ github: client(), context, sha: "abc" })).toEqual(pr);
  expect(await current({ github: client({ ...pr, labels: [] }), context, sha: "abc" })).toBeNull();
  expect(await current({ github: client(), context, sha: "old" })).toBeNull();
  const newer = [
    { id: 11, status: "completed", conclusion: "success", pull_requests: [{ number: 130 }] },
  ];
  const superseded = client(pr, newer);
  superseded.paginate
    .mockResolvedValueOnce(newer)
    .mockResolvedValueOnce([{ name: "preview", conclusion: "success" }]);
  expect(await current({ github: superseded, context, sha: "abc" })).toBeNull();
  const merged = { ...pr, state: "closed", merged: true, labels: [] };
  expect(await current({ github: client(merged), context, cleanup: true })).toEqual(merged);
  expect(
    await current({ github: client({ ...merged, merged: false }), context, cleanup: true }),
  ).toBeNull();
});

test("skipped unrelated-label events and canceled newer runs do not suppress the current attempt", async () => {
  const skipped = {
    id: 11,
    status: "completed",
    conclusion: "success",
    pull_requests: [{ number: 130 }],
  };
  const github = client();
  github.paginate
    .mockResolvedValueOnce([skipped])
    .mockResolvedValueOnce([{ name: "preview", conclusion: "skipped" }]);
  expect(await current({ github, context, sha: "abc" })).toEqual(pr);
  expect(
    await current({
      github: client(pr, [{ ...skipped, conclusion: "cancelled" }]),
      context,
      sha: "abc",
    }),
  ).toEqual(pr);
});

test("fresh terminal status removes only marked comments owned by the Actions bot", async () => {
  const github = client();
  github.paginate.mockResolvedValue([
    { id: 1, user: { id: 42, type: "Bot" }, body: `${marker}\nold` },
    { id: 2, user: { id: 99, type: "User" }, body: marker },
    { id: 3, user: { id: 42, type: "Bot" }, body: "unrelated" },
    { id: 4, user: { id: 43, type: "Bot" }, body: marker },
    { id: 5, user: { id: 42, type: "Bot" }, body: marker },
  ]);
  await replaceStatus({ github, context, valid: async () => true, body: "new" });
  expect(github.rest.issues.deleteComment.mock.calls.map(([arg]) => arg.comment_id)).toEqual([
    1, 5,
  ]);
  expect(github.rest.issues.createComment).toHaveBeenCalledWith({
    ...context.repo,
    issue_number: 130,
    body: "new",
  });
  expect(github.rest.issues.deleteComment.mock.invocationCallOrder[1]).toBeLessThan(
    github.rest.issues.createComment.mock.invocationCallOrder[0],
  );
});

test("label removal/head change during reporting stops further comment mutations", async () => {
  const github = client();
  github.paginate.mockResolvedValue([{ id: 1, user: { id: 42, type: "Bot" }, body: marker }]);
  const valid = vi.fn().mockResolvedValueOnce(true).mockResolvedValue(false);
  await replaceStatus({ github, context, valid, body: "stale" });
  expect(github.rest.issues.createComment).not.toHaveBeenCalled();
});

test("failure and cleanup statuses never advertise a stale URL as newly verified", () => {
  const args = { sha: "abc", url: "https://preview.example", runUrl: "https://run.example" };
  expect(statusBody({ ...args, status: "success" })).toContain(
    "Preview verified: https://preview.example",
  );
  for (const status of ["failure", "removed", "cleanup-failed"]) {
    const body = statusBody({ ...args, status, stage: "install" });
    expect(body).not.toContain(args.url);
    expect(body).toContain(args.sha);
    expect(body).toContain(args.runUrl);
  }
  expect(statusBody({ ...args, status: "failure", stage: "install" })).toContain("**install**");
});

test("cleanup deletes only the exact PR Preview and handles absent previews idempotently", async () => {
  const fetchImpl = vi
    .fn()
    .mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true }) });
  const args = { accountId: "account", token: "secret", name: "pr-123-130", fetchImpl };
  await deletePreview(args);
  expect(fetchImpl.mock.calls[0][0]).toBe(
    "https://api.cloudflare.com/client/v4/accounts/account/workers/workers/fall/previews/pr-123-130",
  );
  expect(fetchImpl.mock.calls[0][1].method).toBe("DELETE");
  fetchImpl.mockResolvedValue({ status: 404 });
  await expect(deletePreview(args)).resolves.toBeUndefined();
  for (const name of ["fall", "manual-foo", "pr-123-130/../131"]) {
    await expect(deletePreview({ ...args, name })).rejects.toThrow("Refusing");
  }
});

test("cleanup surfaces credential, permission, rate limit, API and network failures", async () => {
  const args = { accountId: "account", token: "secret", name: "pr-123-130" };
  await expect(deletePreview({ ...args, token: "" })).rejects.toThrow("credentials");
  for (const status of [401, 403, 429, 500]) {
    await expect(
      deletePreview({
        ...args,
        fetchImpl: async () => ({
          ok: false,
          status,
          json: async () => ({ errors: [{ message: "diagnostic" }] }),
        }),
      }),
    ).rejects.toThrow(`HTTP ${status}`);
  }
  await expect(
    deletePreview({
      ...args,
      fetchImpl: async () => {
        throw new Error("network");
      },
    }),
  ).rejects.toThrow("network");
});
