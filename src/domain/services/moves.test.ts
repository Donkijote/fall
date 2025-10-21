import { mockedStateWithPlayers } from "@/application/store/gameStore";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

import { playCard } from "./moves";

const deck = createDeck();

describe("Moves", () => {
  it("should return state if not current player", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    const newState = playCard(state, "player-2", deck[0]);
    expect(newState).toBe(state);
  });
  it("should return state if player has not played card", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    state.players[0].hand = [deck[1], deck[2], deck[3]];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(newState).toBe(state);
  });
  it("should add played card to the table", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
    };
    state.players[0].hand = [deck[0], deck[2], deck[3]];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(newState.table).toContain(deck[0]);
  });
  it("should capture last table card, get clean table points", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck,
      currentPlayer: mockedStateWithPlayers.players[0].id,
      table: [deck[0]],
      lastPlayedCard: deck[1],
    };
    state.players[0].hand = [deck[0], deck[2], deck[3]];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
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
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[11],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected).toHaveLength(2);
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
    state.players[0].collected = [];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[17],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected).toHaveLength(2);
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
    state.players[0].collected = [];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[18],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected).toHaveLength(2);
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
    state.players[0].collected = [];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[19],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected).toHaveLength(2);
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
    state.players[0].collected = [];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    expect(newState.table).toHaveLength(1);
    expect(newState.players[0].collected).toHaveLength(3);
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
    state.players[0].collected = [];
    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );
    newState.players.forEach((player) => {
      expect(player.hand).toHaveLength(3);
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
    state.players[0].collected = [];

    const newState = playCard(
      state,
      mockedStateWithPlayers.players[0].id,
      deck[0],
    );

    expect(newState.table).toHaveLength(0);
    expect(newState.players[0].collected).toHaveLength(2);
    expect(
      newState.scores.values[mockedStateWithPlayers.players[0].id] ?? 0,
    ).toBe(0);
  });
  it("should give leftover table to the last capturer at the true end (deck empty, all hands empty)", () => {
    const p0 = mockedStateWithPlayers.players[0].id;
    const p1 = mockedStateWithPlayers.players[1].id;

    // Make sure it's the final round: no deck left.
    const state: GameState = {
      ...mockedStateWithPlayers,
      deck: [],
      currentPlayer: p0,
      // Two arbitrary table cards (ranks don't matter except != played card rank)
      table: [
        { suit: "cups", rank: 2 },
        { suit: "swords", rank: 3 },
      ],
      lastPlayedCard: undefined,
      // Someone captured earlier in the deal/round:
      lastCaptureBy: p1,
    };

    // Hands: only current player has exactly one card to play; others are empty.
    state.players = state.players.map((pl, idx) =>
      idx === 0
        ? { ...pl, hand: [{ suit: "clubs", rank: 5 }], collected: [] }
        : { ...pl, hand: [], collected: [] },
    );

    const newState = playCard(state, p0, { suit: "clubs", rank: 5 });

    // Table should be swept to lastCaptureBy (p1), including the freshly played card.
    const leftoverCount = 3; // 2 existing on table + 1 just played (no capture)
    expect(newState.table).toHaveLength(0);

    const p1After = newState.players.find((p) => p.id === p1)!;
    expect(p1After.collected).toHaveLength(leftoverCount);

    // Tracker should be cleared after the sweep.
    expect(newState.lastCaptureBy).toBeNull();
  });

  it("should give leftover table to the dealer if nobody captured in the deal (fallback)", () => {
    const p0 = mockedStateWithPlayers.players[0].id;
    const dealerId = mockedStateWithPlayers.players[1].id; // choose player[1] as dealer for clarity

    const state: GameState = {
      ...mockedStateWithPlayers,
      deck: [],
      currentPlayer: p0,
      dealer: dealerId,
      table: [
        { suit: "swords", rank: 7 },
        { suit: "clubs", rank: 4 },
      ],
      lastPlayedCard: undefined,
      lastCaptureBy: null, // nobody captured this deal
    };

    // Hands: only current player has a non-matching single card to end the round.
    state.players = state.players.map((pl, idx) =>
      idx === 0
        ? { ...pl, hand: [{ suit: "coins", rank: 1 }], collected: [] }
        : { ...pl, hand: [], collected: [] },
    );

    const newState = playCard(state, p0, { suit: "coins", rank: 1 });

    // All leftovers (2 on table + 1 just played) go to the dealer.
    const leftoverCount = 3;
    expect(newState.table).toHaveLength(0);

    const dealerAfter = newState.players.find((p) => p.id === dealerId)!;
    expect(dealerAfter.collected).toHaveLength(leftoverCount);

    // Tracker should be cleared after the sweep.
    expect(newState.lastCaptureBy).toBeNull();
  });
});
