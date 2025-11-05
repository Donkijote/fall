import type { Card } from "@/domain/entities/Card";
// ts: no reorder
import { HANDS } from "@/domain/rules/hands";

import { getUiHands, type UiHand } from "./handWithMeta";

vi.mock("@/domain/rules/hands", () => {
  const patternA = (c: Card[]) => c.length === 3;
  const strengthA = () => 11;

  const patternB = (c: Card[]) => c.length === 3;
  const strengthB = () => 12;

  const patternC = () => true;
  const strengthC = () => 1;

  const HANDS = [
    {
      name: "Alpha Pair",
      points: 3,
      mandatory: true,
      pattern: patternA,
      rankStrength: strengthA,
    },
    {
      name: "Bravo Run",
      points: 6,
      mandatory: true,
      pattern: patternB,
      rankStrength: strengthB,
    },
    {
      name: "No Meta Hand",
      points: 1,
      mandatory: false,
      pattern: patternC,
      rankStrength: strengthC,
    },
  ] as const;

  return { HANDS };
});

vi.mock("@/domain/rules/handMeta", () => {
  const HAND_META = {
    "alpha-pair": {
      id: "alpha-pair",
      description: "A pair-focused combo",
      tags: ["pair", "mandatory"],
    },
    "bravo-run": {
      id: "bravo-run",
      description: "Three consecutive ranks",
      tags: ["run"],
    },
  } as const;

  return { HAND_META };
});

const byName = (arr: UiHand[], name: string) =>
  arr.find((x) => x.name === name)!;

describe("handWithMeta.getUiHands", () => {
  it("merges HANDS with HAND_META by name and preserves array length", () => {
    const ui = getUiHands();
    expect(ui.length).toBe(HANDS.length);

    const a = byName(ui, "Alpha Pair");
    const b = byName(ui, "Bravo Run");
    const c = byName(ui, "No Meta Hand");

    expect(a.id).toBe("alpha-pair");
    expect(b.id).toBe("bravo-run");
    expect(c).toBeTruthy();
  });

  it("preserves original Hand fields (points, mandatory) and function references", () => {
    const ui = getUiHands();

    const srcA = byName(HANDS as UiHand[], "Alpha Pair");
    const srcB = byName(HANDS as UiHand[], "Bravo Run");

    const a = byName(ui, "Alpha Pair");
    const b = byName(ui, "Bravo Run");

    // primitives preserved
    expect(a.points).toBe(srcA.points);
    expect(a.mandatory).toBe(srcA.mandatory);
    expect(b.points).toBe(srcB.points);
    expect(b.mandatory).toBe(srcB.mandatory);

    // function references preserved
    expect(a.pattern).toBe(srcA.pattern);
    expect(a.rankStrength).toBe(srcA.rankStrength);
    expect(b.pattern).toBe(srcB.pattern);
    expect(b.rankStrength).toBe(srcB.rankStrength);
  });

  it("applies metadata fields when present (id, description, tags)", () => {
    const ui = getUiHands();

    const a = byName(ui, "Alpha Pair");
    const b = byName(ui, "Bravo Run");

    expect(a.description).toBe("A pair-focused combo");
    expect(a.tags).toEqual(["pair", "mandatory"]);

    expect(b.description).toBe("Three consecutive ranks");
    expect(b.tags).toEqual(["run"]);
  });

  it("falls back when metadata is missing: id=kebab-case(name), description='', tags=[]", () => {
    const ui = getUiHands();
    const c = byName(ui, "No Meta Hand");

    expect(c.id).toBe("no-meta-hand");
    expect(c.description).toBe("");
    expect(Array.isArray(c.tags)).toBe(true);
    expect(c.tags?.length).toBe(0);
  });

  it("produces objects usable by the UI (has name, points, mandatory, id)", () => {
    const ui = getUiHands();
    for (const h of ui) {
      expect(typeof h.name).toBe("string");
      expect(typeof h.points).toBe("number");
      expect(typeof h.mandatory).toBe("boolean");
      expect(typeof h.id).toBe("string");
    }
  });
});
