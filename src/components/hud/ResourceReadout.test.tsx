import { Coins } from "lucide-react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResourceReadout } from "./ResourceReadout";

test("exposes the full balance on a native resource action and accepts future handlers", async () => {
  const click = vi.fn();
  render(<ResourceReadout label="Coins" icon={Coins} value={1240} onClick={click} />);
  const button = screen.getByRole("button", { name: "Coins: 1,240" });
  await userEvent.setup().tab();
  expect(button).toHaveFocus();
  await userEvent.setup().keyboard(" ");
  expect(click).toHaveBeenCalledOnce();
});

test("keeps unavailable balances explicit without inventing a numeric value", () => {
  render(<ResourceReadout label="Energy" icon={Coins} value={-1} />);
  expect(screen.getByRole("button", { name: "Energy: Unavailable" })).toHaveTextContent("—");
});

test("a real balance change pulses only the displayed amount with immediate accessible data", async () => {
  const { default: gsap } = await import("gsap");
  const { rerender, unmount } = render(<ResourceReadout label="Coins" icon={Coins} value={10} />);
  rerender(<ResourceReadout label="Coins" icon={Coins} value={20} />);
  const button = screen.getByRole("button", { name: "Coins: 20" });
  const amount = button.lastElementChild as HTMLElement;
  expect(gsap.getTweensOf(amount).some((tween) => tween.vars.filter)).toBe(true);
  rerender(<ResourceReadout label="Coins" icon={Coins} value={30} />);
  expect(button).toHaveAccessibleName("Coins: 30");
  expect(gsap.getTweensOf(amount).filter((tween) => tween.vars.filter)).toHaveLength(1);
  unmount();
  expect(gsap.getTweensOf(amount)).toHaveLength(0);
});
