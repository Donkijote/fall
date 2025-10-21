import type { Card, Rank } from "@/domain/entities/Card";

import { randomScatter } from "./randomScatter";

const cardKey = (c: Card) => `${c.suit}-${c.rank}`;

const makeDeck = (n = 6): Card[] => {
  const suits: Card["suit"][] = ["coins", "clubs", "swords", "cups"];
  const out: Card[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ suit: suits[i % suits.length], rank: ((i % 12) + 1) as Rank });
  }
  return out;
};

// Deterministic RNG helper: cycles through a fixed sequence
function mockRandom(seq: number[]) {
  let i = 0;
  return vi.spyOn(Math, "random").mockImplementation(() => {
    const v = seq[i % seq.length];
    i++;
    return v;
  });
}

describe("randomScatter", () => {
  let nowSpy: ReturnType<typeof vi.spyOn>;
  let randSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Stable Date.now so z-index order is predictable
    let t = 1_000_000;
    nowSpy = vi.spyOn(Date, "now").mockImplementation(() => (t += 10));

    // Stable Math.random sequence (values in [0,1))
    randSpy = mockRandom([
      0.13, 0.72, 0.91, 0.33, 0.55, 0.07, 0.44, 0.88, 0.21, 0.66, 0.39, 0.95,
    ]);
  });

  afterEach(() => {
    nowSpy.mockRestore();
    randSpy.mockRestore();
  });

  it("should creates one placement per card", () => {
    const table = makeDeck(5);
    const { placements } = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: 12, maxAttempts: 30 },
    });

    expect(placements.size).toBe(5);
    for (const c of table) {
      expect(placements.has(cardKey(c))).toBe(true);
    }
  });

  it("should keeps existing placements stable across calls", () => {
    const table = makeDeck(4);
    const first = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    // Call again with SAME cards; should preserve positions.
    const second = randomScatter({
      table,
      existingPlacements: first,
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    for (const k of first.keys()) {
      const a = first.get(k)!;
      const b = second.get(k)!;
      expect(a.leftPct).toBeCloseTo(b.leftPct, 6);
      expect(a.topPct).toBeCloseTo(b.topPct, 6);
      expect(a.rotationDeg).toBe(b.rotationDeg);
    }
  });

  it("should adding a new card does not move previous ones", () => {
    const base = makeDeck(3);
    const step1 = randomScatter({
      table: base,
      existingPlacements: new Map(),
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    const plusOne = [...base, { suit: "coins", rank: 12 } as Card];

    const step2 = randomScatter({
      table: plusOne,
      existingPlacements: step1,
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    // Old ones unchanged
    for (const c of base) {
      const k = cardKey(c);
      const a = step1.get(k)!;
      const b = step2.get(k)!;
      expect(a.leftPct).toBeCloseTo(b.leftPct, 6);
      expect(a.topPct).toBeCloseTo(b.topPct, 6);
      expect(a.rotationDeg).toBe(b.rotationDeg);
    }

    // New one exists
    expect(step2.has("coins-12")).toBe(true);
  });

  it("should respects bounds (left 5..95, top 10..70) and rotation in [-18..18]", () => {
    const table = makeDeck(10);
    const { placements } = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: 8, maxAttempts: 30 },
    });

    for (const p of placements.values()) {
      expect(p.leftPct).toBeGreaterThanOrEqual(5);
      expect(p.leftPct).toBeLessThanOrEqual(95);
      expect(p.topPct).toBeGreaterThanOrEqual(10);
      expect(p.topPct).toBeLessThanOrEqual(70);

      expect(p.rotationDeg).toBeGreaterThanOrEqual(-18);
      expect(p.rotationDeg).toBeLessThanOrEqual(18);

      expect(typeof p.z).toBe("number");
    }
  });

  it("should respects min distance (center-to-center) approximately", () => {
    const table = makeDeck(6);
    const minDist = 10;

    const { placements } = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: minDist, maxAttempts: 40 },
    });

    const arr = [...placements.values()];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const dx = arr[i].leftPct - arr[j].leftPct;
        const dy = arr[i].topPct - arr[j].topPct;
        const d = Math.hypot(dx, dy);
        // Allow a tiny epsilon because of jitter & retries
        expect(d).toBeGreaterThanOrEqual(minDist - 0.5);
      }
    }
  });

  it("should removes placements for cards that left the table", () => {
    const table = makeDeck(5);
    const step1 = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    const subset = table.slice(0, 3);
    const step2 = randomScatter({
      table: subset,
      existingPlacements: step1,
      constraints: { minDistPct: 10, maxAttempts: 25 },
    }).placements;

    // old keys removed
    for (const c of table.slice(3)) {
      expect(step2.has(cardKey(c))).toBe(false);
    }
    // kept keys remain
    for (const c of subset) {
      expect(step2.has(cardKey(c))).toBe(true);
    }
  });

  it("retries placement when a candidate is too close to an existing card", () => {
    const randSpy = vi.spyOn(Math, "random").mockImplementation(() => 0.5);

    const table = [
      { suit: "coins", rank: 1 },
      { suit: "clubs", rank: 2 },
    ] as Array<Card>;

    const { placements } = randomScatter({
      table,
      existingPlacements: new Map(),
      constraints: { minDistPct: 50, maxAttempts: 5 },
    });

    expect(placements.size).toBe(2);

    const [first, second] = Array.from(placements.values());

    const samePosition =
      first.leftPct === second.leftPct && first.topPct === second.topPct;

    expect(samePosition).toBe(false);

    randSpy.mockRestore();
  });
});
