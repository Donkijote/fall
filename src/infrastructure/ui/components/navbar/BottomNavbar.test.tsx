import { MemoryRouter } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BottomNavbar } from "./BottomNavbar";

const { setupGame } = vi.hoisted(() => ({ setupGame: vi.fn() }));
vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: () => ({ setupGame }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  StorageService.set(StorageKeys.FALL_USER, { id: "player", username: "Player" });
});

test("the Play action opens the game-mode sheet and Escape restores focus", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <BottomNavbar />
    </MemoryRouter>,
  );
  const play = screen.getByRole("button", { name: "Play" });
  expect(play).not.toHaveTextContent(/play/i);
  expect(play).toHaveClass("size-20", "cursor-pointer");
  await user.click(play);
  expect(screen.getByRole("dialog", { name: "Choose your game" })).toBeVisible();
  expect(screen.getByRole("dialog")).toHaveClass("data-[side=bottom]:h-dvh");
  expect(screen.getByRole("button", { name: "Play 1 vs 1" })).toHaveAccessibleDescription(
    "Classic duel",
  );
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(play).toHaveFocus());
});

test.each(["1 vs 1", "1 vs 2", "2 vs 2"])(
  "the %s mode starts the corresponding game",
  async (label) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/?bottomSidebar=true"]}>
        <BottomNavbar />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: `Play ${label}` }));
    expect(setupGame).toHaveBeenCalledWith("player", label.replaceAll(" ", ""));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
);
