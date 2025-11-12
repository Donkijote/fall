import { type Card, type CardKey, RANK_ORDER } from "@/domain/entities/Card";

export const toCardKey = (card: Card): CardKey =>
  `${card.suit}-${card.rank}` as const;

export const nextRank = (rank: number): number | null => {
  const idx = RANK_ORDER.indexOf(rank);
  if (idx === -1 || idx === RANK_ORDER.length - 1) return null;
  return RANK_ORDER[idx + 1];
};
