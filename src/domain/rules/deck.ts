import type { Card, Rank, Suit } from "../entities/Card";

export const suits: Suit[] = ["golds", "cups", "blades", "clubs"];
export const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

export function createDeck(): Card[] {
  return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
}

export function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
