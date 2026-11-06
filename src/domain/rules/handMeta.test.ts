import { HAND_META } from "./handMeta";

const EXPECTED_NAMES = Object.keys(HAND_META);

const SUITS = new Set(["coins", "cups", "swords", "clubs"]);
const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("Hand Meta", () => {
  it("includes metadata for all expected hands", () => {
    for (const name of EXPECTED_NAMES) {
      expect(HAND_META[name]).toBeTruthy();
    }
  });

  it("every entry has a unique kebab-case id and a non-empty description", () => {
    const ids = new Set<string>();

    for (const name of EXPECTED_NAMES) {
      const m = HAND_META[name]!;
      expect(typeof m.id).toBe("string");
      expect(m.id.length).toBeGreaterThan(0);
      expect(kebab.test(m.id)).toBe(true);

      expect(typeof m.description).toBe("string");
      expect(m.description.trim().length).toBeGreaterThan(0);

      expect(ids.has(m.id)).toBe(false);
      ids.add(m.id);
    }
  });

  it("tags (when present) are an array of non-empty strings", () => {
    for (const name of EXPECTED_NAMES) {
      const { tags } = HAND_META[name]!;
      if (!tags) continue;
      expect(Array.isArray(tags)).toBe(true);
      for (const t of tags) {
        expect(typeof t).toBe("string");
        expect(t.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("examples (when present) use valid shape: rank:number, suit in allowed suits", () => {
    for (const name of EXPECTED_NAMES) {
      const { example } = HAND_META[name]!;
      if (!example) continue;

      expect(Array.isArray(example)).toBe(true);
      for (const c of example) {
        expect(typeof c.rank).toBe("number");
        expect(Number.isFinite(c.rank)).toBe(true);

        expect(typeof c.suit).toBe("string");
        expect(SUITS.has(c.suit)).toBe(true);
      }
    }
  });

  it("does not contain unknown hand keys (guard against typos)", () => {
    const known = new Set(EXPECTED_NAMES);
    for (const key of Object.keys(HAND_META)) {
      expect(known.has(key)).toBe(true);
    }
  });
});
