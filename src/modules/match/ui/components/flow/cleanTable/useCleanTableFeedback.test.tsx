import gsap from "gsap";

import { act, cleanup, renderHook } from "@testing-library/react";

import { cleanTablePreview } from "../../../../application/cleanTablePreview";
import { useCleanTableFeedback } from "./useCleanTableFeedback";

let timelines: gsap.core.Timeline[];
beforeEach(() => {
  timelines = [];
  const create = gsap.timeline.bind(gsap);
  vi.spyOn(gsap, "timeline").mockImplementation((options) => {
    const timeline = create(options);
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => {
  cleanup();
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
});

function setup(reduced = false) {
  const { award } = cleanTablePreview({ mode: "1vs1", example: "capture", player: 0 });
  const board = { current: document.createElement("div") };
  board.current.innerHTML =
    '<span data-clean-sweep style="opacity:0"></span><span data-clean-award style="opacity:0"></span>';
  const props = { head: award, scoreBusy: true, reduced, blocked: false };
  const view = renderHook(
    ({ head, scoreBusy, reduced, blocked }) =>
      useCleanTableFeedback(head, scoreBusy, board, reduced, blocked),
    { initialProps: props },
  );
  return { ...view, props, board };
}

it("holds points for the celebration, then retains input ownership until scoring settles", () => {
  const view = setup();
  expect(view.result.current).toMatchObject({ hold: true, busy: true });
  expect(timelines).toHaveLength(1);
  act(() => {
    timelines[0].progress(1);
  });
  expect(view.result.current).toMatchObject({ hold: false, busy: true });
  view.rerender({ ...view.props, head: undefined, scoreBusy: false });
  expect(view.result.current.busy).toBe(false);
  view.rerender(view.props);
  expect(view.result.current.hold).toBe(false);
  expect(timelines).toHaveLength(1);
});

it("cancels interrupted decoration and never replays the same award on resume", () => {
  const view = setup();
  act(() => {
    timelines[0].time(0.4);
  });
  view.rerender({ ...view.props, blocked: true });
  expect(timelines[0].parent).toBeNull();
  expect(view.result.current).toMatchObject({ hold: false, busy: false });
  expect(view.board.current.querySelector<HTMLElement>("[data-clean-award]")!.style.opacity).toBe(
    "0",
  );
  view.rerender(view.props);
  expect(view.result.current.hold).toBe(false);
  expect(timelines).toHaveLength(1);
});

it("skips motion while retaining the points owner for reduced motion", () => {
  const view = setup(true);
  expect(view.result.current).toMatchObject({ hold: false, busy: true });
  expect(timelines).toHaveLength(0);
  view.rerender({ ...view.props, head: undefined, scoreBusy: false });
  expect(view.result.current.busy).toBe(false);
});

it("reverts the timeline and styles on unmount", () => {
  const view = setup();
  act(() => {
    timelines[0].time(0.4);
  });
  view.unmount();
  expect(timelines[0].parent).toBeNull();
  expect(view.board.current.querySelector<HTMLElement>("[data-clean-award]")!.style.transform).toBe(
    "",
  );
});
