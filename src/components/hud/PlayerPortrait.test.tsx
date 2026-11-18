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

function turnTween(element: Element) {
  return gsap.getTweensOf(element).find((tween) => "--portrait-turn" in tween.vars)!;
}

function light(element: HTMLElement) {
  return Number(element.style.getPropertyValue("--portrait-turn"));
}

test("hands off an interrupted turn from its current light level and cleans up on unmount", () => {
  const { container, rerender, unmount } = render(<PlayerPortrait className="size-12" />);
  const portrait = container.firstElementChild as HTMLElement;
  act(() => {
    turnTween(portrait).progress(1);
  });
  rerender(<PlayerPortrait className="size-12" highlighted />);
  act(() => {
    turnTween(portrait).progress(0.3);
  });
  const arriving = light(portrait);
  expect(arriving).toBeGreaterThan(0);
  expect(arriving).toBeLessThan(1);

  rerender(<PlayerPortrait className="size-12" />);
  expect(light(portrait)).toBeCloseTo(arriving);
  act(() => {
    turnTween(portrait).progress(0.3);
  });
  expect(light(portrait)).toBeLessThan(arriving);
  rerender(<PlayerPortrait className="size-12" highlighted />);
  act(() => {
    turnTween(portrait).progress(1);
  });
  expect(light(portrait)).toBe(1);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});

test("switches immediately to readable turn states when reduced motion changes mid-arrival", () => {
  const { container, rerender, unmount } = render(
    <PlayerPortrait className="size-12" highlighted />,
  );
  const portrait = container.firstElementChild as HTMLElement;
  act(() => {
    turnTween(portrait).progress(0.2);
  });
  preference.reduced = true;
  rerender(<PlayerPortrait className="size-12" highlighted />);
  expect(light(portrait)).toBe(1);
  expect(gsap.getTweensOf(portrait).filter((tween) => tween.duration() > 0)).toHaveLength(0);
  rerender(<PlayerPortrait className="size-12" />);
  expect(light(portrait)).toBe(0);
  unmount();
  expect(gsap.getTweensOf(portrait)).toHaveLength(0);
});
