import type { Card } from "../entities/Card";

export interface Hand {
  name: string;
  points: number;
  mandatory: boolean;
  pattern: (cards: Card[]) => boolean;
  rankStrength: (cards: Card[]) => number;
}

export const HANDS: Hand[] = [
  {
    name: "Big House",
    points: 12,
    mandatory: false,
    pattern: (c) =>
      c.some((x) => x.rank === 12) &&
      c.some((x) => x.rank === 1) &&
      c.filter((x) => x.rank === 12).length === 2,
    rankStrength: () => 12,
  },
  {
    name: "Small House",
    points: 10,
    mandatory: false,
    pattern: (c) =>
      c.some((x) => x.rank === 11) &&
      c.some((x) => x.rank === 1) &&
      c.filter((x) => x.rank === 11).length === 2,
    rankStrength: () => 11,
  },
  {
    name: "Register",
    points: 8,
    mandatory: true,
    pattern: (c) =>
      c.some((x) => x.rank === 12) &&
      c.some((x) => x.rank === 11) &&
      c.some((x) => x.rank === 1),
    rankStrength: () => 12,
  },
  {
    name: "Watchtower",
    points: 7,
    mandatory: true,
    pattern: (c) => {
      const counts: Record<number, number> = {};
      for (const card of c) counts[card.rank] = (counts[card.rank] || 0) + 1;
      return Object.values(counts).some((cnt) => cnt >= 2);
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Patrol",
    points: 6,
    mandatory: true,
    pattern: (c) => {
      const ranks = c.map((x) => x.rank).sort((a, b) => a - b);
      return ranks[2] === ranks[0] + 2 && ranks[1] === ranks[0] + 1;
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Pair",
    points: 1,
    mandatory: true,
    pattern: (c) => {
      const counts: Record<number, number> = {};
      for (const card of c) counts[card.rank] = (counts[card.rank] || 0) + 1;
      return Object.values(counts).includes(2);
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Pair of 10",
    points: 2,
    mandatory: true,
    pattern: (c) => c.filter((x) => x.rank === 10).length === 2,
    rankStrength: () => 10,
  },
  {
    name: "Pair of 11",
    points: 3,
    mandatory: true,
    pattern: (c) => c.filter((x) => x.rank === 11).length === 2,
    rankStrength: () => 11,
  },
  {
    name: "Pair of 12",
    points: 4,
    mandatory: true,
    pattern: (c) => c.filter((x) => x.rank === 12).length === 2,
    rankStrength: () => 12,
  },
  {
    name: "Three of a Kind",
    points: 5,
    mandatory: true,
    pattern: (c) => {
      const counts: Record<number, number> = {};
      for (const card of c) counts[card.rank] = (counts[card.rank] || 0) + 1;
      return Object.values(counts).includes(3);
    },
    rankStrength: (c) => c[0]?.rank || 0,
  },
];
