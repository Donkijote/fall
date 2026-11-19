import { createMatchState } from "@/domain/services/matchSetup";
import { awardPoints } from "@/domain/services/scoring";

import { arriveScore, receiveScores, snapshotScores } from "./scorePresentation";

describe("scorePresentation", () => {
  it.each(["1vs1", "1vs2", "2vs2"] as const)(
    "queues every recipient once in %s and settles to authoritative totals",
    (mode) => {
      let state = createMatchState("local", mode);
      const initial = snapshotScores(state);
      for (const player of state.players) state = awardPoints(state, player.id, 4);
      let view = receiveScores(initial, state);
      expect(view.pending.map(({ side }) => side)).toEqual(
        state.players.map(({ team }) => String(team)),
      );
      expect(view.displayed).toEqual({});
      view = receiveScores(view, {
        ...state,
        scoreAwards: [...state.scoreAwards!, ...state.scoreAwards!],
      });
      expect(view.pending).toHaveLength(state.players.length);
      for (const award of state.scoreAwards!) {
        view = arriveScore(view, award.id, "awarded");
        expect(arriveScore(view, award.id, "duplicate")).toBe(view);
      }
      expect(view.pending).toEqual([]);
      expect(view.displayed).toEqual(state.scores.values);
      expect(receiveScores(view, state).pending).toEqual([]);
    },
  );

  it("keeps multiple awards on the same side ordered, including the winning award", () => {
    const start = createMatchState("local", "1vs1");
    const next = awardPoints(awardPoints(start, "local", 4), "local", 24);
    let view = receiveScores(snapshotScores(start), next);
    expect(arriveScore(view, "score:2", "out of order")).toBe(view);
    view = arriveScore(view, "score:1", "clear");
    expect(view.displayed["1"]).toBe(4);
    expect(view.pending).toHaveLength(1);
    view = arriveScore(view, "score:2", "win");
    expect(view.displayed["1"]).toBe(28);
    expect(view.announcement).toBe("clear. win");
    expect(view.pending).toHaveLength(0);
  });

  it("baselines reconnect history and corrections without replay", () => {
    const state = awardPoints(createMatchState("local", "2vs2"), "local", 10);
    const snapshot = snapshotScores(state);
    expect(snapshot.pending).toEqual([]);
    expect(receiveScores(snapshot, state).pending).toEqual([]);
    const correction = { ...state, scores: { ...state.scores, values: { "1": 24 } } };
    const settled = receiveScores(snapshot, correction);
    expect(settled.displayed["1"]).toBe(24);
    expect(settled.pending).toEqual([]);
  });
});

it("does not replay awards after a correction or stale retry has settled", () => {
  const start = createMatchState("local", "1vs1");
  const scored = awardPoints(start, "local", 4);
  let view = receiveScores(snapshotScores(start), scored);
  view = arriveScore(view, "score:1", "awarded");
  view = receiveScores(view, start);
  view = receiveScores(view, scored);
  expect(view.pending).toEqual([]);
  expect(view.displayed["1"]).toBe(4);
});
