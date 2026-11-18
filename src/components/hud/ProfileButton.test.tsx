import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileButton } from "./ProfileButton";

vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({ useReducedMotion: () => true }));

test("offers native profile activation and focus/hover shine without claiming a turn", async () => {
  const click = vi.fn();
  render(<ProfileButton onClick={click} />);
  const button = screen.getByRole("button", { name: "Player profile" });
  const portrait = button.querySelector(".game-player-avatar") as HTMLElement;
  fireEvent.pointerEnter(button, { pointerType: "mouse" });
  expect(portrait.style.getPropertyValue("--portrait-glint")).toBe("0.95");
  expect(portrait.style.getPropertyValue("--portrait-turn-sweep")).toBe("0deg");
  expect(portrait).not.toHaveAttribute("data-highlighted");
  fireEvent.pointerLeave(button);
  expect(portrait.style.getPropertyValue("--portrait-glint")).toBe("0");
  await userEvent.setup().tab();
  expect(button).toHaveFocus();
  expect(portrait.style.getPropertyValue("--portrait-glint")).toBe("0.95");
  await userEvent.setup().keyboard("{Enter}");
  expect(click).toHaveBeenCalledOnce();
});
