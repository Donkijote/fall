import gsap from "gsap";
import { useRef } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { useBorderGlint } from "./useBorderGlint";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});

function Preview() {
  const ref = useRef<HTMLButtonElement>(null);
  useBorderGlint(ref, true, { orbitOnAttention: true });
  return <button ref={ref}>Resource</button>;
}
function loop(button: HTMLElement) {
  return gsap
    .getTweensOf(button)
    .find((tween) => "--border-glint-x" in tween.vars && tween.duration() > 0)!
    .parent as gsap.core.Timeline;
}
function position(button: HTMLElement) {
  return [
    button.style.getPropertyValue("--border-glint-x"),
    button.style.getPropertyValue("--border-glint-y"),
  ];
}

test("pauses where the glint was, resumes the same lap, and cleans up", () => {
  const { unmount } = render(<Preview />);
  const button = screen.getByRole("button");
  const orbit = loop(button);
  expect(orbit.paused()).toBe(true);
  fireEvent.pointerEnter(button, { pointerType: "mouse" });
  expect(orbit.paused()).toBe(false);
  act(() => {
    orbit.progress(0.35);
  });
  const stopped = position(button);
  fireEvent.pointerLeave(button);
  expect(orbit.paused()).toBe(true);
  expect(position(button)).toEqual(stopped);
  fireEvent.pointerEnter(button, { pointerType: "mouse" });
  expect(orbit.progress()).toBeCloseTo(0.35);
  expect(position(button)).toEqual(stopped);
  act(() => {
    orbit.progress(0.55);
  });
  expect(position(button)).not.toEqual(stopped);
  fireEvent.pointerLeave(button);
  const beforeResize = position(button);
  fireEvent(window, new Event("resize"));
  expect(loop(button).progress()).toBeCloseTo(0.55);
  expect(position(button)).toEqual(beforeResize);
  expect(loop(button).paused()).toBe(true);
  unmount();
  expect(gsap.getTweensOf(button)).toHaveLength(0);
  fireEvent.pointerEnter(button);
  expect(gsap.getTweensOf(button)).toHaveLength(0);
});

test("keyboard focus uses the same orbit and reduced motion never moves it", () => {
  const { rerender, unmount } = render(<Preview />);
  const button = screen.getByRole("button");
  act(() => {
    button.focus();
  });
  expect(loop(button).paused()).toBe(false);
  act(() => {
    loop(button).progress(0.42);
    button.blur();
  });
  expect(loop(button).paused()).toBe(true);
  const stopped = position(button);
  preference.reduced = true;
  rerender(<Preview />);
  expect(position(button)).toEqual(stopped);
  fireEvent.pointerEnter(button, { pointerType: "mouse" });
  expect(position(button)).toEqual(stopped);
  expect(gsap.getTweensOf(button).filter((tween) => tween.duration() > 0)).toHaveLength(0);
  unmount();
});
