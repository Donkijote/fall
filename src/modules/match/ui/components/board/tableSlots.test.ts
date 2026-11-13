import { placeTableCards, tableSlotCount } from "./tableSlots";

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
