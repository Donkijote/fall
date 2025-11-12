import { afterEach, expect, type Mock } from "vitest";

import {
  type AnimationKey,
  animationService,
} from "@/application/services/AnimationService";
import { createGameService } from "@/application/services/GameService";
import {
  initialState,
  mockedState,
  mockedStateWithPlayers,
} from "@/application/store/gameStore";
import type { Card, CardWithKey } from "@/domain/entities/Card";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

vi.mock("@/application/services/AnimationService", () => ({
  AnimationKeys: { GAME_CARDS: "GAME_CARDS" },
  animationService: {
    run: vi.fn().mockResolvedValue(undefined),
  },
}));

const mockSetState = vi.fn();

describe("Game Service", () => {
  afterEach(() => {
    mockSetState.mockReset();
    (animationService.run as unknown as ReturnType<typeof vi.fn>).mockClear();
    vi.useRealTimers();
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
      table: expect.any(Array),
      dealerSelection: expect.any(Object),
      currentPlayer: expect.any(String),
      phase: "chooseDealer",
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

  it("should play card", async () => {
    const deck = createDeck();
    const state: GameState = JSON.parse(
      JSON.stringify({
        ...mockedStateWithPlayers,
        phase: "play",
        deck,
        currentPlayer: mockedStateWithPlayers.players[0].id,
      }),
    );
    state.players[0].hand = [deck[5], deck[7], deck[1]];

    await createGameService(
      vi.fn().mockReturnValue(state),
      mockSetState,
    ).playCard(mockedStateWithPlayers.players[0].id, 0);

    expect(mockSetState).toHaveBeenCalledWith({
      ...state,
      table: expect.any(Array),
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

  it("should play card and round end", async () => {
    const deck = createDeck();

    const state: GameState = JSON.parse(
      JSON.stringify({
        ...mockedStateWithPlayers,
        phase: "play",
        currentPlayer: mockedStateWithPlayers.players[0].id,
        dealer: mockedStateWithPlayers.players[0].id,
        deck: [],
        table: [],
      }),
    );

    state.players = state.players.map((p, i) =>
      i === 0 ? { ...p, hand: [deck[5]] } : { ...p, hand: [] },
    );

    await createGameService(
      vi.fn().mockReturnValue(state),
      mockSetState,
    ).playCard(mockedStateWithPlayers.players[0].id, 0);

    const finalCall = mockSetState.mock.calls.at(-1)![0] as GameState;

    expect(finalCall.phase).toBe("roundEnd");
    expect(finalCall.players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...mockedStateWithPlayers.players[0],
          collected: expect.any(Array),
          hand: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          ...mockedStateWithPlayers.players[1],
          collected: expect.any(Array),
          hand: expect.arrayContaining([]),
        }),
      ]),
    );
    expect(finalCall.table).toEqual([]); // swept on finalize
    expect(finalCall.lastPlayedCard).toEqual(expect.any(Object));
  });

  it("should not play card due to invalid phase", async () => {
    await createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "anonymous" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });

  it("should not play card due to undefined user", async () => {
    await createGameService(
      vi.fn().mockReturnValue({ ...mockedState, phase: "play" }),
      mockSetState,
    ).playCard("3", 0);

    expect(mockSetState).not.toHaveBeenCalled();
  });

  it("should not play card due to player has no cards", async () => {
    await createGameService(
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

  it("picks a dealer card for the current human player and advances the turn", () => {
    const dealerSelectionState: GameState = {
      ...mockedStateWithPlayers,
      phase: "chooseDealer",
      currentPlayer: mockedStateWithPlayers.players[0].id,
      deck: [],
      table: [
        { suit: "coins", rank: 1 },
        { suit: "cups", rank: 7 },
        { suit: "swords", rank: 3 },
      ],
      dealerSelection: {
        order: [
          mockedStateWithPlayers.players[0].id,
          mockedStateWithPlayers.players[1].id,
        ],
        turnIndex: 0,
        pickedByKey: {
          [mockedStateWithPlayers.players[0].id]: null,
          [mockedStateWithPlayers.players[1].id]: null,
        },
        pickedKeys: new Set<string>(),
        tieOnlyPlayers: null,
        poolSize: 16,
      },
    };

    const getState = vi.fn().mockReturnValue(dealerSelectionState);
    const { pickDealerCard } = createGameService(getState, mockSetState);

    const selectedKey = "coins-1";
    pickDealerCard(selectedKey);

    expect(mockSetState).toHaveBeenCalled();
    const updatedState = mockSetState.mock.calls[0][0] as GameState;

    expect(updatedState.phase).toBe("chooseDealer");
    expect(
      updatedState.dealerSelection!.pickedByKey[
        mockedStateWithPlayers.players[0].id
      ],
    ).toBe(selectedKey);
    expect(updatedState.dealerSelection!.pickedKeys.has(selectedKey)).toBe(
      true,
    );
    expect(updatedState.currentPlayer).toBe(
      mockedStateWithPlayers.players[1].id,
    );
    expect(updatedState.dealerSelection!.turnIndex).toBe(1);
  });

  it("lets a bot pick a dealer card on its turn", () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const botTurnSelectionState: GameState = {
      ...mockedStateWithPlayers,
      phase: "chooseDealer",
      currentPlayer: mockedStateWithPlayers.players[1].id,
      deck: [],
      table: [
        { suit: "coins", rank: 2 },
        { suit: "cups", rank: 6 },
        { suit: "swords", rank: 4 },
      ],
      dealerSelection: {
        order: [
          mockedStateWithPlayers.players[0].id,
          mockedStateWithPlayers.players[1].id,
        ],
        turnIndex: 1,
        pickedByKey: {
          [mockedStateWithPlayers.players[0].id]: null,
          [mockedStateWithPlayers.players[1].id]: null,
        },
        pickedKeys: new Set<string>(),
        tieOnlyPlayers: null,
        poolSize: 16,
      },
    };

    const getState = vi.fn().mockReturnValue(botTurnSelectionState);
    const { botPickDealerCard } = createGameService(getState, mockSetState);

    botPickDealerCard(mockedStateWithPlayers.players[1].id);
    vi.advanceTimersByTime(800);

    expect(mockSetState).toHaveBeenCalled();
    const updatedState = mockSetState.mock.calls[0][0] as GameState;

    const botPickedKey =
      updatedState.dealerSelection!.pickedByKey[
        mockedStateWithPlayers.players[1].id
      ];
    expect(typeof botPickedKey).toBe("string");
    expect(
      botPickedKey &&
        updatedState.dealerSelection!.pickedKeys.has(botPickedKey),
    ).toBe(true);
  });

  it("playCard performs capture cascade: sets UI overrides, runs GAME_CARDS twice, then PILE_COLLECT", async () => {
    vi.resetModules();

    const uiFns = {
      setPlayingCard: vi.fn(),
      setCaptureOverride: vi.fn(),
      addCascadeFollower: vi.fn(),
      clearUI: vi.fn(),
    };

    vi.doMock("@/application/store/uiGameStore", () => ({
      useUIGameStore: { getState: () => ({ service: uiFns }) },
    }));

    vi.doMock("@/application/services/AnimationService", () => ({
      AnimationKeys: { GAME_CARDS: "GAME_CARDS", PILE_COLLECT: "PILE_COLLECT" },
      animationService: { run: vi.fn().mockResolvedValue(undefined) },
    }));

    const analyzePlay = vi.fn(() => ({
      ok: true,
      capturePlan: {
        kind: "capture",
        targets: [
          { key: "coins-2", suit: "coins", rank: 2 },
          { key: "coins-3", suit: "coins", rank: 3 },
        ],
      },
    }));

    const removeCardsFromHand = vi.fn(
      (state: GameState, pid: string, card: Card) => ({
        ...state,
        players: state.players.map((p) =>
          p.id === pid ? { ...p, hand: p.hand.filter((c) => c !== card) } : p,
        ),
      }),
    );

    const updateTableAndHandCards = vi.fn((state) => state);
    const finalizeAfterPlay = vi.fn((state) => state);

    vi.doMock("@/domain/services/moves", () => ({
      analyzePlay,
      removeCardsFromHand,
      updateTableAndHandCards,
      finalizeAfterPlay,
    }));

    vi.doMock("@/domain/helpers/card", () => ({
      toCardKey: (c: CardWithKey) => c.key ?? `${c.suit}-${c.rank}`,
    }));

    const { createGameService } = await import(
      "@/application/services/GameService"
    );
    const { animationService, AnimationKeys } = await import(
      "@/application/services/AnimationService"
    );

    const setState = vi.fn();
    const state: GameState = {
      phase: "play",
      currentPlayer: "p1",
      players: [
        {
          id: "p1",
          hand: [{ suit: "coins", rank: 1 }],
          collected: [],
          score: 0,
          team: 1,
        },
        { id: "bot-1", hand: [], collected: [], score: 0, team: 2 },
      ],
      table: [],
      deck: [],
      scores: { type: "individual", values: {} },
      mainPlayer: "p1",
    } as unknown as GameState;

    await createGameService(() => state, setState).playCard("p1", 0);

    expect(uiFns.setPlayingCard).toHaveBeenCalledWith({
      suit: "coins",
      rank: 1,
    });
    expect(uiFns.setCaptureOverride).toHaveBeenCalledWith({
      fromKey: "coins-1",
      toKey: "coins-2",
    });
    expect(uiFns.addCascadeFollower).toHaveBeenCalledWith("coins-2");
    expect(uiFns.setCaptureOverride).toHaveBeenCalledWith({
      fromKey: "coins-1",
      toKey: "coins-3",
    });
    expect(uiFns.addCascadeFollower).toHaveBeenCalledWith("coins-3");
    expect(uiFns.clearUI).toHaveBeenCalled();

    const runCalls = (animationService.run as Mock).mock.calls.map(
      (c: Array<{ key: AnimationKey; playload: Card }>) => c[0],
    );

    const keysRun = runCalls.flat().map((e) => e.key);

    expect(
      keysRun.filter((k: string) => k === AnimationKeys.GAME_CARDS),
    ).toHaveLength(2);
    expect(keysRun.includes(AnimationKeys.PILE_COLLECT)).toBe(true);
  });

  it("playCard with no capture does not run cascade or PILE_COLLECT, but still sets/clears UI appropriately", async () => {
    vi.resetModules();

    const uiFns = {
      setPlayingCard: vi.fn(),
      setCaptureOverride: vi.fn(),
      addCascadeFollower: vi.fn(),
      clearUI: vi.fn(),
    };

    vi.doMock("@/application/store/uiGameStore", () => ({
      useUIGameStore: { getState: () => ({ service: uiFns }) },
    }));

    vi.doMock("@/application/services/AnimationService", () => ({
      AnimationKeys: { GAME_CARDS: "GAME_CARDS", PILE_COLLECT: "PILE_COLLECT" },
      animationService: { run: vi.fn().mockResolvedValue(undefined) },
    }));

    const analyzePlay = vi.fn(() => ({
      ok: true,
      capturePlan: { kind: "none", targets: [] },
    }));

    const removeCardsFromHand = vi.fn(
      (state: GameState, pid: string, card: Card) => ({
        ...state,
        players: state.players.map((p) =>
          p.id === pid ? { ...p, hand: p.hand.filter((c) => c !== card) } : p,
        ),
      }),
    );

    const updateTableAndHandCards = vi.fn((state) => state);
    const finalizeAfterPlay = vi.fn((state) => state);

    vi.doMock("@/domain/services/moves", () => ({
      analyzePlay,
      removeCardsFromHand,
      updateTableAndHandCards,
      finalizeAfterPlay,
    }));

    vi.doMock("@/domain/helpers/card", () => ({
      toCardKey: (c: CardWithKey) => c.key ?? `${c.suit}-${c.rank}`,
    }));

    const { createGameService } = await import(
      "@/application/services/GameService"
    );
    const { animationService, AnimationKeys } = await import(
      "@/application/services/AnimationService"
    );

    const setState = vi.fn();
    const state = {
      phase: "play",
      currentPlayer: "p1",
      players: [
        {
          id: "p1",
          hand: [{ suit: "coins", rank: 1 }],
          collected: [],
          score: 0,
          team: 1,
        },
        { id: "bot-1", hand: [], collected: [], score: 0, team: 2 },
      ],
      table: [],
      deck: [],
      scores: { type: "individual", values: {} },
      mainPlayer: "p1",
    } as unknown as GameState;

    await createGameService(() => state, setState).playCard("p1", 0);

    expect(uiFns.setPlayingCard).toHaveBeenCalledWith({
      suit: "coins",
      rank: 1,
    });
    expect(uiFns.setCaptureOverride).toHaveBeenCalledWith(null);
    expect(uiFns.addCascadeFollower).not.toHaveBeenCalled();
    expect(uiFns.clearUI).toHaveBeenCalled();

    const runCalls = (animationService.run as Mock).mock.calls.map(
      (c: Array<{ key: AnimationKey; playload: Card }>) => c[0],
    );

    const keysRun = runCalls.flat().map((e) => e.key);

    expect(keysRun.includes(AnimationKeys.GAME_CARDS)).toBe(false);
    expect(keysRun.includes(AnimationKeys.PILE_COLLECT)).toBe(false);
  });
});
