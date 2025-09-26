import {
  mockedState,
  mockedStateWithPlayers,
} from "@/application/store/gameStore";
import type { GameState } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

import { applyCountingRule, awardPoints, checkGameOver } from "./scoring";

describe("Scoring", () => {
  it("should award points correctly", () => {
    const score = awardPoints(
      mockedStateWithPlayers,
      mockedStateWithPlayers.players[0].id,
      4,
    );
    expect(score.scores.values[mockedStateWithPlayers.players[0].id]).toBe(4);
  });
  it("should award points correctly for teams", () => {
    const teamState: GameState = {
      ...mockedStateWithPlayers,
      scores: { type: "team", values: {} },
    };
    const score = awardPoints(teamState, teamState.players[0].id, 4);
    expect(score.scores.values[teamState.players[0].id]).toBe(4);
  });
  it("should check for game over without winner", () => {
    const state = checkGameOver(mockedState);
    expect(state.phase).toBe(state.phase);
    expect(state.winner).toBeUndefined();
  });
  it("should check for game over with winner", () => {
    const winnerState: GameState = {
      ...mockedStateWithPlayers,
      scores: {
        type: "individual",
        values: { [mockedStateWithPlayers.players[0].id]: 24 },
      },
    };
    const state = checkGameOver(winnerState);
    expect(state.phase).toBe("gameOver");
    expect(state.winner).toBe(winnerState.players[0].id);
  });
  it("should not check counting rule", () => {
    const state = applyCountingRule(mockedState);
    expect(state).toStrictEqual(mockedState);
  });
  it("should check counting rule for team", () => {
    const deck = createDeck();
    const players = mockedStateWithPlayers.players.map((player) => {
      player.collected = deck.splice(0, 21);
      return player;
    });
    const teamState: GameState = {
      ...mockedStateWithPlayers,
      players,
      scores: { type: "team", values: {} },
      dealer: "1",
      phase: "roundEnd",
    };
    const state = applyCountingRule(teamState);
    expect(state.scores.values[state.players[0].id]).toBe(1);
  });
  it("should check counting rule for individual 1 vs 1", () => {
    const deck = createDeck();
    const players = mockedStateWithPlayers.players.map((player) => {
      player.collected = deck.splice(0, 21);
      return player;
    });
    const teamState: GameState = {
      ...mockedStateWithPlayers,
      players,
      scores: { type: "individual", values: {} },
      dealer: "1",
      phase: "roundEnd",
    };
    const state = applyCountingRule(teamState);
    expect(state.scores.values[state.players[0].id]).toBe(1);
  });
  it("should check counting rule for individual 1 vs 1 vs 1", () => {
    const deck = createDeck();
    const players = mockedStateWithPlayers.players
      .concat([
        {
          id: "3",
          hand: [],
          collected: [],
          score: 0,
          team: 3,
        },
      ])
      .map((player) => {
        player.collected = deck.splice(0, 14);
        return player;
      });
    const teamState: GameState = {
      ...mockedStateWithPlayers,
      players,
      scores: { type: "individual", values: {} },
      dealer: "1",
      phase: "roundEnd",
    };
    const state = applyCountingRule(teamState);
    expect(state.scores.values[state.players[0].id]).toBe(1);
  });
});
