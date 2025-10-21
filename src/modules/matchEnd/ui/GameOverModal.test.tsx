import * as useMatchEnd from "@/modules/matchEnd/application/useMatchEnd";

import { render } from "@testing-library/react";

import { GameOverModal } from "./GameOverModal";

const mockedUseMatchEnd = vi.spyOn(useMatchEnd, "useMatchEnd");

describe("Game Over Modal", () => {
  it("should render win", () => {
    mockedUseMatchEnd.mockReturnValue({
      isFinished: true,
      gameResult: "win",
      stats: {
        teamScore: "1 - 24",
      },
      onExit: vi.fn(),
      onReplay: vi.fn(),
      onNewGame: vi.fn(),
    });
    const { getByTestId } = render(<GameOverModal />);

    expect(getByTestId("gameOverModal")).toBeInTheDocument();
    expect(getByTestId("gameOverModal-title-win")).toBeInTheDocument();
  });
  it("should render lose", () => {
    mockedUseMatchEnd.mockReturnValue({
      isFinished: true,
      gameResult: "lose",
      stats: {
        teamScore: "1 - 24",
      },
      onExit: vi.fn(),
      onReplay: vi.fn(),
      onNewGame: vi.fn(),
    });
    const { getByTestId } = render(<GameOverModal />);

    expect(getByTestId("gameOverModal")).toBeInTheDocument();
    expect(getByTestId("gameOverModal-title-lose")).toBeInTheDocument();
  });
});
