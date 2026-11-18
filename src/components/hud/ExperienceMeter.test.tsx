import gsap from "gsap";

import { act, render, screen } from "@testing-library/react";

import { ExperienceMeter } from "./ExperienceMeter";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});
function movement(value: number) {
  return gsap.globalTimeline
    .getChildren(true, true, false)
    .find((animation) => (animation as gsap.core.Tween).vars.value === value) as gsap.core.Tween;
}
function percent() {
  return Number.parseFloat(document.querySelector<HTMLElement>("[data-xp-fill]")!.style.width);
}

test("gains advance progressively, emit sparks at the live edge, and resume interrupted fills", () => {
  const { container, rerender, unmount } = render(
    <ExperienceMeter value={60} maximum={100} level={4} />,
  );
  expect(percent()).toBe(60);
  rerender(<ExperienceMeter value={85} maximum={100} level={4} />);
  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "85");
  const tween = movement(85);
  const timeline = tween.parent as gsap.core.Timeline;
  act(() => {
    timeline.time(0.3);
  });
  expect(percent()).toBeGreaterThan(60);
  expect(percent()).toBeLessThan(85);
  const live = [...container.querySelectorAll<HTMLElement>("[data-xp-particle]")].filter(
    (spark) => Number(spark.style.opacity) > 0,
  );
  expect(live.length).toBeGreaterThan(0);
  expect(live.some((spark) => Number.parseFloat(spark.style.left) > 60)).toBe(true);
  const intermediate = percent();
  rerender(<ExperienceMeter value={95} maximum={100} level={4} />);
  expect(percent()).toBeCloseTo(intermediate);
  expect(gsap.globalTimeline.getChildren(true, true, false)).not.toContain(tween);
  act(() => {
    (movement(95).parent as gsap.core.Timeline).progress(1);
  });
  expect(percent()).toBe(95);
  const fill = container.querySelector("[data-xp-fill]")!;
  unmount();
  expect(gsap.getTweensOf(fill)).toHaveLength(0);
  expect(movement(95)).toBeUndefined();
});

test("level-up finishes the old bar before filling the next level", () => {
  const { rerender } = render(<ExperienceMeter value={85} maximum={100} level={4} />);
  rerender(<ExperienceMeter value={10} maximum={100} level={5} />);
  expect(percent()).toBe(85);
  const timeline = movement(100).parent as gsap.core.Timeline;
  act(() => {
    timeline.time(0.3);
  });
  expect(percent()).toBeGreaterThan(85);
  act(() => {
    timeline.time(0.5);
  });
  expect(percent()).toBeGreaterThan(0);
  expect(percent()).toBeLessThan(10);
  act(() => {
    timeline.progress(1);
  });
  expect(percent()).toBe(10);
});

test("unchanged data does not replay, reduced motion applies values without particles", () => {
  const { container, rerender } = render(<ExperienceMeter value={20} maximum={100} level={4} />);
  rerender(<ExperienceMeter value={20} maximum={100} level={4} />);
  expect(movement(20)).toBeUndefined();
  preference.reduced = true;
  rerender(<ExperienceMeter value={70} maximum={100} level={4} />);
  expect(percent()).toBe(70);
  expect(movement(70)).toBeUndefined();
  expect(
    [...container.querySelectorAll<HTMLElement>("[data-xp-particle]")].every(
      (spark) => spark.style.opacity === "0",
    ),
  ).toBe(true);
});
