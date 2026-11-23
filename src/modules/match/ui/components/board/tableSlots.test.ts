import { placeTableCards, tableSlotCount, wideTableSlot } from "./tableSlots";

test("adding, capturing, and replacing table cards never moves the remaining cards", () => {
  const opening = ["coins-1", "swords-2", "clubs-3", "cups-4"] as const;
  const before = placeTableCards(new Map(), opening);
  const added = placeTableCards(before, [...opening, "coins-7"]);
  expect(added.size).toBe(5);
  expect(new Set(added.values()).size).toBe(5);
  expect([...added.values()].every((slot) => slot >= 0 && slot < tableSlotCount)).toBe(true);
  expect(new Set([...before.values()].map((slot) => Math.floor(slot / 4))).size).toBeGreaterThan(1);
  for (const key of opening) expect(added.get(key)).toBe(before.get(key));

  const after = placeTableCards(added, ["coins-1", "cups-4", "coins-7", "swords-12"]);
  expect(after.has("swords-2")).toBe(false);
  expect(after.has("clubs-3")).toBe(false);
  for (const key of ["coins-1", "cups-4", "coins-7"] as const) {
    expect(after.get(key)).toBe(added.get(key));
  }
});

test("placing a reserved landing card commits it in the exact same slot", () => {
  const reserved = placeTableCards(new Map(), ["coins-1", "swords-2"]);
  expect(placeTableCards(reserved, ["coins-1", "swords-2"])).toBe(reserved);
});

test("the opening occupies a reading-order 2×2 block and later cards keep those slots", () => {
  const keys = ["coins-1", "cups-2", "swords-3", "clubs-4"] as const;
  const opening = placeTableCards(new Map(), keys, true);
  expect([...opening.values()]).toEqual([1, 2, 5, 6]);
  const later = placeTableCards(opening, [...keys, "coins-7", "clubs-12"]);
  expect(keys.map((key) => later.get(key))).toEqual([1, 2, 5, 6]);
  expect(new Set(later.values()).size).toBe(6);
  expect([...opening.values()].map(wideTableSlot)).toEqual([2, 3, 8, 9]);
  expect(new Set(Array.from({ length: 12 }, (_, slot) => wideTableSlot(slot))).size).toBe(12);
});
