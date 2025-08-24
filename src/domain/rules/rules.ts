import type { Card, Hand } from "../entities/GameState";

export function getHands(config: {
  allowOptional: boolean;
  threeOfAKindWinsGame: boolean;
}): Hand[] {
  const list: Hand[] = [
    {
      name: "Big House",
      points: 12,
      mandatory: false,
      test: (hand) => {
        const ranks = ranksOf(hand);
        return ranks.filter((r) => r === 12).length >= 2 && ranks.includes(1);
      },
      rankStrength: () => 12,
    },
    {
      name: "Small House",
      points: 10,
      mandatory: false,
      test: (hand) => {
        const ranks = ranksOf(hand);
        return ranks.filter((r) => r === 11).length >= 2 && ranks.includes(1);
      },
      rankStrength: () => 11,
    },
    {
      name: "Register",
      points: 8,
      mandatory: true,
      test: (hand) => {
        const ranks = ranksOf(hand);
        return ranks.includes(12) && ranks.includes(11) && ranks.includes(1);
      },
      rankStrength: () => 12, // 12 is the highest card in this combo
    },
    {
      name: "Watchtower",
      points: 7,
      mandatory: true,
      test: (hand) => {
        const counts = countRanks(hand);
        for (const r in counts) {
          if (counts[+r] >= 2) {
            const rank = +r;
            if (
              hand.some((c) => c.rank === rank + 1) ||
              hand.some((c) => c.rank === rank - 1)
            ) {
              return true;
            }
          }
        }
        return false;
      },
      rankStrength: (hand) => {
        const counts = countRanks(hand);
        for (const r in counts) {
          if (counts[+r] >= 2) return +r;
        }
        return 0;
      },
    },
    {
      name: "Patrol",
      points: 6,
      mandatory: true,
      test: (hand) => {
        const r = sortRanks(hand);
        return isSequence(r);
      },
      rankStrength: (hand) => Math.max(...ranksOf(hand)),
    },
    {
      name: "Pair of 12",
      points: 4,
      mandatory: true,
      test: (hand) => ranksOf(hand).filter((r) => r === 12).length >= 2,
      rankStrength: () => 12,
    },
    {
      name: "Pair of 11",
      points: 3,
      mandatory: true,
      test: (hand) => ranksOf(hand).filter((r) => r === 11).length >= 2,
      rankStrength: () => 11,
    },
    {
      name: "Pair of 10",
      points: 2,
      mandatory: true,
      test: (hand) => ranksOf(hand).filter((r) => r === 10).length >= 2,
      rankStrength: () => 10,
    },
    {
      name: "Pair",
      points: 1,
      mandatory: true,
      test: (hand) => {
        const counts = countRanks(hand);
        return Object.values(counts).some((v) => v >= 2);
      },
      rankStrength: (hand) => {
        const counts = countRanks(hand);
        let max = 0;
        for (const r in counts) {
          if (counts[+r] >= 2) max = Math.max(max, +r);
        }
        return max;
      },
    },
    {
      name: "Three of a Kind",
      points: config.threeOfAKindWinsGame ? Infinity : 5,
      mandatory: true,
      test: (hand) => {
        const counts = countRanks(hand);
        return Object.values(counts).some((v) => v === 3);
      },
      rankStrength: (hand) => hand[0].rank, // all the same
    },
  ];

  return list.filter((c) => c.mandatory || config.allowOptional);
}

export function bestHand(
  hand: Card[],
  config: { allowOptional: boolean; threeOfAKindWinsGame: boolean },
): Hand | null {
  const cantos = getHands(config);
  const matches = cantos.filter((c) => c.test(hand));
  if (matches.length === 0) return null;

  // highest points first
  matches.sort(
    (a, b) =>
      b.points - a.points || b.rankStrength(hand) - a.rankStrength(hand),
  );
  return matches[0];
}

// ---------- helpers ----------
function ranksOf(hand: Card[]) {
  return hand.map((c) => c.rank);
}

function countRanks(hand: Card[]): Record<number, number> {
  const counts: Record<number, number> = {};
  hand.forEach((c) => (counts[c.rank] = (counts[c.rank] ?? 0) + 1));
  return counts;
}

function sortRanks(hand: Card[]) {
  return [...ranksOf(hand)].sort((a, b) => a - b);
}

function isSequence(ranks: number[]) {
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i] !== ranks[i - 1] + 1) return false;
  }
  return true;
}
