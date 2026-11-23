import type { CardKey } from "@/domain/entities/Card";

export const tableSlotCount = 12;
export type TableSlots = ReadonlyMap<CardKey, number>;

function cardHash(key: CardKey) {
  let hash = 2166136261;
  for (const letter of key) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return hash >>> 0;
}

export function placeTableCards(
  previous: TableSlots,
  keys: readonly CardKey[],
  opening = false,
): TableSlots {
  if (previous.size === keys.length && keys.every((key) => previous.has(key))) return previous;

  const next = new Map<CardKey, number>();
  for (const key of keys) {
    const slot = previous.get(key);
    if (slot !== undefined) next.set(key, slot);
  }

  if (opening) {
    const openingSlots = [1, 2, 5, 6];
    keys.slice(0, 4).forEach((key, index) => next.set(key, openingSlots[index]));
  }
  const taken = new Set(next.values());
  for (const key of keys) {
    if (next.has(key)) continue;
    const preferred = cardHash(key) % tableSlotCount;
    for (let offset = 0; offset < tableSlotCount; offset++) {
      const slot = (preferred + offset) % tableSlotCount;
      if (taken.has(slot)) continue;
      next.set(key, slot);
      taken.add(slot);
      break;
    }
  }
  return next;
}

// Preserve one logical slot map across both responsive grid shapes. The centre
// four slots form the same reading-order 2×2 block in 4×3 and 6×2 layouts.
export function wideTableSlot(slot: number) {
  return [0, 2, 3, 1, 4, 8, 9, 5, 6, 7, 10, 11][slot];
}
