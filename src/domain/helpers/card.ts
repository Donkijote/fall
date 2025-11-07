import type { Card, CardKey } from "@/domain/entities/Card";

export const toCardKey = (card: Card): CardKey =>
  `${card.suit}-${card.rank}` as const;