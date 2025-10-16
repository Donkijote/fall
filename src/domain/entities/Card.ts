export type Suit = "coins" | "cups" | "swords" | "clubs";
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;
export type GlyphColor = {
  fill: string;
  className?: string;
};

export interface Card {
  suit: Suit;
  rank: Rank;
}

export const RANK_ORDER = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
