import { afterEach, expect } from "vitest";

import { createGameService } from "@/application/services/GameService";
import {
  initialState,
  mockedState,
  mockedStateWithPlayers,
} from "@/application/store/gameStore";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

const mockSetState = vi.fn();

describe("Game Service", () => {
  afterEach(() => {
    mockSetState.mockReset();
  });
  it("should setup game", () => {
    createGameService(
      vi.fn().mockReturnValue(mockedState),
      mockSetState,
    ).setupGame("1", "1vs1");

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      phase: "deal",
    });
  });
  it("should setup game 1vs2", () => {
    createGameService(
      vi.fn().mockReturnValue(mockedState),
      mockSetState,
    ).setupGame("1", "1vs2");

    const players = [...mockedStateWithPlayers.players];
    players.push({
      ...mockedStateWithPlayers.players[0],
      id: "bot-2",
      team: 3,
    });

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      phase: "deal",
      players,
    });
  });
  it("should setup game 2vs2", () => {
    createGameService(
      vi.fn().mockReturnValue(mockedState),
      mockSetState,
    ).setupGame("1", "2vs2");

    const players = [...mockedStateWithPlayers.players];
    players.push(
      {
        ...mockedStateWithPlayers.players[0],
        id: "bot-2",
        team: 1,
      },
      {
        ...mockedStateWithPlayers.players[0],
        id: "bot-3",
        team: 2,
      },
    );

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      phase: "deal",
      players,
      scores: { type: "team", values: {} },
    });
  });
  it("should start game", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedStateWithPlayers, phase: "deal" }),
      mockSetState,
    ).startGame();

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      deck: expect.any(Array),
      dealer: expect.any(String),
      phase: "dealerChoice",
    });
  });
  it("should not start game due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "gameOver" }),
      mockSetState,
    ).startGame();

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should dealer choose", () => {
    createGameService(
      vi.fn().mockReturnValue(
        JSON.parse(
          JSON.stringify({
            ...mockedStateWithPlayers,
            phase: "dealerChoice",
          }),
        ),
      ),
      mockSetState,
    ).dealerChoose("playersThenTable", "inc");

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      deck: expect.any(Array),
      players: expect.arrayContaining([
        expect.objectContaining({
          ...mockedStateWithPlayers.players[0],
          hand: expect.any(Array),
        }),
        expect.objectContaining({
          ...mockedStateWithPlayers.players[1],
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
      vi.fn().mockReturnValue({ ...mockedState, phase: "gameOver" }),
      mockSetState,
    ).dealerChoose("playersThenTable", "inc");

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should announce sings", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "announceSings" }),
      mockSetState,
    ).announceSings();

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedState,
      phase: "play",
    });
  });
  it("should not announce sings due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "gameOver" }),
      mockSetState,
    ).announceSings();

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should play card", () => {
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({ ...mockedStateWithPlayers, phase: "play", deck }),
    );
    state.players[0].hand = [deck[5], deck[7], deck[1]];
    createGameService(vi.fn().mockReturnValue(state), mockSetState).playCard(
      mockedStateWithPlayers.players[0].id,
      0,
    );

    expect(mockSetState).toHaveBeenCalledWith({
      ...state,
      players: expect.arrayContaining([
        expect.objectContaining({
          ...mockedStateWithPlayers.players[0],
          hand: expect.arrayContaining([deck[7], deck[1]]),
        }),
        expect.objectContaining({
          ...mockedStateWithPlayers.players[1],
          hand: expect.arrayContaining([]),
        }),
      ]),
    });
  });
  it("should play card and round end", () => {
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({
        ...mockedStateWithPlayers,
        phase: "play",
        currentPlayer: mockedStateWithPlayers.players[0].id,
      }),
    );
    state.players[0].hand = [deck[5]];
    createGameService(vi.fn().mockReturnValue(state), mockSetState).playCard(
      mockedStateWithPlayers.players[0].id,
      0,
    );

    expect(mockSetState).toHaveBeenCalledWith({
      ...state,
      players: expect.arrayContaining([
        expect.objectContaining({
          ...mockedStateWithPlayers.players[0],
          hand: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          ...mockedStateWithPlayers.players[1],
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
      vi.fn().mockReturnValue({ ...mockedState, phase: "anonymous" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should not play card due to undefined user", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "play" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should not play card due to player has no cards", () => {
    createGameService(
      vi.fn().mockReturnValue({ ...mockedStateWithPlayers, phase: "play" }),
      mockSetState,
    ).playCard(mockedStateWithPlayers.players[0].id, 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should end round with next dealer", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...mockedStateWithPlayers,
        phase: "roundEnd",
        dealer: mockedStateWithPlayers.players[0].id,
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      phase: "dealerChoice",
      table: [],
      deck: [],
      dealer: mockedStateWithPlayers.players[1].id,
    });
  });
  it("should end round with game over", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...mockedStateWithPlayers,
        phase: "roundEnd",
        dealer: mockedStateWithPlayers.players[0].id,
        scores: {
          type: "individual",
          values: {
            [mockedStateWithPlayers.players[0].id]: 24,
          },
        },
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      table: [],
      deck: [],
      dealer: mockedStateWithPlayers.players[0].id,
      phase: "gameOver",
      winner: mockedStateWithPlayers.players[0].id,
      scores: {
        type: "individual",
        values: {
          [mockedStateWithPlayers.players[0].id]: 24,
        },
      },
    });
  });
  it("should not end round due to different phase", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...mockedStateWithPlayers,
        phase: "play",
        dealer: mockedStateWithPlayers.players[0].id,
      }),
      mockSetState,
    ).endRound();

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should be bot's turn", () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({
        ...mockedStateWithPlayers,
        phase: "play",
        deck,
        currentPlayer: mockedStateWithPlayers.players[1].id,
      }),
    );
    state.players[1].hand = [deck[5], deck[7], deck[1]];

    createGameService(vi.fn().mockReturnValue(state), mockSetState).playBotTurn(
      mockedStateWithPlayers.players[1].id,
    );

    vi.advanceTimersByTime(1000);

    expect(mockSetState).toHaveBeenCalled();
  });
  it("should not be bot's turn because empty hand", () => {
    createGameService(
      vi.fn().mockReturnValue(mockedStateWithPlayers),
      mockSetState,
    ).playBotTurn(mockedStateWithPlayers.players[1].id);

    expect(mockSetState).not.toHaveBeenCalled();
  });
  it("should be bot's dealer choose", () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    createGameService(
      vi.fn().mockReturnValue({
        ...mockedStateWithPlayers,
        dealer: mockedStateWithPlayers.players[1].id,
        phase: "dealerChoice",
      }),
      mockSetState,
    ).botDealerChoose(mockedStateWithPlayers.players[1].id);

    vi.advanceTimersByTime(1000);

    expect(mockSetState).toHaveBeenCalledWith({
      ...mockedStateWithPlayers,
      deck: expect.any(Array),
      players: expect.arrayContaining([
        expect.objectContaining({
          ...mockedStateWithPlayers.players[0],
          hand: expect.any(Array),
        }),
        expect.objectContaining({
          ...mockedStateWithPlayers.players[1],
          hand: expect.any(Array),
        }),
      ]),
      table: expect.any(Array),
      currentPlayer: expect.any(String),
      scores: expect.any(Object),
      dealer: mockedStateWithPlayers.players[1].id,
      phase: "announceSings",
      config: {
        ...mockedStateWithPlayers.config,
        tablePattern: expect.any(String),
        dealOrder: expect.any(String),
      },
    });
  });
  it("should reset game", () => {
    createGameService(
      vi.fn().mockReturnValue({
        ...mockedStateWithPlayers,
        phase: "play",
        dealer: mockedStateWithPlayers.players[0].id,
      }),
      mockSetState,
    ).resetGameState();

    expect(mockSetState).toHaveBeenCalledWith(initialState);
  });
});
