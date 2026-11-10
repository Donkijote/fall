import { StorageKeys, StorageService } from "@/application/services/StorageService";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HintModal } from "./HintModal";

vi.mock("@/application/services/StorageService", () => ({
  StorageKeys: { FALL_RULES_SEEN: "FALL_RULES_SEEN" },
  StorageService: { get: vi.fn(), set: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

test("opens an accessible dialog with quick hints for first-time visitors", async () => {
  vi.mocked(StorageService.get).mockReturnValue(false);
  render(<HintModal />);
  await waitFor(() =>
    expect(screen.getByRole("dialog", { name: "Welcome to Fall Rules" })).toBeVisible(),
  );
  expect(screen.getByText("Quick start")).toBeVisible();
  expect(screen.getByText("Sings sheet")).toBeVisible();
});

test("does not render after the rules hint has been seen", () => {
  vi.mocked(StorageService.get).mockReturnValue(true);
  render(<HintModal />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Got it dismisses the dialog and persists the seen flag", async () => {
  vi.mocked(StorageService.get).mockReturnValue(false);
  render(<HintModal />);
  await userEvent.click(screen.getByRole("button", { name: "Got it" }));
  expect(StorageService.set).toHaveBeenCalledWith(StorageKeys.FALL_RULES_SEEN, true);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("Escape dismisses the dialog and persists the seen flag", async () => {
  vi.mocked(StorageService.get).mockReturnValue(false);
  render(<HintModal />);
  await userEvent.keyboard("{Escape}");
  expect(StorageService.set).toHaveBeenCalledWith(StorageKeys.FALL_RULES_SEEN, true);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("the shadcn backdrop dismisses the dialog", async () => {
  vi.mocked(StorageService.get).mockReturnValue(false);
  render(<HintModal />);
  await userEvent.click(document.querySelector('[data-slot="dialog-overlay"]')!);
  expect(StorageService.set).toHaveBeenCalledWith(StorageKeys.FALL_RULES_SEEN, true);
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
