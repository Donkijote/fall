import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GameButton } from "./GameButton";

test("wraps the public shadcn button with separate game presentation", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(
    <GameButton tone="primary" onClick={action}>
      Enter
    </GameButton>,
  );
  const button = screen.getByRole("button", { name: "Enter" });
  expect(button).toHaveAttribute("data-slot", "button");
  expect(button).toHaveAttribute("data-tone", "primary");
  expect(button).toHaveClass("game-button");
  await user.tab();
  await user.keyboard("{Enter}");
  expect(action).toHaveBeenCalledOnce();
});
