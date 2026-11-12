import type { Card } from "@/domain/entities/Card";
import type { GameState } from "@/domain/entities/GameState";
import { toCardKey } from "@/domain/helpers/card";

import {
  countRound,
  localPlayerId,
  openDeal,
  playMatchCard,
  startMatch,
  type MatchFrame,
} from "./localMatch";

function assertFullDeck(state: GameState) {
  const cards = [
    ...state.deck,
    ...state.table,
    ...state.players.flatMap(({ hand, collected }) => [...hand, ...collected]),
  ];
  expect(cards).toHaveLength(40);
  expect(new Set(cards.map(toCardKey)).size).toBe(40);
}

afterEach(() => vi.restoreAllMocks());

test.each([
  ["1vs1", 2, [1, 2]],
  ["1vs2", 3, [1, 2, 3]],
  ["2vs2", 4, [1, 2, 1, 2]],
] as const)("%s plays complete rounds and reaches a winner", (mode, seatCount, teams) => {
  let seed = 117 + seatCount;
  vi.spyOn(Math, "random").mockImplementation(() => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  });

  let [{ state }] = startMatch(mode);
  expect(state.phase).toBe("dealerChoice");
  expect(state.players).toHaveLength(seatCount);
  expect(state.players.map(({ team }) => team)).toEqual(teams);
  expect(state.players.some(({ id }) => id === state.dealer)).toBe(true);

  const events = new Set<string>();
  let completedRounds = 0;
  for (let step = 0; step < 500 && state.phase !== "gameOver"; step++) {
    let frames: MatchFrame[];
    if (state.phase === "dealerChoice") {
      frames = openDeal(state, "tableThenPlayers", "dec");
      expect(frames[0].state.table).toHaveLength(4);
      expect(frames[0].state.players.every(({ hand }) => hand.length === 3)).toBe(true);
      const dealerIndex = state.players.findIndex(({ id }) => id === state.dealer);
      expect(frames[0].state.currentPlayer).toBe(state.players[(dealerIndex + 1) % seatCount].id);
    } else if (state.phase === "roundEnd") {
      completedRounds++;
      expect(state.deck).toHaveLength(0);
      expect(state.table).toHaveLength(0);
      const totals = state.players.map(({ collected }) => collected.length);
      frames = countRound(state);
      expect(state.players.map(({ collected }) => collected.length)).toEqual(totals);
      if (frames.at(-1)?.state.phase !== "gameOver") {
        const dealerIndex = state.players.findIndex(({ id }) => id === state.dealer);
        expect(frames.at(-1)?.state.dealer).toBe(state.players[(dealerIndex + 1) % seatCount].id);
      }
    } else {
      expect(state.phase).toBe("play");
      const active = state.players.find(({ id }) => id === state.currentPlayer)!;
      expect(active.hand.length).toBeGreaterThan(0);
      const card =
        active.hand.find((held) => state.table.some(({ rank }) => rank === held.rank)) ??
        active.hand[0];
      const other = state.players.find(({ id }) => id !== active.id)!;
      expect(playMatchCard(state, other.id, card)).toEqual([]);
      frames = playMatchCard(state, active.id, card);
    }

    for (const frame of frames) {
      if (frame.motion) events.add(frame.motion.kind);
      if (frame.state.phase !== "dealerChoice") assertFullDeck(frame.state);
    }
    state = frames.at(-1)!.state;
  }

  expect(completedRounds).toBeGreaterThan(0);
  expect(events).toEqual(new Set(["deal", "play", "collect", "count"]));
  expect(state.phase).toBe("gameOver");
  expect(state.scores.values[state.winner!]).toBeGreaterThanOrEqual(state.config.targetPoints);
});

test("an immediate clean-table win stops the match without dealing another hand", () => {
  const card: Card = { suit: "coins", rank: 3 };
  const match = startMatch("1vs1")[0].state;
  const state: GameState = {
    ...match,
    phase: "play",
    currentPlayer: localPlayerId,
    scores: { type: "individual", values: { 1: 20 } },
    table: [{ suit: "swords", rank: 3 }],
    players: match.players.map((player) =>
      player.id === localPlayerId ? { ...player, hand: [card] } : player,
    ),
  };

  const frames = playMatchCard(state, localPlayerId, card);
  expect(frames.map(({ motion }) => motion?.kind)).toEqual(["play", "collect", undefined]);
  expect(frames.at(-1)?.state).toMatchObject({
    phase: "gameOver",
    winner: "1",
    deck: state.deck,
    table: [],
    scores: { values: { 1: 24 } },
  });
});
