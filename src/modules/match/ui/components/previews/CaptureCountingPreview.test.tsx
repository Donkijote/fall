import { useLayoutEffect, type RefObject } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";

import type { MatchFrame } from "../../../application/localMatch";
import { CaptureCountingPreview } from "./CaptureCountingPreview";

const playback = vi.hoisted(() => ({
  frame: undefined as MatchFrame | undefined,
  complete: () => {},
  boardReady: [] as boolean[],
}));
vi.mock("../flow/MatchMotionLayer", () => ({
  MatchMotionLayer: ({
    frame,
    complete,
    board,
  }: {
    frame: MatchFrame;
    complete: () => void;
    board: RefObject<HTMLDivElement | null>;
  }) => {
    useLayoutEffect(() => {
      playback.boardReady.push(Boolean(board.current));
    }, [board]);
    playback.frame = frame;
    playback.complete = complete;
    return null;
  },
}));

it("counts unique cards from teammates into shared pockets and preserves format on replay", () => {
  const props = { total: 26, quota: 20, speed: 0.5, revision: 0 };
  const view = render(<CaptureCountingPreview {...props} />);
  let motion = playback.frame!.motion;
  if (motion?.kind !== "count") throw new Error("Expected count frame");
  expect(motion.groups.map(({ side, cards }) => [side, cards])).toEqual([
    [1, 26],
    [2, 14],
  ]);
  expect(motion.piles.map(({ cards }) => cards.length)).toEqual([13, 7, 13, 7]);
  expect(
    new Set(motion.piles.flatMap(({ cards }) => cards.map(({ suit, rank }) => `${suit}-${rank}`)))
      .size,
  ).toBe(40);
  fireEvent.click(screen.getByRole("button", { name: "1vs2" }));
  motion = playback.frame!.motion;
  if (motion?.kind !== "count") throw new Error("Expected count frame");
  expect(motion.groups.map(({ cards }) => cards)).toEqual([26, 7, 7]);
  act(() => playback.complete());
  expect(screen.getByRole("status")).toHaveTextContent("Counting complete");
  view.rerender(<CaptureCountingPreview {...props} revision={1} />);
  expect(screen.getByRole("button", { name: "1vs2" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent(
    "Counting captured cards into each team pocket",
  );
  expect(playback.frame!.state.players).toHaveLength(3);
  expect(playback.boardReady.length).toBeGreaterThanOrEqual(3);
  expect(playback.boardReady).not.toContain(false);
});
