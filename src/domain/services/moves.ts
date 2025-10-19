import { type Card, RANK_ORDER } from "../entities/Card";
import type { GameState } from "../entities/GameState";
import { dealRound } from "./deal";
import { awardPoints, checkGameOver } from "./scoring";

export const playCard = (
  state: GameState,
  playerId: string,
  card: Card,
): GameState => {
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
  // --- Normal capture check ---
  const matchIndex = state.table.findIndex((c) => c.rank === card.rank);

  // place on table or collect
  const newTable = [...state.table] as Array<Card>;

  if (matchIndex !== -1) {
    const capturedCards: Card[] = [];
    const baseCard = newTable.splice(matchIndex, 1)[0];
    capturedCards.push(baseCard, card);

    // --- Cascade capture ---
    let next = nextRank(baseCard.rank);
    while (next !== null) {
      const idx = newTable.findIndex((c) => c.rank === next);
      if (idx === -1) break;
      capturedCards.push(newTable.splice(idx, 1)[0]);
      next = nextRank(next);
    }

    // Add captured cards to player's pile
    newPlayers.map((p) => {
      if (p.id === playerId) {
        p.collected.push(...capturedCards);
      }
      return p;
    });
  } else {
    newTable.push(card);
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
    lastPlayedCard: card,
  };

  // Clean table points
  // Only award if we're NOT in the last round (i.e., there are still cards in the deck)
  const isLastRound = state.deck.length === 0; // check BEFORE any potential redeal logic below
  if (nextState.table.length === 0 && !isLastRound) {
    nextState = awardPoints(nextState, playerId, 4);
  }

  const lastCard = state.lastPlayedCard;
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
    const firstToPlay = (dealerIndex + 1 + playerCount) % playerCount;
    nextState.currentPlayer = nextState.players[firstToPlay].id;
  }

  return nextState;
};

function fallPoints(rank: number): number {
  if (rank === 10) return 2;
  if (rank === 11) return 3;
  if (rank === 12) return 4;
  return 1;
}

function nextRank(rank: number): number | null {
  const idx = RANK_ORDER.indexOf(rank);
  if (idx === -1 || idx === RANK_ORDER.length - 1) return null;
  return RANK_ORDER[idx + 1];
}
