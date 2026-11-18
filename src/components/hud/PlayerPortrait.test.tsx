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

test("clips the glint to the live rim until the exit is completely dark", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  const clip = () => portrait.style.getPropertyValue("--portrait-glint-clip");
  expect(clip()).toBe("var(--portrait-turn-mask)");
  advance(portrait, 1);
  rerender(<PlayerPortrait className="size-12" />);
  const timeline = sweepTween(portrait).parent as gsap.core.Timeline;
  for (const time of [0.1, 0.35, 0.64]) {
    act(() => {
      timeline.time(time);
    });
    expect(value(portrait, "turn-sweep")).toBeGreaterThan(0);
    expect(clip()).toBe("var(--portrait-turn-mask)");
  }
  act(() => {
    timeline.time(0.65);
  });
  expect(value(portrait, "turn-sweep")).toBe(0);
  expect(value(portrait, "glint")).toBe(0);
  expect(clip()).toBe("linear-gradient(black, black)");
  rerender(<PlayerPortrait className="size-12" highlighted />);
  expect(clip()).toBe("var(--portrait-turn-mask)");
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});

test("profile attention orbits only the glint and releases it without a turn rim", () => {
  const { container, rerender, unmount } = render(<PlayerPortrait className="size-12" attention />);
  const portrait = container.firstElementChild as HTMLElement;
  const orbit = gsap
    .getTweensOf(portrait)
    .find((tween) => "--portrait-glint-angle" in tween.vars && tween.repeat() === -1)!;
  act(() => {
    (orbit.parent as gsap.core.Timeline).time(0.5);
  });
  const head = value(portrait, "glint-angle");
  expect(head).toBeGreaterThan(0);
  expect(value(portrait, "turn-sweep")).toBe(0);
  rerender(<PlayerPortrait className="size-12" />);
  expect(value(portrait, "glint-angle")).toBe(head);
  const fade = gsap
    .getTweensOf(portrait)
    .find((tween) => "--portrait-glint" in tween.vars && tween.duration() === 0.18)!;
  act(() => {
    fade.progress(1);
  });
  expect(value(portrait, "glint")).toBe(0);
  expect(value(portrait, "turn-sweep")).toBe(0);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});
