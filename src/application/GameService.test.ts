import { afterEach, expect } from "vitest";

import { createGameService } from "@/application/GameService";
import { initialState } from "@/application/store/gameStore";

const mockSetState = vi.fn();

describe("Game Service", () => {
  afterEach(() => {
    mockSetState.mockReset();
  });
  it("start game", () => {
    createGameService(
      vi.fn().mockReturnValue(initialState),
      mockSetState,
    ).startGame();
    expect(mockSetState).toHaveBeenCalledWith({
      ...initialState,
      deck: expect.any(Array),
      dealer: expect.any(String),
      phase: "dealerChoice",
    });
  });
  it("dealer choose", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "dealerChoice" }),
      mockSetState,
    ).dealerChoose("playersThenTable", "inc");
    expect(mockSetState).toHaveBeenCalledWith({
      ...initialState,
      deck: expect.any(Array),
      players: expect.arrayContaining([
        expect.objectContaining({
          ...initialState.players[0],
          hand: expect.any(Array),
        }),
        expect.objectContaining({
          ...initialState.players[1],
          hand: expect.any(Array),
        }),
      ]),
      table: expect.any(Array),
      currentPlayer: expect.any(String),
      phase: "announceSings",
    });
  });
});
