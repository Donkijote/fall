import { mockedStateWithPlayers } from "@/application/store/gameStore";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

import {
  analyzePlay,
  finalizeAfterPlay,
  removeCardsFromHand,
  updateTableAndHandCards,
} from "./moves";

const deck = createDeck();

describe("Moves", () => {
  const runPlay = (
    state: GameState,
    playerId: string,
    card = state.players[0].hand[0],
  ) => {
    const analysis = analyzePlay(state, playerId, card);
    if (!analysis.ok) return state;
    const s1 = removeCardsFromHand(state, playerId, card);
    const s2 = updateTableAndHandCards(
      s1,
      playerId,
      card,
      analysis.capturePlan,
    );
    return finalizeAfterPlay(s2, playerId, card);
  };

  it("should return state if not current player", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    const newState = analyzePlay(state, "player-2", deck[0]);
    expect(newState.ok).toBe(false);
    expect(newState.reason).toBe("not-current-player");
  });

  it("should return state if player has not played card", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    state.players[0].hand = [deck[1], deck[2], deck[3]];
    const analysis = analyzePlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(analysis.ok).toBe(false);
    expect(analysis.reason).toBe("card-not-in-hand");
  });

  it("should add played card to the table", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    state.players[0].hand = [deck[0], deck[2], deck[3]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(
      newState.table.some(
        (c) => c.suit === deck[0].suit && c.rank === deck[0].rank,
      ),
    ).toBe(true);
  });

  it("should capture last table card, get clean table points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0]],
      lastPlayedCard: deck[1],
    };
    state.players[0].hand = [deck[10], deck[2], deck[3]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[10],
    );
    expect(newState.table).toHaveLength(0);
    expect(newState.players[0].collected).toHaveLength(2);
    expect(newState.scores.values[mockedStateWithPlayers.players[0].id]).toBe(
      4,
    );
  });

  it("should capture last played card, get fall points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[1]],
      lastPlayedCard: deck[1],
    };
    state.players[0].hand = [deck[10], deck[11], deck[6]];
    state.players[0].collected = [];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[11],
    );
    expect(newState.table.length).toBeGreaterThanOrEqual(1);
    expect(newState.players[0].collected.length).toBeGreaterThanOrEqual(2);
    expect(newState.scores.values[mockedStateWithPlayers.players[0].id]).toBe(
      1,
    );
  });

  it("should capture last 10 played card, get 2 fall points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[7]],
      lastPlayedCard: deck[7],
    };
    state.players[0].hand = [deck[10], deck[17], deck[6]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[17],
    );
    expect(newState.players[0].collected.length).toBeGreaterThanOrEqual(2);
    expect(newState.scores.values[mockedStateWithPlayers.players[0].id]).toBe(
      2,
    );
  });

  it("should capture last 11 played card, get 3 fall points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[8]],
      lastPlayedCard: deck[8],
    };
    state.players[0].hand = [deck[10], deck[18], deck[6]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[18],
    );
    expect(newState.players[0].collected.length).toBeGreaterThanOrEqual(2);
    expect(newState.scores.values[mockedStateWithPlayers.players[0].id]).toBe(
      3,
    );
  });

  it("should capture last 12 played card, get 4 fall points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[9]],
      lastPlayedCard: deck[9],
    };
    state.players[0].hand = [deck[10], deck[19], deck[6]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[19],
    );
    expect(newState.players[0].collected.length).toBeGreaterThanOrEqual(2);
    expect(newState.scores.values[mockedStateWithPlayers.players[0].id]).toBe(
      4,
    );
  });

  it("should capture in cascade", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[1], deck[7]],
      lastPlayedCard: deck[7],
    };
    state.players[0].hand = [deck[0], deck[7], deck[4]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected.length).toBeGreaterThanOrEqual(2);
  });

  it("should redeal if all players hands are empty", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0], deck[1], deck[7]],
      lastPlayedCard: deck[7],
    };
    state.players[0].hand = [deck[0]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    newState.players.forEach((player) => {
      expect(player.hand.length).toBeGreaterThan(0);
    });
  });

  it("should NOT award clean table points when deck is empty (last round)", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck: [],
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0]],
      lastPlayedCard: deck[1],
    };
    state.players[0].hand = [deck[0], deck[2], deck[3]];
    const newState = runPlay(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(newState.table).toHaveLength(0);
    expect(newState.players[0].collected.length).toBe(2);
    expect(
      newState.scores.values[mockedStateWithPlayers.players[0].id] ?? 0,
    ).toBe(0);
  });

  it("should give leftover table to the last capturer at the true end (deck empty, all hands empty)", () => {
    const p0 = mockedStateWithPlayers.players[0].id;
    const p1 = mockedStateWithPlayers.players[1].id;

    const state: GameState = {
      ...mockedStateWithPlayers,
      deck: [],
      currentPlayer: p0,
      table: [
        { suit: "cups", rank: 2 },
        { suit: "swords", rank: 3 },
      ],
      lastCaptureBy: p1,
    };
    state.players = state.players.map((pl, idx) =>
      idx === 0
        ? { ...pl, hand: [{ suit: "clubs", rank: 5 }], collected: [] }
        : { ...pl, hand: [], collected: [] },
    );

    const newState = runPlay(state, p0, { suit: "clubs", rank: 5 });
    expect(newState.table).toHaveLength(0);
    const p1After = newState.players.find((p) => p.id === p1)!;
    expect(p1After.collected.length).toBe(3);
    expect(newState.lastCaptureBy).toBeNull();
  });

  it("should give leftover table to the dealer if nobody captured in the deal (fallback)", () => {
    const p0 = mockedStateWithPlayers.players[0].id;
    const dealerId = mockedStateWithPlayers.players[1].id;

    const state: GameState = {
      ...mockedStateWithPlayers,
      deck: [],
      currentPlayer: p0,
      dealer: dealerId,
      table: [
        { suit: "swords", rank: 7 },
        { suit: "clubs", rank: 4 },
      ],
      lastCaptureBy: null,
    };
    state.players = state.players.map((pl, idx) =>
      idx === 0
        ? { ...pl, hand: [{ suit: "coins", rank: 1 }], collected: [] }
        : { ...pl, hand: [], collected: [] },
    );

    const newState = runPlay(state, p0, { suit: "coins", rank: 1 });
    expect(newState.table).toHaveLength(0);
    const dealerAfter = newState.players.find((p) => p.id === dealerId)!;
    expect(dealerAfter.collected.length).toBe(3);
    expect(newState.lastCaptureBy).toBeNull();
  });
});
