import { mockedStateWithPlayers } from "@/application/store/gameStore";
import type { Card } from "@/domain/entities/Card";
import { createDeck } from "@/domain/rules/deck";
import { HANDS } from "@/domain/rules/hands";
import {
  analyzePlay,
  finalizeAfterPlay,
  removeCardsFromHand,
  updateTableAndHandCards,
} from "@/domain/services/moves";
import { applyCountingRule } from "@/domain/services/scoring";

import {
  cascadeExample,
  cleanExample,
  fallExample,
  illustratedSings,
  scoringExample,
} from "./rulebookExamples";

function playState(played: Card, table: readonly Card[]) {
  const state = structuredClone(mockedStateWithPlayers);
  const player = state.players[0];
  state.phase = "play";
  state.currentPlayer = player.id;
  player.hand = [played];
  state.players[1].hand = [{ rank: 7, suit: "swords" }];
  state.table = [...table];
  state.deck = [{ rank: 1, suit: "cups" }];
  return { state, player };
}

test("the cascade illustration shows the planned ranks and stops at the gap", () => {
  const { played, chain, outsideChain } = cascadeExample;
  const { state, player } = playState(played, [...chain, ...outsideChain]);
  const { capturePlan } = analyzePlay(state, player.id, played);
  expect(capturePlan.kind).toBe("cascade");
  if (capturePlan.kind !== "cascade") throw new Error("Expected a cascade");
  expect(capturePlan.targets.map(({ rank, suit }) => ({ rank, suit }))).toEqual(chain);
});

test.each([
  { example: fallExample, last: fallExample.table[0], remaining: 1, deckEmpty: false },
  { example: cleanExample, last: undefined, remaining: 0, deckEmpty: false },
  { example: cleanExample, last: undefined, remaining: 0, deckEmpty: true },
])(
  "the illustrated capture awards the expected bonus for its table and deck",
  ({ example, last, remaining, deckEmpty }) => {
    const { state, player } = playState(example.played, example.table);
    state.lastPlayedCard = last;
    if (deckEmpty) state.deck = [];
    const analysis = analyzePlay(state, player.id, example.played);
    expect(analysis.isFall).toBe(Boolean(last));
    const removed = removeCardsFromHand(state, player.id, example.played);
    const captured = updateTableAndHandCards(
      { ...removed, table: [...removed.table, example.played] },
      player.id,
      example.played,
      analysis.capturePlan,
    );
    const next = finalizeAfterPlay(captured, player.id, example.played, analysis.isFall);
    expect(next.table).toHaveLength(remaining);
    expect(next.scores.values[String(player.team)] ?? 0).toBe(deckEmpty ? 0 : example.points);
  },
);

test("each illustrated Sing is a valid example of its named pattern", () => {
  for (const sing of illustratedSings) {
    const hand = HANDS.find(
      (entry) =>
        entry.name.toLowerCase() ===
        (sing.name === "Pair + any" ? "pair" : sing.name.toLowerCase()),
    );
    expect(sing.example, sing.name).toHaveLength(3);
    expect(hand?.pattern(sing.example), sing.name).toBe(true);
  }
});

test("the illustrated duel quota bonus takes the starting score to a win", () => {
  const state = structuredClone(mockedStateWithPlayers);
  const [player, opponent] = state.players;
  const deck = createDeck();
  const { captured, startingScore, earned, goal } = scoringExample;
  player.collected = deck.slice(0, captured);
  opponent.collected = deck.slice(captured);
  state.phase = "roundEnd";
  const team = String(player.team);
  state.scores.values[team] = startingScore;
  const result = applyCountingRule(state);
  expect(result.scores.values[team] - startingScore).toBe(earned);
  expect(result.scores.values[team]).toBe(goal);
  expect(result.winner).toBe(team);
});
