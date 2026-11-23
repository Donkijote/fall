import gsap from "gsap";
import { StrictMode } from "react";
import type { RefObject } from "react";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { CleanTablePreview } from "./CleanTablePreview";

const motion = vi.hoisted(() => ({
  complete: undefined as (() => void) | undefined,
  ready: false,
}));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({ useReducedMotion: () => false }));
vi.mock("../flow/MatchMotionLayer", () => ({
  MatchMotionLayer: ({
    board,
    complete,
  }: {
    board: RefObject<HTMLDivElement | null>;
    complete: () => void;
  }) => {
    motion.ready = Boolean(board.current);
    motion.complete = complete;
    return null;
  },
}));
let timelines: gsap.core.Timeline[];
beforeEach(() => {
  timelines = [];
  const original = gsap.timeline.bind(gsap);
  vi.spyOn(gsap, "timeline").mockImplementation((options) => {
    const timeline = original(options);
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => {
  cleanup();
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
});

it("waits for capture and celebration before sending exactly one clean-table award", () => {
  render(
    <StrictMode>
      <CleanTablePreview />
    </StrictMode>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  expect(motion.ready).toBe(true);
  expect(document.querySelector("[data-clean-award]")).toBeNull();
  expect(document.querySelector("[data-score-award]")).toBeNull();
  act(() => motion.complete!());
  expect(document.querySelectorAll("[data-table-card]")).toHaveLength(0);
  expect(document.querySelector("[data-clean-award]")).toHaveTextContent("+4");
  expect(document.querySelector("[data-clean-award]")).not.toHaveTextContent("You");
  const celebration = timelines.at(-1)!;
  act(() => {
    celebration.time(0.5);
  });
  expect(document.querySelector("[data-score-award]")).toBeNull();
  act(() => {
    celebration.progress(1);
  });
  expect(document.querySelectorAll("[data-score-award]")).toHaveLength(1);
  expect(document.querySelector("[data-score-award]")).toHaveTextContent("+4");
  expect(document.querySelector("[data-clean-award]")).toBeNull();
  act(() => {
    timelines.at(-1)!.progress(1);
  });
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("4");
  expect(document.querySelector("[data-clean-table-stage]")).toHaveAttribute(
    "data-clean-phase",
    "done",
  );
});

it("cancels a celebration when reset and never credits its late completion", () => {
  render(<CleanTablePreview />);
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  act(() => motion.complete!());
  const celebration = timelines.at(-1)!;
  act(() => {
    celebration.time(0.3);
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
  expect(celebration.parent).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("Ready to capture");
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("0");
});

it("keeps immediate recipient feedback with reduced motion", () => {
  render(<CleanTablePreview />);
  fireEvent.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  act(() => motion.complete!());
  expect(document.querySelector("[data-clean-award]")).toBeNull();
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("You +4 points");
});
