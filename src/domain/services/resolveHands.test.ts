import {
  initialState,
  mockedStateWithPlayers,
} from "@/application/store/gameStore";
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
      ...mockedStateWithPlayers,
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
  it("should resolve simple best hand", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      phase: "announceSings",
    };
    state.players[0].hand = [
      {
        suit: "coins",
        rank: 1,
      },
      {
        suit: "cups",
        rank: 2,
      },
      {
        suit: "swords",
        rank: 3,
      },
    ];
    state.players[1].hand = [
      {
        suit: "coins",
        rank: 4,
      },
      {
        suit: "cups",
        rank: 7,
      },
      {
        suit: "swords",
        rank: 4,
      },
    ];

    const newState = resolveHands(state);
    expect(newState.scores.values[state.players[0].id]).toBeGreaterThan(0);
  });
  it("should resolve tie best hand by higher rank", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      phase: "announceSings",
    };
    state.players[0].hand = [
      {
        suit: "coins",
        rank: 1,
      },
      {
        suit: "cups",
        rank: 1,
      },
      {
        suit: "swords",
        rank: 3,
      },
    ];
    state.players[1].hand = [
      {
        suit: "coins",
        rank: 4,
      },
      {
        suit: "cups",
        rank: 4,
      },
      {
        suit: "swords",
        rank: 2,
      },
    ];

    const newState = resolveHands(state);
    expect(newState.scores.values[state.players[0].team!]).toBeUndefined();
    expect(newState.scores.values[state.players[1].team!]).toBeGreaterThan(0);
  });
  it("should resolve tie best hand by dealers right", () => {
    const state: GameState = {
      ...mockedStateWithPlayers,
      phase: "announceSings",
      dealer: "2",
    };
    state.players[0].hand = [
      {
        suit: "coins",
        rank: 1,
      },
      {
        suit: "cups",
        rank: 1,
      },
      {
        suit: "swords",
        rank: 3,
      },
    ];
    state.players[1].hand = [
      {
        suit: "coins",
        rank: 3,
      },
      {
        suit: "cups",
        rank: 7,
      },
      {
        suit: "swords",
        rank: 2,
      },
    ];
    state.players.push({
      id: "3",
      hand: [
        {
          suit: "coins",
          rank: 1,
        },
        {
          suit: "cups",
          rank: 1,
        },
        {
          suit: "swords",
          rank: 3,
        },
      ],
      score: 0,
      team: 3,
      collected: [],
    });

    const newState = resolveHands(state);
    expect(newState.scores.values[state.players[0].id]).toBeGreaterThan(0);
    expect(newState.scores.values[state.players[1].id]).toBeUndefined();
    expect(newState.scores.values[state.players[2].id]).toBeUndefined();
  });
});
