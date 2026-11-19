import gsap from "gsap";
import { StrictMode } from "react";

import type { ScoreAward } from "@/domain/entities/GameState";

import { act, render } from "@testing-library/react";

import { MatchPointsLayer } from "./MatchPointsLayer";

const award: ScoreAward = {
  id: "event-1",
  side: "2",
  player: "bot-1",
  amount: 4,
  reason: "fall",
  source: "table",
};
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
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
});

function mount(reducedMotion = false, destination = true) {
  const root = document.createElement("div");
  const slot = document.createElement("div");
  slot.dataset.scoreSide = "2";
  if (destination) root.append(slot);
  const host = document.createElement("div");
  root.append(host);
  const arrive = vi.fn();
  const props = {
    board: { current: root },
    award,
    reducedMotion,
    returning: false,
    sideName: () => "Mara",
    arrive,
  };
  return {
    ...render(
      <StrictMode>
        <MatchPointsLayer {...props} />
      </StrictMode>,
      { container: host },
    ),
    root,
    slot,
    arrive,
    props,
  };
}

it.each([
  [390, 844],
  [844, 390],
  [1440, 900],
])("retargets the live recipient while resizing %s × %s without replay", (width, height) => {
  const view = mount();
  vi.spyOn(view.root, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width,
    height,
  } as DOMRect);
  const rect = vi
    .spyOn(view.slot, "getBoundingClientRect")
    .mockReturnValue({ left: 50, top: 10, width: 44, height: 32 } as DOMRect);
  const timeline = timelines.at(-1)!;
  act(() => {
    timeline.time(0.7);
  });
  const token = view.root.querySelector<HTMLElement>("[data-score-award]")!;
  const before = gsap.getProperty(token, "x");
  rect.mockReturnValue({ left: 200, top: 10, width: 44, height: 32 } as DOMRect);
  act(() => {
    timeline.time(0.8);
  });
  expect(gsap.getProperty(token, "x")).not.toBe(before);
  act(() => {
    timeline.progress(1);
  });
  expect(view.arrive).toHaveBeenCalledExactlyOnceWith("event-1", "Mara +4 points — Fall");
  view.unmount();
});

it.each([
  [true, true],
  [false, false],
])("settles reduced or missing effects immediately (%s, %s)", (reduced, destination) => {
  const view = mount(reduced, destination);
  expect(view.arrive).toHaveBeenCalledWith("event-1", "Mara +4 points — Fall");
  expect(timelines).toHaveLength(0);
});

it("kills interrupted timelines and restores the destination without awarding", () => {
  const view = mount();
  const timeline = timelines.at(-1)!;
  act(() => {
    timeline.time(0.7);
  });
  view.unmount();
  expect(timeline.parent).toBeNull();
  expect(view.slot.style.transform).toBe("");
  expect(view.arrive).not.toHaveBeenCalled();
});

it("resizes the token during its source-reading pause without restarting the award", () => {
  const view = mount();
  const bounds = vi
    .spyOn(view.root, "getBoundingClientRect")
    .mockReturnValue({ left: 0, top: 0, width: 844, height: 390 } as DOMRect);
  vi.spyOn(view.slot, "getBoundingClientRect").mockReturnValue({
    left: 50,
    top: 4,
    width: 40,
    height: 28,
  } as DOMRect);
  const timeline = timelines.at(-1)!;
  act(() => {
    timeline.time(0.3);
    window.dispatchEvent(new Event("resize"));
  });
  const token = view.root.querySelector<HTMLElement>("[data-score-award]")!;
  const before = Number(gsap.getProperty(token, "scale"));
  bounds.mockReturnValue({ left: 0, top: 0, width: 667, height: 320 } as DOMRect);
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
  expect(Number(gsap.getProperty(token, "scale"))).toBeLessThan(before);
  expect(timelines.at(-1)).toBe(timeline);
  expect(view.arrive).not.toHaveBeenCalled();
  view.unmount();
});
