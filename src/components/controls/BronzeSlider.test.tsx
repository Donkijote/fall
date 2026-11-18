import gsap from "gsap";

import { fireEvent, render, screen } from "@testing-library/react";

import { BronzeSlider } from "./BronzeSlider";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});

test.each([false, true])(
  "keyboard values commit immediately with reduced motion %s",
  async (reduced) => {
    preference.reduced = reduced;
    const commit = vi.fn();
    const { container, unmount } = render(
      <BronzeSlider defaultValue={[40]} onValueCommitted={commit} />,
    );
    const thumb = await screen.findByRole("slider", { hidden: true });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    fireEvent.keyUp(thumb, { key: "ArrowRight" });
    expect(thumb).toHaveAttribute("aria-valuenow", "41");
    expect(commit).toHaveBeenCalledWith([41], expect.anything());
    const root = container.firstElementChild!;
    expect(gsap.getTweensOf(root).some((tween) => "--slider-settle" in tween.vars)).toBe(!reduced);
    unmount();
    expect(gsap.getTweensOf(root)).toHaveLength(0);
  },
);
