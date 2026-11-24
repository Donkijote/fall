export const cardDecks = [
  {
    id: "mountain-keep",
    name: "Mountain Keep",
    description: "Mountain brass, pewter tankards, and iron-bound oak.",
  },
  {
    id: "maritime-guild",
    name: "Maritime Guild",
    description: "Silver compasses, sea-glass goblets, and rope-bound hardwood.",
  },
  {
    id: "moonlit-grove",
    name: "Moonlit Grove",
    description: "Bronze moons, carved wooden bowls, and knotted blackthorn.",
  },
] as const;

export type CardDeckId = (typeof cardDecks)[number]["id"];
export const defaultCardDeck: CardDeckId = "mountain-keep";

export function isCardDeckId(value: unknown): value is CardDeckId {
  return cardDecks.some(({ id }) => id === value);
}
