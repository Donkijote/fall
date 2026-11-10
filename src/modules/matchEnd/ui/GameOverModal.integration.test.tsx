import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GameOverModal } from "./GameOverModal";

const { navigate, resetGameState, setupGame } = vi.hoisted(() => ({
  navigate: vi.fn(),
  resetGameState: vi.fn(),
  setupGame: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("react-router", () => ({ useNavigate: () => navigate }));
vi.mock("@/application/hooks/useGameStoreState", () => ({
  useGameStoreState: () => ({
    phase: "gameOver",
    players: [
      { id: "player", team: 1 },
      { id: "bot", team: 2 },
    ],
    mainPlayer: "player",
    scores: { values: { "1": 24, "2": 10 } },
  }),
}));
vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: () => ({ resetGameState, setupGame }),
}));

beforeEach(() => vi.clearAllMocks());

test("Escape exits exactly once with the real match-end hook and shadcn dialog", async () => {
  render(<GameOverModal />);
  await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
  await userEvent.keyboard("{Escape}");
  expect(navigate).toHaveBeenCalledTimes(1);
  expect(resetGameState).toHaveBeenCalledTimes(1);
});

test("Replay and its shortcut preserve the existing game setup", async () => {
  render(<GameOverModal />);
  await userEvent.click(screen.getByRole("button", { name: /Replay/ }));
  expect(setupGame).toHaveBeenCalledWith("player", "1vs1");
  setupGame.mockClear();
  await userEvent.keyboard("r");
  expect(setupGame).toHaveBeenCalledWith("player", "1vs1");
});

test("New Game and Close retain their navigation behavior", async () => {
  render(<GameOverModal />);
  await userEvent.click(screen.getByRole("button", { name: /New Game/ }));
  expect(navigate).toHaveBeenCalledWith("/?bottomSidebar=true");
  navigate.mockClear();
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(navigate).toHaveBeenCalledTimes(1);
});
