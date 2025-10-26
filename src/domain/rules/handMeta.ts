import type { Card } from "@/domain/entities/Card";

export type HandMeta = {
  id: string;
  description: string;
  tags?: string[];
  example?: Array<Card>; // tiny visual
};

export const HAND_META: Record<string, HandMeta> = {
  "big-house": {
    id: "big-house",
    description: "Pair of 12s plus an Ace (1).",
    tags: ["pair", "high-value", "combo"],
    example: [
      { rank: 12, suit: "coins" },
      { rank: 12, suit: "cups" },
      { rank: 1, suit: "swords" },
    ],
  },
  "small-house": {
    id: "small-house",
    description: "Pair of 11s plus an Ace (1).",
    tags: ["pair", "combo"],
    example: [
      { rank: 11, suit: "coins" },
      { rank: 11, suit: "cups" },
      { rank: 1, suit: "swords" },
    ],
  },
  register: {
    id: "register",
    description: "Contains 12, 11 and Ace (1), any suits.",
    tags: ["set", "mandatory"],
    example: [
      { rank: 12, suit: "coins" },
      { rank: 11, suit: "cups" },
      { rank: 1, suit: "swords" },
    ],
  },
  watchtower: {
    id: "watchtower",
    description: "A pair plus a single adjacent in rank to the pair.",
    tags: ["adjacent", "pair", "mandatory"],
    example: [
      { rank: 11, suit: "coins" },
      { rank: 11, suit: "cups" },
      { rank: 12, suit: "swords" },
    ],
  },
  patrol: {
    id: "patrol",
    description: "Three consecutive ranks (a run), any suits.",
    tags: ["run", "sequence", "mandatory"],
    example: [
      { rank: 10, suit: "coins" },
      { rank: 11, suit: "cups" },
      { rank: 12, suit: "swords" },
    ],
  },
  pair: {
    id: "pair",
    description: "Any pair plus a third card.",
    tags: ["pair", "mandatory", "low"],
    example: [
      { rank: 7, suit: "coins" },
      { rank: 7, suit: "cups" },
      { rank: 3, suit: "swords" },
    ],
  },
  "pair-of-10": {
    id: "pair-of-10",
    description: "Exactly two 10s plus any third card.",
    tags: ["pair", "mandatory", "bonus"],
    example: [
      { rank: 10, suit: "coins" },
      { rank: 10, suit: "cups" },
      { rank: 2, suit: "swords" },
    ],
  },
  "pair-of-11": {
    id: "pair-of-11",
    description: "Exactly two 11s plus any third card.",
    tags: ["pair", "mandatory", "bonus"],
    example: [
      { rank: 11, suit: "coins" },
      { rank: 11, suit: "cups" },
      { rank: 2, suit: "swords" },
    ],
  },
  "pair-of-12": {
    id: "pair-of-12",
    description: "Exactly two 12s plus any third card.",
    tags: ["pair", "mandatory", "bonus"],
    example: [
      { rank: 12, suit: "coins" },
      { rank: 12, suit: "cups" },
      { rank: 2, suit: "swords" },
    ],
  },
  "three-of-a-kind": {
    id: "three-of-a-kind",
    description: "Three cards of the same rank.",
    tags: ["set", "mandatory", "medium"],
    example: [
      { rank: 7, suit: "coins" },
      { rank: 7, suit: "cups" },
      { rank: 7, suit: "swords" },
    ],
  },
};
