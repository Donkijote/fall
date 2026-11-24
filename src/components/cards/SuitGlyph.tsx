import type { ImgHTMLAttributes } from "react";

import type { CardDeckId } from "@/domain/artwork/decks";
import type { Rank, Suit } from "@/domain/entities/Card";
import { getCardFaceUrl } from "@/infrastructure/adapters/cards/cardArtwork";

import { useDeckArtwork } from "./useDeckArtwork";

export { getCardFaceUrl } from "@/infrastructure/adapters/cards/cardArtwork";

export function SuitGlyph({
  suit,
  rank,
  deck,
  className,
  imgProps,
}: {
  suit: Suit;
  rank: Rank;
  deck?: CardDeckId;
  className?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}) {
  const selected = useDeckArtwork();
  return (
    <img
      src={getCardFaceUrl(suit, rank, deck ?? selected.deck)}
      alt={`${rank} of ${suit}`}
      className={className}
      loading="lazy"
      draggable={false}
      {...imgProps}
    />
  );
}
