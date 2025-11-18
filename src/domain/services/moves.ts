import { nextRank, toCardKey } from "@/domain/helpers/card";
import { cloneState } from "@/domain/helpers/state";

import { type Card, type CardWithKey } from "../entities/Card";
import type {
  CapturePlan,
  GameState,
  PlayAnalysis,
} from "../entities/GameState";
import { dealRound } from "./deal";
import { awardPoints, checkGameOver } from "./scoring";

export const analyzePlay = (
  state: GameState,
  playerId: string,
  card: Card,
): PlayAnalysis => {
  const player = state.players.find(
    (p) => p.id === playerId && p.id === state.currentPlayer,
  );
  if (!player)
    return {
      ok: false,
      reason: "not-current-player",
      capturePlan: { kind: "none" },
      isFall: false,
      isLastRound: state.deck.length === 0,
    };

  const inHand = player.hand.some(
    (c) => c.suit === card.suit && c.rank === card.rank,
  );
  if (!inHand)
    return {
      ok: false,
      reason: "card-not-in-hand",
      capturePlan: { kind: "none" },
      isFall: false,
      isLastRound: state.deck.length === 0,
    };

  // capture detection
  const matchIndex = state.table.findIndex((c) => c.rank === card.rank);
  const isLastRound = state.deck.length === 0;

  let capturePlan: CapturePlan = { kind: "none" };
  if (matchIndex !== -1) {
    const baseCard = state.table[matchIndex];
    const targets: Array<CardWithKey> = [
      { suit: baseCard.suit, rank: baseCard.rank, key: toCardKey(baseCard) },
    ];
    // cascade by next ranks
    let next = nextRank(baseCard.rank);
    while (next !== null) {
      const idx = state.table.findIndex((c) => c.rank === next);
      if (idx === -1) break;
      const t = state.table[idx];
      targets.push({ suit: t.suit, rank: t.rank, key: toCardKey(t) });
      next = nextRank(next);
    }

    capturePlan = {
      kind: targets.length > 1 ? "cascade" : "match",
      playerId,
      played: { suit: card.suit, rank: card.rank, key: toCardKey(card) },
      targets,
    };
  }

  const isFall =
    !!state.lastPlayedCard &&
    state.lastPlayedCard.rank === card.rank &&
    capturePlan.kind !== "none";

  return { ok: true, capturePlan, isFall, isLastRound };
};

export const removeCardsFromHand = (
  state: GameState,
  playerId: string,
  card: Card,
): GameState => {
  const next = cloneState(state);
  const me = next.players.find((p) => p.id === playerId);
  if (!me) return state;
  me.hand = me.hand.filter(
    (c) => !(c.rank === card.rank && c.suit === card.suit),
  );
  return next;
};

export const updateTableAndHandCards = (
  state: GameState,
  playerId: string,
  card: Card,
  plan: CapturePlan,
): GameState => {
  const next = cloneState(state);
  const me = next.players.find((p) => p.id === playerId)!;
  const isLastRound = next.deck.length === 0;

  if (plan.kind === "none") {
    next.table = [...next.table, card];
    return next;
  }

  // Remove matched + cascade targets from table (by rank occurrences in order)
  const tableAfter = [...next.table];

  const playedIdx = tableAfter.findIndex(
    (c) => c.rank === card.rank && c.suit === card.suit,
  );
  if (playedIdx !== -1) tableAfter.splice(playedIdx, 1);

  for (const t of plan.targets) {
    const idx = tableAfter.findIndex((c) => c.rank === t.rank);
    if (idx !== -1) tableAfter.splice(idx, 1);
  }
  next.table = tableAfter;

  const captured: Card[] = [];
  const baseTarget = plan.targets[0];

  if (baseTarget) {
    const baseCard = { suit: baseTarget.suit, rank: baseTarget.rank } as Card;
    captured.push(baseCard, card);
  }

  for (const t of plan.targets) {
    const idx = tableAfter.findIndex(
      (c) => c.rank === t.rank && c.suit === t.suit,
    );
    if (idx !== -1) tableAfter.splice(idx, 1);
  }

  me.collected.push(...captured);
  if (isLastRound) next.lastCaptureBy = playerId;

  return next;
};

export const finalizeAfterPlay = (
  state: GameState,
  playerId: string,
  card: Card,
  wasThereCapture: boolean,
): GameState => {
  let nextState = cloneState(state);
  const isLastRound = nextState.deck.length === 0;

  // Rotate to next player
  const playerCount = nextState.players.length;
  const currentIndex = nextState.players.findIndex(
    (p) => p.id === nextState.currentPlayer,
  );
  const nextIndex = (currentIndex + 1) % playerCount;
  nextState.currentPlayer = nextState.players[nextIndex].id;

  // Maintain lastPlayedCard for future "fall" checks
  nextState.lastPlayedCard = card;

  // Clean table award (only if not last round)
  if (nextState.table.length === 0 && !isLastRound) {
    nextState = awardPoints(nextState, playerId, 4);
  }

  // Fall rule scoring
  const lastCard = state.lastPlayedCard;
  const isFall = !!lastCard && lastCard.rank === card.rank && wasThereCapture;
  if (isFall) {
    const pts = fallPoints(card.rank);
    nextState = awardPoints(nextState, playerId, pts);
    nextState = checkGameOver(nextState);
  }

  // End-of-deal handling (your original logic)
  const allHandsEmpty = nextState.players.every((p) => p.hand.length === 0);
  if (allHandsEmpty) {
    if (nextState.deck.length > 0) {
      nextState = dealRound(nextState, { isDealerFirstDeal: false });
      const dealerIndex = nextState.players.findIndex(
        (p) => p.id === nextState.dealer,
      );
      const firstToPlay = (dealerIndex + 1 + playerCount) % playerCount;
      nextState.currentPlayer = nextState.players[firstToPlay].id;
    } else {
      const lastCap: string | null = nextState.lastCaptureBy;
      if (nextState.table.length > 0 && lastCap) {
        const lastPlayer = nextState.players.find((p) => p.id === lastCap);
        if (lastPlayer) {
          lastPlayer.collected.push(...nextState.table);
          nextState.table = [];
        }
      } else {
        const dealer = nextState.players.find(
          (p) => p.id === nextState.dealer,
        )!;
        dealer.collected.push(...nextState.table);
        nextState.table = [];
      }
      nextState.lastCaptureBy = null;
    }
  }

  return nextState;
};

const fallPoints = (rank: number): number => {
  if (rank === 10) return 2;
  if (rank === 11) return 3;
  if (rank === 12) return 4;
  return 1;
};
