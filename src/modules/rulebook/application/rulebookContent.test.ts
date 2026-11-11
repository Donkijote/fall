import { RULES } from "@/domain/constants/rules";
import type { GameState } from "@/domain/entities/GameState";
import { analyzePlay, updateTableAndHandCards } from "@/domain/services/moves";

import { captureExample, chapters, findRules } from "./rulebookContent";

test("retains every source rule exactly once across the full chapters", () => {
  const original = RULES.sections.flatMap((section) => section.items);
  const mapped = chapters.flatMap((chapter) => chapter.items);
  expect(mapped).toHaveLength(original.length);
  for (const item of original) expect(mapped.filter((entry) => entry === item)).toHaveLength(1);
});

test("search finds glossary definitions, source callouts and combination exceptions", () => {
  expect(findRules("capture pile").some((entry) => entry.chapter === "variations")).toBe(true);
  expect(findRules("instant agreed").some((entry) => entry.title === "Three of a kind")).toBe(true);
  expect(findRules("pattern bonus").some((entry) => entry.id === "deal-choices")).toBe(true);
  expect(findRules(" ")).toEqual([]);
});

test("the introductory diagram agrees with the implemented capture behavior", () => {
  const played = captureExample.played;
  const state: GameState = {
    players: [{ id: "reader", hand: [played], collected: [], team: 1, score: 0 }],
    table: [...captureExample.table],
    deck: [{ rank: 1, suit: "coins" }],
    phase: "play",
    dealer: "reader",
    currentPlayer: "reader",
    mainPlayer: "reader",
    scores: { type: "individual", values: {} },
    lastCaptureBy: null,
    config: {
      allowOptional: true,
      threeOfAKindWinsGame: false,
      dealOrder: "playersThenTable",
      tablePattern: "inc",
      handSize: 3,
      targetPoints: 24,
    },
  };
  const analysis = analyzePlay(state, "reader", played);
  expect(analysis.ok).toBe(true);
  expect(analysis.capturePlan.kind).toBe("match");
  expect(analysis.isFall).toBe(false);
  const next = updateTableAndHandCards(
    { ...state, table: [...state.table, played] },
    "reader",
    played,
    analysis.capturePlan,
  );
  expect(next.table.map((card) => card.rank)).toEqual([7, 11]);
  const keys = (cards: readonly { rank: number; suit: string }[]) =>
    cards.map((card) => `${card.suit}-${card.rank}`).sort();
  expect(keys(next.players[0].collected)).toEqual(keys(captureExample.captured));
});
