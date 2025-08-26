import type { Card } from "@/domain/entities/Card";

import type { GameState } from "../entities/GameState";
import { HANDS } from "../rules/hands";
import { awardPoints, checkGameOver } from "./scoring";

type Match = {
  playerId: string;
  cantoName: string;
  points: number;
  strength: number;
};

/**
 * Determine the best hand for a given 3-card.
 */
function bestHand(hand: Card[]) {
  const matches = HANDS.filter((c) => c.pattern(hand));
  if (matches.length === 0) return null;

  // Best = highest points, then highest rankStrength
  matches.sort(
    (a, b) =>
      b.points - a.points || b.rankStrength(hand) - a.rankStrength(hand),
  );
  const chosen = matches[0];
  return {
    name: chosen.name,
    points: chosen.points,
    strength: chosen.rankStrength(hand),
  };
}

/**
 * Seating order starting from dealer's right (counter-clockwise).
 */
function orderFromDealerRight(state: GameState): string[] {
  const dealerIdx = state.players.findIndex((p) => p.id === state.dealer);
  const arr = [
    ...state.players.slice(dealerIdx + 1),
    ...state.players.slice(0, dealerIdx + 1),
  ];
  return arr.map((p) => p.id);
}

export function resolveHands(state: GameState): GameState {
  if (state.phase !== "announceSings") return state;
  if (!state.players.every((p) => p.hand.length === 3)) return state;

  // Gather each player's best hand (if any)
  const matches: Match[] = [];
  for (const p of state.players) {
    const best = bestHand(p.hand);
    if (best) {
      matches.push({
        playerId: p.id,
        cantoName: best.name,
        points: best.points,
        strength: best.strength,
      });
    }
  }

  if (matches.length === 0) return state;

  // Step 1: highest points
  const maxPts = Math.max(...matches.map((m) => m.points));
  let top = matches.filter((m) => m.points === maxPts);

  // Step 2: if same hand name among top, compare strength
  const handNames = new Set(top.map((t) => t.cantoName));
  if (handNames.size === 1 && top.length > 1) {
    const maxStr = Math.max(...top.map((t) => t.strength));
    top = top.filter((t) => t.strength === maxStr);
  }

  // Step 3: if still tied (either different cantos with same points or equal strengths), dealer's right wins
  let winner = top[0];
  if (top.length > 1) {
    const order = orderFromDealerRight(state);
    for (const pid of order) {
      const found = top.find((t) => t.playerId === pid);
      if (found) {
        winner = found;
        break;
      }
    }
  }

  // Award and check game over
  let next = awardPoints(state, winner.playerId, winner.points);
  next = checkGameOver(next);

  return next;
}
