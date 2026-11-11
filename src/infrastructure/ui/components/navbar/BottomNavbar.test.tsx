import { MemoryRouter, Route, Routes } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { MatchScreen } from "@/modules/match";
import { MATCH_PATH } from "@/routes/Routes";

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

test("the Play action opens the Tavern picker and Escape restores focus", async () => {
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
  expect(screen.getByRole("dialog", { name: "Tavern" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Duel" })).toHaveAccessibleDescription(
    "2 players Face one opponent.",
  );
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(play).toHaveFocus());
});

test.each(["Duel", "Free-for-All", "Team Match"])(
  "the %s preview opens a waiting table",
  async (label) => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/?bottomSidebar=true"]}>
        <Routes>
          <Route path="/" element={<BottomNavbar />} />
          <Route path={MATCH_PATH} element={<MatchScreen />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: label }));
    expect(setupGame).not.toHaveBeenCalled();
    expect(await screen.findByRole("main", { name: label }, { timeout: 2000 })).toBeVisible();
  },
);
