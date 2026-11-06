import type { Card } from "@/domain/entities/Card";
import { orderFromDealerRight } from "@/domain/services/resolveHands";
import { awardPoints, checkGameOver } from "@/domain/services/scoring";

import type { DealOrder, GameState, TablePattern } from "../entities/GameState";
import { createDeck, shuffle } from "../rules/deck";

export function dealRound(
  state: GameState,
  options?: {
    dealOrder?: DealOrder;
    tablePattern?: TablePattern;
    isDealerFirstDeal?: boolean;
  },
): GameState {
  let deck = state.deck.length ? [...state.deck] : shuffle(createDeck());

  const players = state.players.map((p) => ({ ...p, hand: [] as Array<Card> }));

  const handSize = state.config.handSize ?? 3;
  const dealOrder = options?.dealOrder ?? state.config.dealOrder;
  const tablePattern = options?.tablePattern ?? state.config.tablePattern;

  let tableCards: Card[] = [...state.table];

  // Dealer options (only first deal of each dealer)
  if (options?.isDealerFirstDeal) {
    if (dealOrder === "playersThenTable") {
      // 1) players
      for (const p of players) {
        p.hand = deck.splice(0, handSize);
      }
      // 2) table (unique cards)
      const result = drawUniqueTableCards(deck, 4);
      tableCards = result.table;
      deck = result.deck;
    } else {
      // 1) table (unique cards)
      const result = drawUniqueTableCards(deck, 4);
      tableCards = result.table;
      deck = result.deck;
      // 2) players
      for (const p of players) {
        p.hand = deck.splice(0, handSize);
      }
    }
  } else {
    // Normal deal: only 3 cards to each player, no table cards
    for (const p of players) {
      p.hand = deck.splice(0, handSize);
    }
  }

  const currentPlayerToDealersRightAfterDeal = orderFromDealerRight(state)[0];

  let next: GameState = {
    ...state,
    players,
    table: tableCards,
    deck,
    phase: "announceSings",
    currentPlayer: currentPlayerToDealersRightAfterDeal,
    config: { ...state.config, dealOrder, tablePattern },
  };

  // apply table pattern bonus to dealer on first round
  if (state.phase === "dealerChoice") {
    next = applyTablePatternBonus(next, tableCards, tablePattern);
  }

  return next;
}

export function applyTablePatternBonus(
  state: GameState,
  table: Card[],
  pattern: TablePattern,
): GameState {
  const expected = pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1];
  let total = 0;
  for (let i = 0; i < 4; i++) {
    if (table[i]?.rank === expected[i]) total += table[i].rank;
  }
  if (total > 0) {
    const dealerId = state.dealer;
    state = awardPoints(state, dealerId, total);
    state = checkGameOver(state, state.config.targetPoints);
  }
  return state;
}

// ensure unique card in the 4 table cards
function drawUniqueTableCards(
  deck: Card[],
  count = 4,
): { table: Card[]; deck: Card[] } {
  const table: Card[] = [];
  const pool = [...deck];

  while (table.length < count && pool.length > 0) {
    const card = pool.shift()!;
    const alreadyHasRank = table.some((c) => c.rank === card.rank);

    if (alreadyHasRank) {
      // put back in random position
      const pos = Math.floor(Math.random() * pool.length);
      pool.splice(pos, 0, card);
    } else {
      table.push(card);
    }
  }

  return { table, deck: pool };
}
