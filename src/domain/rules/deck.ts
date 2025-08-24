import { RANKS_40, RANKS_48, SUITS } from "../entities/Card";
import type { Card } from "../entities/GameState";

export function buildDeck(use48: boolean): Card[] {
  const ranks = use48 ? RANKS_48 : RANKS_40;
  let i = 0;
  return SUITS.flatMap((suit) =>
    ranks.map((rank) => ({ id: `${suit}-${rank}-${i++}`, suit, rank })),
  );
}

export function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
