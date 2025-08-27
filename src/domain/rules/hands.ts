import { type Card, RANK_ORDER } from "../entities/Card";

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
    pattern: (cards) =>
      cards.some((x) => x.rank === 12) &&
      cards.some((x) => x.rank === 1) &&
      cards.filter((x) => x.rank === 12).length === 2,
    rankStrength: () => 12,
  },
  {
    name: "Small House",
    points: 10,
    mandatory: false,
    pattern: (cards) =>
      cards.some((x) => x.rank === 11) &&
      cards.some((x) => x.rank === 1) &&
      cards.filter((x) => x.rank === 11).length === 2,
    rankStrength: () => 11,
  },
  {
    name: "Register",
    points: 8,
    mandatory: true,
    pattern: (cards) =>
      cards.some((x) => x.rank === 12) &&
      cards.some((x) => x.rank === 11) &&
      cards.some((x) => x.rank === 1),
    rankStrength: () => 12,
  },
  {
    name: "Watchtower",
    points: 7,
    mandatory: true,
    pattern: (cards) => {
      // Count rank frequencies
      const rankCounts: Record<number, number> = {};
      for (const c of cards) {
        rankCounts[c.rank] = (rankCounts[c.rank] ?? 0) + 1;
      }

      // Must be exactly two of one rank
      const pairRank = Object.entries(rankCounts).find(
        ([, count]) => count === 2,
      )?.[0];
      const singleRank = Object.entries(rankCounts).find(
        ([, count]) => count === 1,
      )?.[0];

      if (!pairRank || !singleRank) return false;

      const pairIndex = RANK_ORDER.indexOf(Number(pairRank));
      const singleIndex = RANK_ORDER.indexOf(Number(singleRank));

      if (pairIndex === -1 || singleIndex === -1) return false;

      // Single card must be just before or just after the pair in the deck order
      return singleIndex === pairIndex - 1 || singleIndex === pairIndex + 1;
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Patrol",
    points: 6,
    mandatory: true,
    pattern: (cards) => {
      // Sort cards by their order in SPANISH_RANK_ORDER
      const indexes = cards
        .map((c) => RANK_ORDER.indexOf(c.rank))
        .sort((a, b) => a - b);

      console.log(
        "patrol",
        indexes,
        indexes[1] === indexes[0] + 1 && indexes[2] === indexes[1] + 1,
      );

      return indexes[1] === indexes[0] + 1 && indexes[2] === indexes[1] + 1;
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Pair",
    points: 1,
    mandatory: true,
    pattern: (cards) => {
      const counts: Record<number, number> = {};
      for (const card of cards)
        counts[card.rank] = (counts[card.rank] || 0) + 1;
      return Object.values(counts).includes(2);
    },
    rankStrength: (c) => Math.max(...c.map((x) => x.rank)),
  },
  {
    name: "Pair of 10",
    points: 2,
    mandatory: true,
    pattern: (cards) => cards.filter((x) => x.rank === 10).length === 2,
    rankStrength: () => 10,
  },
  {
    name: "Pair of 11",
    points: 3,
    mandatory: true,
    pattern: (cards) => cards.filter((x) => x.rank === 11).length === 2,
    rankStrength: () => 11,
  },
  {
    name: "Pair of 12",
    points: 4,
    mandatory: true,
    pattern: (cards) => cards.filter((x) => x.rank === 12).length === 2,
    rankStrength: () => 12,
  },
  {
    name: "Three of a Kind",
    points: 5,
    mandatory: true,
    pattern: (cards) => {
      const counts: Record<number, number> = {};
      for (const card of cards)
        counts[card.rank] = (counts[card.rank] || 0) + 1;
      return Object.values(counts).includes(3);
    },
    rankStrength: (c) => c[0]?.rank || 0,
  },
];
