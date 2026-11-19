import { createMatchState } from "@/domain/services/matchSetup";
import { awardPoints } from "@/domain/services/scoring";

import { act, renderHook } from "@testing-library/react";

import type { MatchFrame } from "../../../application/localMatch";
import { useScorePresentation } from "./useScorePresentation";

it("waits for card/count handoff, then holds results through the tally update", () => {
  vi.useFakeTimers();
  const state = createMatchState("local", "1vs1");
  const scored = awardPoints(state, "local", 24);
  const view = renderHook(({ frame }: { frame: MatchFrame }) => useScorePresentation(frame), {
    initialProps: { frame: { state } as MatchFrame },
  });
  view.rerender({ frame: { state: scored, motion: { kind: "deal", cards: [], dealer: "local" } } });
  expect(view.result.current.pending).toEqual([]);
  view.rerender({ frame: { state: { ...scored, phase: "gameOver" } } });
  expect(view.result.current.busy).toBe(true);
  expect(view.result.current.displayed["1"] ?? 0).toBe(0);
  act(() => view.result.current.arrive("score:1", "You +24"));
  expect(view.result.current.displayed["1"]).toBe(24);
  expect(view.result.current.busy).toBe(true);
  act(() => vi.advanceTimersByTime(300));
  expect(view.result.current.busy).toBe(false);
  view.unmount();
  vi.useRealTimers();
});

it("cancels pending effects on explicit reconnect snapshots and never replays history", () => {
  const state = createMatchState("local", "2vs2");
  const scored = awardPoints(state, "local", 4);
  const view = renderHook(({ frame }: { frame: MatchFrame }) => useScorePresentation(frame, true), {
    initialProps: { frame: { state } as MatchFrame },
  });
  view.rerender({ frame: { state: scored } });
  expect(view.result.current.pending).toHaveLength(1);
  view.rerender({ frame: { state: scored, snapshot: true } });
  expect(view.result.current.pending).toHaveLength(0);
  expect(view.result.current.displayed["1"]).toBe(4);
  view.rerender({ frame: { state: { ...scored } } });
  expect(view.result.current.pending).toHaveLength(0);
});
