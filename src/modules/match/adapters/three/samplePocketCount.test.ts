import { countingArrival } from "@/components/cards/motion/cardCounting";

import { samplePocketCount } from "./samplePocketCount";

const pocket = { mouth: { x: 0.8, y: 0.2, z: 0 }, cardSize: 0.12 };

it.each([
  { x: -2, y: 2 },
  { x: 2, y: 2 },
  { x: -2, y: -2 },
  { x: 2, y: -2 },
])("lifts cards from %j and inserts them behind the matching pocket lip", (position) => {
  const origin = { ...position, z: 0, angle: 0.2 };
  for (const index of [0, 19, 20, 25]) {
    const arrival = countingArrival(index, 20);
    const start = samplePocketCount(index, 0, 20, origin, pocket, 0.2);
    expect(start.position).toEqual([origin.x, origin.y, origin.z]);
    expect(start.visible).toBe(false);
    expect(start.scale).toBe(1);
    const entry = samplePocketCount(index, arrival - 0.149, 20, origin, pocket, 0.2);
    expect(entry.entering).toBe(true);
    expect(entry.position[0]).toBeCloseTo(pocket.mouth.x);
    expect(entry.position[1] - (entry.scale * 0.2 * 2.88) / 2).toBeGreaterThan(pocket.mouth.y);
    expect(entry.scale).toBeCloseTo(0.6);
    const consumed = samplePocketCount(index, arrival, 20, origin, pocket, 0.2);
    expect(consumed.visible).toBe(false);
    // Its entire face passes below the clip plane, rather than popping off-table.
    expect(consumed.position[1] + (consumed.scale * 0.2 * 2.88) / 2).toBeLessThan(pocket.mouth.y);
    expect(consumed.scale).toBeCloseTo(entry.scale);
  }
});

it("retargets an active card to a moved pocket while keeping its arrival time", () => {
  const origin = { x: -2, y: -1, z: 0, angle: 0 };
  const seconds = countingArrival(0, 20) - 0.08;
  const before = samplePocketCount(0, seconds, 20, origin, pocket, 0.2);
  const moved = { ...pocket, mouth: { x: -0.5, y: 1.2, z: 0 } };
  const after = samplePocketCount(0, seconds, 20, origin, moved, 0.2);
  expect(after.position[0]).toBeCloseTo(moved.mouth.x);
  expect(after.position[1] - before.position[1]).toBeCloseTo(1);
  expect(after.progress).toBe(before.progress);
  expect(after.entering).toBe(true);
});
