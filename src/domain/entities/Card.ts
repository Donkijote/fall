export type Suit = "golds" | "cups" | "blades" | "clubs";
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;

export interface Card {
  suit: Suit;
  rank: Rank;
}

export const RANK_ORDER = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
