import { initialState, mockedStateWithPlayers } from "@/application/store/gameStore";
import type { Card, Rank } from "@/domain/entities/Card";
import type { GameState } from "@/domain/entities/GameState";

import { resolveHands } from "./resolveHands";

describe("Resolve Hands", () => {
  it("should return same state if no hands", () => {
    const state: GameState = { ...initialState, phase: "announceSings" };

    const newState = resolveHands(state);
    expect(newState).toStrictEqual(state);
  });
  it("should return same state if less than 3 cards in players hands", () => {
    const state: GameState = {
      ...structuredClone(mockedStateWithPlayers),
      phase: "announceSings",
    };
    state.players[0].hand = [
      {
        suit: "coins",
        rank: 1,
      },
    ];

    const newState = resolveHands(state);
    expect(newState).toStrictEqual(state);
  });
  function announce(hands: Card[][], allowOptional = true, dealer = "1") {
    return resolveHands({
      ...initialState,
      phase: "announceSings",
      dealer,
      config: { ...initialState.config, allowOptional },
      players: hands.map((hand, index) => ({
        id: String(index + 1),
        team: index + 1,
        hand,
        collected: [],
        score: 0,
      })),
    }).scores.values;
  }

  function pair(rank: Rank, kicker: Rank): Card[] {
    return [
      { suit: "coins", rank },
      { suit: "cups", rank },
      { suit: "swords", rank: kicker },
    ];
  }

  const noSing: Card[] = [
    { suit: "coins", rank: 1 },
    { suit: "cups", rank: 4 },
    { suit: "swords", rank: 7 },
  ];

  it.each<[Rank, Rank, number]>([
    [4, 2, 1],
    [10, 2, 2],
    [11, 2, 3],
    [12, 2, 4],
    [10, 7, 7],
  ])("scores a pair of %i with a %i kicker for %i points", (rank, kicker, points) => {
    expect(announce([pair(rank, kicker), noSing])).toEqual({ 1: points });
  });

  it.each<[Rank, number, number]>([
    [12, 12, 4],
    [11, 10, 3],
  ])("scores the house with rank %i only when enabled", (rank, housePoints, pairPoints) => {
    expect(announce([pair(rank, 1), noSing], true)).toEqual({ 1: housePoints });
    expect(announce([pair(rank, 1), noSing], false)).toEqual({ 1: pairPoints });
  });

  it("awards only the highest-scoring Sing across players", () => {
    const hands = [pair(12, 1), pair(10, 7)];
    expect(announce(hands, true)).toEqual({ 1: 12 });
    expect(announce(hands, false)).toEqual({ 2: 7 });
    expect(announce([pair(10, 2), pair(12, 3)], true, "2")).toEqual({ 2: 4 });
  });

  it("breaks a tie between Sings of the same name by strength", () => {
    expect(announce([pair(1, 3), pair(4, 2)], true, "2")).toEqual({ 2: 1 });
  });

  it("breaks an equal-strength tie in seating order from the dealer's right", () => {
    const secondPair: Card[] = [
      { suit: "swords", rank: 12 },
      { suit: "clubs", rank: 12 },
      { suit: "clubs", rank: 5 },
    ];
    expect(announce([pair(12, 2), noSing, secondPair], true, "2")).toEqual({ 3: 4 });
  });
});
