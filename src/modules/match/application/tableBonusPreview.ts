import type { Card, Rank } from "@/domain/entities/Card";
import type { DealOrder, GameMode, TablePattern } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";
import { dealRound } from "@/domain/services/deal";
import { createMatchState } from "@/domain/services/matchSetup";

export type TableBonusCase = "perfect" | "partial" | "broken" | "none" | "winning";

/** Deterministic deck; the real deal service resolves cards, scores and winner. */
export function tableBonusPreview(
  mode: GameMode,
  pattern: TablePattern,
  order: DealOrder,
  example: TableBonusCase,
  dealerIndex: number,
) {
  const state = createMatchState("local", mode);
  state.dealer = state.players[dealerIndex % state.players.length].id;
  state.phase = "dealerChoice";
  state.config = { ...state.config, tablePattern: pattern, dealOrder: order };
  if (example === "winning") {
    const dealer = state.players.find(({ id }) => id === state.dealer)!;
    state.scores.values[String(dealer.team)] = 20;
  }
  const expected: Rank[] = pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1];
  const ranks = example === "none" ? [5, 6, 7, 10] : [...expected];
  if (example === "partial") ranks[3] = 7;
  if (example === "broken") ranks[1] = 6;
  const suits = ["coins", "cups", "swords", "clubs"] as const;
  const table: Card[] = ranks.map((rank, index) => ({ suit: suits[index], rank: rank as Rank }));
  const rest = createDeck().filter(
    (card) => !table.some(({ suit, rank }) => card.suit === suit && card.rank === rank),
  );
  const handCards = rest.splice(0, state.players.length * state.config.handSize);
  state.deck =
    order === "tableThenPlayers"
      ? [...table, ...handCards, ...rest]
      : [...handCards, ...table, ...rest];
  return { before: state, resolved: dealRound(state, { isDealerFirstDeal: true }) };
}
