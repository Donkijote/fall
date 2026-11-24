import { cardDecks, defaultCardDeck, type CardDeckId } from "@/domain/artwork/decks";
import type { Rank, Suit } from "@/domain/entities/Card";
import { createDeck } from "@/domain/rules/deck";
import { readGamePreferences } from "@/infrastructure/preferences/gamePreferences";

const images = import.meta.glob<string>("@/assets/cards/decks/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
const available = new Set(
  cardDecks
    .filter(
      ({ id }) =>
        Boolean(images[`/src/assets/cards/decks/${id}/back.webp`]) &&
        createDeck().every(({ suit, rank }) =>
          Boolean(images[`/src/assets/cards/decks/${id}/${suit}-${rank}.webp`]),
        ),
    )
    .map(({ id }) => id),
);

export function isCardDeckAvailable(deck: CardDeckId) {
  return available.has(deck);
}
export function resolveCardDeck(deck: CardDeckId): CardDeckId {
  return available.has(deck) ? deck : defaultCardDeck;
}
export function getCardFaceUrl(
  suit: Suit,
  rank: Rank,
  deck: CardDeckId = resolveCardDeck(readGamePreferences().cardDeck),
) {
  return images[`/src/assets/cards/decks/${deck}/${suit}-${rank}.webp`];
}
export function getCardBackUrl(deck: CardDeckId = resolveCardDeck(readGamePreferences().cardDeck)) {
  return images[`/src/assets/cards/decks/${deck}/back.webp`];
}
export function getCardArtwork(deck: CardDeckId = resolveCardDeck(readGamePreferences().cardDeck)) {
  return {
    face: getCardFaceUrl("coins", 1, deck),
    back: getCardBackUrl(deck),
    label: "ACE OF COINS",
  };
}
export function getCardFaceUrls(
  deck: CardDeckId = resolveCardDeck(readGamePreferences().cardDeck),
) {
  return createDeck().map(({ suit, rank }) => getCardFaceUrl(suit, rank, deck));
}
