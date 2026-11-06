import type { LayoutInput, LayoutOutput, Placement } from "../entities/types";

const defaultRng = () => Math.random();

export const randomScatter = (input: LayoutInput): LayoutOutput => {
  const rng = defaultRng;
  const { table, existingPlacements, constraints } = input;

  const result = new Map(existingPlacements);

  const minDist = constraints?.minDistPct ?? 12;
  const maxAttempts = constraints?.maxAttempts ?? 20;

  const toPlacement = (key: string, i: number): Placement => {
    const angle = i * 137.508 + (rng() - 0.5) * 25;
    const radius = 12 + rng() * 20;
    const rad = (angle * Math.PI) / 180;

    const cx = 50 + Math.cos(rad) * radius;
    const cy = 50 + Math.sin(rad) * radius;

    const jx = (rng() - 0.5) * 3;
    const jy = (rng() - 0.5) * 2;

    const left = clamp(cx + jx, 5, 70);
    const top = clamp(cy + jy, 10, 50);

    return {
      key,
      leftPct: left,
      topPct: top,
      rotationDeg: Math.floor(rng() * 36 - 18),
      z: Date.now() + rng(),
    };
  };

  let counter = result.size;

  for (const card of table) {
    const key = `${card.suit}-${card.rank}`;
    if (result.has(key)) continue;

    let candidate = toPlacement(key, counter++);
    let attempts = 0;

    while (
      attempts++ < maxAttempts &&
      !isFarEnough(result, candidate, minDist)
    ) {
      candidate = toPlacement(key, counter++);
    }

    result.set(key, candidate);
  }

  const currentKeys = new Set(table.map((c) => `${c.suit}-${c.rank}`));
  for (const k of result.keys()) {
    if (!currentKeys.has(k)) result.delete(k);
  }

  return { placements: result };
};

const isFarEnough = (
  placements: Map<string, Placement>,
  candidate: Placement,
  minDist: number,
) => {
  const min2 = minDist * minDist;
  for (const p of placements.values()) {
    const dx = p.leftPct - candidate.leftPct;
    const dy = p.topPct - candidate.topPct;
    if (dx * dx + dy * dy < min2) return false;
  }
  return true;
};

const clamp = (v: number, lo: number, hi: number) => {
  return Math.max(lo, Math.min(hi, v));
};
