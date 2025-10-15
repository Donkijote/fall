import type { FC, ImgHTMLAttributes } from "react";

import type { Rank, Suit } from "@/domain/entities/Card";

const images = import.meta.glob<string>("@/assets/cards/*/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const RANK_NAME: Record<
  Rank,
  | "Ace"
  | "Two"
  | "Three"
  | "Four"
  | "Five"
  | "Six"
  | "Seven"
  | "Ten"
  | "Eleven"
  | "Twelve"
> = {
  1: "Ace",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
};

type SuitGlyphProps = {
  suit: Suit;
  rank: Rank;
  className?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
};

export const SuitGlyph: FC<SuitGlyphProps> = ({
  suit,
  rank,
  className,
  imgProps,
}) => {
  const key = buildImageKey(suit, rank);
  const src = key ? images[key] : undefined;

  if (!src) {
    return null;
  }

  const alt = `${RANK_NAME[rank]}Of${capitalize(suit)}`;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      draggable={false}
      {...imgProps}
    />
  );
};

const buildImageKey = (suit: Suit, rank: Rank): string | null => {
  const rankName = RANK_NAME[rank];
  if (!rankName) return null;

  return `/src/assets/cards/${suit}/${rankName}Of${capitalize(suit)}.svg`;
};

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
