import { StorageKeys, StorageService } from "@/application/services/StorageService";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WelcomeModal } from "./WelcomeModal";

beforeEach(() => localStorage.clear());

test("requires a nonblank username and saves the trimmed name on Enter", async () => {
  const user = userEvent.setup();
  render(<WelcomeModal />);
  expect(screen.getByRole("dialog", { name: "Welcome to Fall!" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  await user.type(screen.getByLabelText("Username"), "   ");
  expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  await user.clear(screen.getByLabelText("Username"));
  await user.type(screen.getByLabelText("Username"), "  Player One  {Enter}");
  expect(StorageService.get(StorageKeys.FALL_USER)).toEqual(
    expect.objectContaining({ username: "Player One", name: "Player One" }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("cannot dismiss registration with Escape or an outside click", async () => {
  const user = userEvent.setup();
  render(<WelcomeModal />);
  await user.keyboard("{Escape}");
  await user.click(document.querySelector('[data-slot="dialog-overlay"]')!);
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(StorageService.get(StorageKeys.FALL_USER)).toBeNull();
});

test("does not open for a stored user", () => {
  StorageService.set(StorageKeys.FALL_USER, { id: "player", username: "Player" });
  render(<WelcomeModal />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
