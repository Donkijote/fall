import gsap from "gsap";

import { act, render } from "@testing-library/react";

import { TurnPointer } from "./TurnPointer";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});

test("keeps the arrow mounted through exit, supports interrupted handoffs and cleans up", () => {
  const { container, rerender, unmount } = render(<TurnPointer active />);
  const pointer = container.querySelector("span > span") as HTMLElement;
  act(() => {
    gsap.getTweensOf(pointer)[0].progress(1);
  });
  expect(pointer.style.opacity).toBe("1");
  rerender(<TurnPointer active={false} />);
  act(() => {
    gsap.getTweensOf(pointer)[0].progress(0.5);
  });
  const fading = Number(pointer.style.opacity);
  expect(fading).toBeGreaterThan(0);
  expect(fading).toBeLessThan(1);
  rerender(<TurnPointer active />);
  expect(Number(pointer.style.opacity)).toBe(fading);
  act(() => {
    gsap.getTweensOf(pointer)[0].progress(1);
  });
  expect(pointer.style.visibility).toBe("inherit");
  rerender(<TurnPointer active={false} />);
  act(() => {
    gsap.getTweensOf(pointer)[0].progress(1);
  });
  expect(pointer.style.visibility).toBe("hidden");
  unmount();
  expect(gsap.getTweensOf(pointer)).toHaveLength(0);
});

test("uses immediate visibility under reduced motion, including during an arrival", () => {
  const { container, rerender, unmount } = render(<TurnPointer active />);
  const pointer = container.querySelector("span > span") as HTMLElement;
  preference.reduced = true;
  rerender(<TurnPointer active />);
  expect(pointer.style.opacity).toBe("1");
  expect(gsap.getTweensOf(pointer).filter((tween) => tween.duration() > 0)).toHaveLength(0);
  rerender(<TurnPointer active={false} />);
  expect(pointer.style.visibility).toBe("hidden");
  unmount();
  expect(gsap.getTweensOf(pointer)).toHaveLength(0);
});
