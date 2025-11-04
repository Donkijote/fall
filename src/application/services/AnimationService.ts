import type { CardKey, Rank, Suit } from "@/domain/entities/Card";

const pending = new Map<CardKey, () => void>();

export function waitForCardToLand(suit: Suit, rank: Rank): Promise<void> {
  const key: CardKey = `${suit}-${rank}`;
  return new Promise<void>((resolve) => {
    pending.set(key, resolve);
    setTimeout(() => {
      if (pending.get(key) === resolve) {
        pending.delete(key);
        resolve();
      }
    }, 1000);
  });
}

export function resolveCardLanded(suit: Suit, rank: Rank) {
  const key: CardKey = `${suit}-${rank}`;
  const res = pending.get(key);
  if (res) {
    pending.delete(key);
    res();
  }
}
