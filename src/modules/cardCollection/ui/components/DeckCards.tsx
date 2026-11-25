import { SuitGlyph } from "@/components/cards/SuitGlyph";
import { suits, createDeck } from "@/domain/rules/deck";

export function DeckCards() {
  const deck = createDeck();
  return suits.map((suit) => (
    <section key={suit} className="grid gap-3" aria-labelledby={`deck-${suit}`}>
      <h2 id={`deck-${suit}`} className="text-xl capitalize">
        {suit}
      </h2>
      <ul className="grid grid-cols-5 gap-3 lg:grid-cols-10">
        {deck
          .filter((card) => card.suit === suit)
          .map(({ rank }) => (
            <li key={rank} className="min-w-0">
              <SuitGlyph suit={suit} rank={rank} className="aspect-[63/88] w-full drop-shadow-sm" />
            </li>
          ))}
      </ul>
    </section>
  ));
}
