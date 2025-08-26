import type { Card } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { awardPoints, checkGameOver } from "./scoring";

/**
 * Player plays a card (simplified).
 * If this action triggers a Fall, points are awarded, and we check game over.
 */
export function playCard(
  state: GameState,
  playerId: string,
  card: Card,
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) return state;

  // remove card from hand
  const newPlayers = state.players.map((p) =>
    p.id === playerId
      ? {
          ...p,
          hand: p.hand.filter(
            (c) => !(c.rank === card.rank && c.suit === card.suit),
          ),
        }
      : p,
  );

  // place on table
  const newTable = [...state.table, card];

  let next: GameState = { ...state, players: newPlayers, table: newTable };

  const lastCard = state.table[state.table.length - 1];
  const isFall = !!lastCard && lastCard.rank === card.rank;

  if (isFall) {
    const pts = fallPoints(card.rank);
    next = awardPoints(next, playerId, pts);
    next = checkGameOver(next);
  }

  return next;
}

function fallPoints(rank: number): number {
  if (rank >= 1 && rank <= 7) return 1;
  if (rank === 10) return 2;
  if (rank === 11) return 3;
  if (rank === 12) return 4;
  return 0;
}
