import gsap from "gsap";

import { act, render } from "@testing-library/react";

import { PlayerPortrait } from "./PlayerPortrait";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));

beforeEach(() => {
  preference.reduced = false;
});

function sweepTween(element: Element) {
  return gsap
    .getTweensOf(element)
    .find((tween) => "--portrait-turn-sweep" in tween.vars && tween.duration() > 0)!;
}
function value(element: HTMLElement, property: string) {
  return Number.parseFloat(element.style.getPropertyValue(`--portrait-${property}`)) || 0;
}
function advance(element: HTMLElement, progress: number) {
  act(() => {
    sweepTween(element).progress(progress);
  });
}

test("draws behind the orbit head, then wipes away from its live orbital position", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  advance(portrait, 0.5);
  expect(value(portrait, "turn-sweep")).toBeCloseTo(180);
  expect(value(portrait, "glint-angle")).toBeCloseTo(value(portrait, "turn-origin") + 180);
  const timeline = sweepTween(portrait).parent as gsap.core.Timeline;
  act(() => {
    timeline.time(1.2);
  });
  const head = value(portrait, "glint-angle");
  expect(head).toBeGreaterThan(360);
  expect(value(portrait, "turn-sweep")).toBe(360);

  rerender(<PlayerPortrait className="size-12" />);
  expect(value(portrait, "glint-angle")).toBeCloseTo(head);
  expect(value(portrait, "turn-origin")).toBeCloseTo(head);
  advance(portrait, 0.5);
  expect(value(portrait, "turn-sweep")).toBeCloseTo(180);
  expect(value(portrait, "turn-origin")).toBeCloseTo(head + 180);
  expect(value(portrait, "glint-angle")).toBeCloseTo(head + 180);
  advance(portrait, 1);
  expect(value(portrait, "turn-sweep")).toBe(0);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});

test("retraces interrupted draws and wipes without jumping either edge", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  advance(portrait, 0.3);
  const arriving = value(portrait, "turn-sweep");
  rerender(<PlayerPortrait className="size-12" />);
  expect(value(portrait, "turn-sweep")).toBe(arriving);
  advance(portrait, 0.5);
  expect(value(portrait, "turn-sweep")).toBeCloseTo(arriving / 2);
  expect(value(portrait, "glint-angle")).toBeCloseTo(value(portrait, "turn-origin") + arriving / 2);
  rerender(<PlayerPortrait className="size-12" highlighted />);
  advance(portrait, 1);
  rerender(<PlayerPortrait className="size-12" />);
  advance(portrait, 0.4);
  const leaving = value(portrait, "turn-sweep");
  const head = value(portrait, "glint-angle");
  rerender(<PlayerPortrait className="size-12" highlighted />);
  expect(value(portrait, "turn-sweep")).toBe(leaving);
  expect(value(portrait, "glint-angle")).toBe(head);
  advance(portrait, 0.5);
  expect(value(portrait, "turn-sweep")).toBeGreaterThan(leaving);
  expect(value(portrait, "glint-angle")).toBeLessThan(head);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});

test("changes immediately to complete readable rings under reduced motion", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  advance(portrait, 0.2);
  preference.reduced = true;
  rerender(<PlayerPortrait className="size-12" highlighted />);
  expect(value(portrait, "turn-sweep")).toBe(360);
  expect(gsap.getTweensOf(portrait).filter((tween) => tween.duration() > 0)).toHaveLength(0);
  rerender(<PlayerPortrait className="size-12" />);
  expect(value(portrait, "turn-sweep")).toBe(0);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});

test("starts a fresh draw at the current glint after a completed exit and idle reflection", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  advance(portrait, 1);
  rerender(<PlayerPortrait className="size-12" />);
  const timeline = sweepTween(portrait).parent as gsap.core.Timeline;
  act(() => {
    timeline.time(2.5);
  });
  expect(value(portrait, "turn-sweep")).toBe(0);
  const head = value(portrait, "glint-angle");
  rerender(<PlayerPortrait className="size-12" highlighted />);
  expect(value(portrait, "turn-origin")).toBeCloseTo(head);
  expect(value(portrait, "glint-angle")).toBeCloseTo(head);
  advance(portrait, 0.5);
  expect(value(portrait, "glint-angle")).toBeCloseTo(head + 180);
  expect(value(portrait, "turn-sweep")).toBeCloseTo(180);
  unmount();
});
