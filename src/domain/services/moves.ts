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
  const player = state.players.find(
    (p) => p.id === playerId && p.id === state.currentPlayer,
  );
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

  // place on table or collect
  const newTable = [] as Array<Card>;

  if (state.table.find((c) => c.rank === card.rank)) {
    newTable.concat(state.table.filter((c) => c.rank !== card.rank));
    newPlayers.map((p) => {
      if (p.id === playerId) {
        p.collected.push(card);
      }
      return p;
    });
  } else {
    newTable.push(...state.table, card);
  }

  // Rotate to next player (to the right)
  const playerCount = state.players.length;
  const currentIndex = state.players.findIndex(
    (p) => p.id === state.currentPlayer,
  );
  const nextIndex = (currentIndex + 1) % playerCount; // right = next in array order
  const nextPlayerId = state.players[nextIndex].id;

  let nextState: GameState = {
    ...state,
    players: newPlayers,
    table: newTable,
    currentPlayer: nextPlayerId,
  };

  const lastCard = state.table[state.table.length - 1];
  const isFall = !!lastCard && lastCard.rank === card.rank;

  if (isFall) {
    const pts = fallPoints(card.rank);
    nextState = awardPoints(nextState, playerId, pts);
    nextState = checkGameOver(nextState);
  }

  return nextState;
}

function fallPoints(rank: number): number {
  if (rank >= 1 && rank <= 7) return 1;
  if (rank === 10) return 2;
  if (rank === 11) return 3;
  if (rank === 12) return 4;
  return 0;
}
