import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SingsModal } from "./SingsModal";

test("shows combinations in an accessible dialog and closes with Escape", async () => {
  const onClose = vi.fn();
  render(<SingsModal isOpen onClose={onClose} />);
  expect(screen.getByRole("dialog", { name: "Sings (Combinations)" })).toBeVisible();
  expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0);
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("the close button invokes onClose", async () => {
  const onClose = vi.fn();
  render(<SingsModal isOpen onClose={onClose} />);
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("closed combinations are not rendered", () => {
  render(<SingsModal isOpen={false} onClose={vi.fn()} />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
