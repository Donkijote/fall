import type { Card } from "@/domain/entities/Card";
import {
  awardPoints,
  awardPointsToTeam,
  checkGameOver,
} from "@/domain/services/scoring";

import type { DealOrder, GameState, TablePattern } from "../entities/GameState";
import { createDeck, shuffle } from "../rules/deck";

// election: each player draws one card, highest wins dealer
export function chooseDealer(state: GameState): GameState {
  let deck = createDeck();
  deck = shuffle(deck);

  const electionCards: Record<string, Card> = {};
  for (const p of state.players) {
    const randomCardIndex = Math.floor(Math.random() * deck.length);
    electionCards[p.id] = deck[randomCardIndex];
  }

  // find the highest rank (ties broken by order in players array)
  let dealerId = state.players[0].id;
  let highest = electionCards[dealerId].rank;
  for (const p of state.players) {
    const rank = electionCards[p.id].rank;
    if (rank > highest) {
      highest = rank;
      dealerId = p.id;
    }
  }

  return {
    ...state,
    deck,
    dealer: dealerId,
    phase: "dealerChoice", // next phase: dealer decides inc/dec + order
  };
}

export function dealRound(
  state: GameState,
  options?: { dealOrder?: DealOrder; tablePattern?: TablePattern },
): GameState {
  const deck = state.deck.length ? state.deck : shuffle(createDeck());

  const players = state.players.map((p) => ({ ...p, hand: [] as Array<Card> }));

  const handSize = state.config.handSize ?? 3;
  const dealOrder = options?.dealOrder ?? state.config.dealOrder;
  const tablePattern = options?.tablePattern ?? state.config.tablePattern;

  let idx = 0;
  let tableCards: Card[] = [];

  if (dealOrder === "playersThenTable") {
    for (const p of players) {
      p.hand = deck.slice(idx, idx + handSize);
      idx += handSize;
    }
    tableCards = deck.slice(idx, idx + 4);
    idx += 4;
  } else {
    tableCards = deck.slice(idx, idx + 4);
    idx += 4;
    for (const p of players) {
      p.hand = deck.slice(idx, idx + handSize);
      idx += handSize;
    }
  }

  const remainingDeck = deck.slice(idx);

  let next: GameState = {
    ...state,
    players,
    table: tableCards,
    deck: remainingDeck,
    phase: "announceSings",
    config: { ...state.config, dealOrder, tablePattern },
  };

  // apply table pattern bonus to dealer on first round
  if (state.phase === "dealerChoice") {
    next = applyTablePatternBonus(next, tableCards, tablePattern);
  }

  return next;
}

function applyTablePatternBonus(
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
    const dealerPlayer = state.players.find((p) => p.id === dealerId)!;
    if (state.scores.type === "team") {
      state = awardPointsToTeam(state, dealerPlayer.team ?? 0, total);
    } else {
      state = awardPoints(state, dealerId, total);
    }
    state = checkGameOver(state, state.config.targetPoints);
  }
  return state;
}
