import { useState } from "react";

import { DeckPicker } from "@/components/cards/DeckPicker";
import { SuitGlyph } from "@/components/cards/SuitGlyph";
import { cardDecks, type CardDeckId } from "@/domain/artwork/decks";
import { getCardBackUrl } from "@/infrastructure/adapters/cards/cardArtwork";

export function CardDeckPreview() {
  const [deck, setDeck] = useState<CardDeckId>("mountain-keep");
  const selected = cardDecks.find(({ id }) => id === deck)!;
  return (
    <div className="grid gap-3">
      <DeckPicker value={deck} onValueChange={setDeck} />
      <div aria-label="Deck artwork preview" className="grid grid-cols-5 items-center gap-2">
        <SuitGlyph deck={deck} suit="coins" rank={1} className="w-full drop-shadow-sm" />
        <SuitGlyph deck={deck} suit="cups" rank={3} className="w-full drop-shadow-sm" />
        <SuitGlyph deck={deck} suit="swords" rank={12} className="w-full drop-shadow-sm" />
        <SuitGlyph deck={deck} suit="clubs" rank={7} className="w-full drop-shadow-sm" />
        <img
          src={getCardBackUrl(deck)}
          alt={`${selected.name} shared back`}
          className="w-full drop-shadow-sm"
          draggable={false}
        />
      </div>
      <p className="text-sm text-muted-foreground">{selected.description}</p>
    </div>
  );
}
