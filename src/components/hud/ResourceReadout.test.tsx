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
