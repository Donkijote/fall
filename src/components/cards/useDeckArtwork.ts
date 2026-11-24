import { getCardArtwork, resolveCardDeck } from "@/infrastructure/adapters/cards/cardArtwork";
import { useGamePreferences } from "@/infrastructure/ui/hooks/useGamePreferences";
export function useDeckArtwork() {
  const { cardDeck } = useGamePreferences();
  const deck = resolveCardDeck(cardDeck);
  return { deck, ...getCardArtwork(deck) };
}
