import { RULES } from "@/domain/constants/rules";
import type { Card } from "@/domain/entities/Card";
import { HAND_META } from "@/domain/rules/handMeta";

export const fallExample = {
  played: { rank: 11, suit: "cups" },
  table: [
    { rank: 11, suit: "coins" },
    { rank: 3, suit: "clubs" },
  ],
  captured: [
    { rank: 11, suit: "cups" },
    { rank: 11, suit: "coins" },
  ],
  points: RULES.scoring.fall.ranks["11"],
} as const;

export const cleanExample = {
  played: { rank: 4, suit: "cups" },
  table: [{ rank: 4, suit: "coins" }],
  captured: [
    { rank: 4, suit: "cups" },
    { rank: 4, suit: "coins" },
  ],
  points: RULES.scoring.cleanTable.points,
} as const;

// Show how to identify the chain, without demonstrating pile accounting (#109).
export const cascadeExample = {
  played: { rank: 2, suit: "cups" },
  chain: [
    { rank: 2, suit: "coins" },
    { rank: 3, suit: "clubs" },
    { rank: 4, suit: "swords" },
    { rank: 5, suit: "cups" },
  ],
  outsideChain: [{ rank: 7, suit: "coins" }],
} as const satisfies { played: Card; chain: readonly Card[]; outsideChain: readonly Card[] };

export const illustratedSings = RULES.singsRanking.map((sing) => {
  const id = sing.name === "Pair + any" ? "pair" : sing.name.toLowerCase().replaceAll(" ", "-");
  return { ...sing, example: HAND_META[id]?.example ?? [] };
});

const quota = RULES.modeQuotas.duel;
export const scoringExample = {
  captured: quota.quota + 3,
  quota: quota.quota,
  earned: 3 * quota.extraPointPerCard,
  goal: RULES.scoring.goal,
  startingScore: RULES.scoring.goal - 3 * quota.extraPointPerCard,
};
