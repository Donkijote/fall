import type { Card } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { dealRound } from "./deal";
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

  // Ensure the card exists in hand
  const cardIndex = player.hand.findIndex(
    (c) => c.suit === card.suit && c.rank === card.rank,
  );
  if (cardIndex === -1) return state;

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
    newTable.push(...state.table.filter((c) => c.rank !== card.rank));
    const collectedCards = state.table
      .filter((c) => c.rank === card.rank)
      .concat([card]);
    newPlayers.map((p) => {
      if (p.id === playerId) {
        p.collected.push(...collectedCards);
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

  // If all hands empty but deck still has cards → redeal
  const allHandsEmpty = nextState.players.every((p) => p.hand.length === 0);
  if (allHandsEmpty && nextState.deck.length > 0) {
    nextState = dealRound(nextState, {
      isDealerFirstDeal: false, // after first round, never deal the table again
    });
    // reset currentPlayer to right of dealer (first to act)
    const dealerIndex = nextState.players.findIndex(
      (p) => p.id === nextState.dealer,
    );
    const firstToPlay = (dealerIndex - 1 + playerCount) % playerCount;
    nextState.currentPlayer = nextState.players[firstToPlay].id;
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
