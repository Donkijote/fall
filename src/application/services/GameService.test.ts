import { afterEach, expect } from "vitest";

import { createGameService } from "@/application/services/GameService";
import { initialState } from "@/application/store/gameStore";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

const mockSetState = vi.fn();

describe("Game Service", () => {
  afterEach(() => {
    mockSetState.mockReset();
  });
  it("should start game", () => {
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
  it("should not start game due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "gameOver" }),
      mockSetState,
    ).startGame();

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should dealer choose", () => {
    createGameService(
      vi
        .fn()
        .mockReturnValue(
          JSON.parse(
            JSON.stringify({ ...initialState, phase: "dealerChoice" }),
          ),
        ),
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
      scores: expect.any(Object),
      phase: "announceSings",
    });
  });
  it("should not dealer choose due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "gameOver" }),
      mockSetState,
    ).dealerChoose("playersThenTable", "inc");

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should announce sings", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "announceSings" }),
      mockSetState,
    ).announceSings();

    expect(mockSetState).toHaveBeenCalledWith({
      ...initialState,
      phase: "play",
    });
  });
  it("should not announce sings due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "gameOver" }),
      mockSetState,
    ).announceSings();

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should play card", () => {
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({ ...initialState, phase: "play", deck }),
    );
    state.players[0].hand = [deck[5], deck[7], deck[1]];
    createGameService(vi.fn().mockReturnValue(state), mockSetState).playCard(
      initialState.players[0].id,
      0,
    );

    expect(mockSetState).toHaveBeenCalledWith({
      ...state,
      players: expect.arrayContaining([
        expect.objectContaining({
          ...initialState.players[0],
          hand: expect.arrayContaining([deck[7], deck[1]]),
        }),
        expect.objectContaining({
          ...initialState.players[1],
          hand: expect.arrayContaining([]),
        }),
      ]),
    });
  });
  it("should play card and round end", () => {
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({
        ...initialState,
        phase: "play",
        currentPlayer: initialState.players[0].id,
      }),
    );
    state.players[0].hand = [deck[5]];
    createGameService(vi.fn().mockReturnValue(state), mockSetState).playCard(
      initialState.players[0].id,
      0,
    );

    expect(mockSetState).toHaveBeenCalledWith({
      ...state,
      players: expect.arrayContaining([
        expect.objectContaining({
          ...initialState.players[0],
          hand: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          ...initialState.players[1],
          hand: expect.arrayContaining([]),
        }),
      ]),
      table: expect.any(Array),
      currentPlayer: expect.any(String),
      scores: expect.any(Object),
      phase: "roundEnd",
      lastPlayedCard: expect.any(Object),
    });
  });
  it("should not play card due to invalid phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "anonymous" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should not play card due to undefined user", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "play" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should not play card due to player has no cards", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...initialState, phase: "play" }),
      mockSetState,
    ).playCard(initialState.players[0].id, 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should end round with next dealer", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...initialState,
        phase: "roundEnd",
        dealer: initialState.players[0].id,
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).toHaveBeenCalledWith({
      ...initialState,
      phase: "dealerChoice",
      table: [],
      deck: [],
      dealer: initialState.players[1].id,
    });
  });
  it("should end round with game over", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...initialState,
        phase: "roundEnd",
        dealer: initialState.players[0].id,
        scores: {
          type: "individual",
          values: {
            [initialState.players[0].id]: 24,
          },
        },
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).toHaveBeenCalledWith({
      ...initialState,
      table: [],
      deck: [],
      dealer: initialState.players[0].id,
      phase: "gameOver",
      winner: initialState.players[0].id,
      scores: {
        type: "individual",
        values: {
          [initialState.players[0].id]: 24,
        },
      },
    });
  });
  it("should not end round due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...initialState,
        phase: "play",
        dealer: initialState.players[0].id,
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).not.toHaveBeenCalled();
  });
});
