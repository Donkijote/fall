import { sampleCardCapture } from "./cardCapture";

const hand = { x: 2, y: 0.1, z: 0.06, angle: -Math.PI / 2 };
const table = { x: -0.4, y: 0.5, z: 0.05 };
const pile = { x: 2, y: 1.55, z: 0.08 };
const pitch = 0.0075;
const sample = (progress: number, top: boolean) =>
  sampleCardCapture(progress, top, hand, table, pile, pitch);

it("starts with one card in hand and the captured card already face up on the table", () => {
  expect(sample(0, true)).toEqual({
    position: [hand.x, hand.y, hand.z],
    rotation: [0, 0, hand.angle],
  });
  for (const progress of [0, 0.2, 0.42, 0.57]) {
    expect(sample(progress, false)).toEqual({
      position: [table.x, table.y, table.z],
      rotation: [0, Math.PI, 0],
    });
  }
});

it("lands the played card on the table card before lifting either one", () => {
  const top = sample(0.5, true);
  expect(top.position[0]).toBeCloseTo(table.x);
  expect(top.position[1]).toBeCloseTo(table.y);
  expect(top.position[2]).toBeCloseTo(table.z + pitch);
  expect(top.rotation[0]).toBeCloseTo(0);
  expect(top.rotation[1]).toBeCloseTo(Math.PI);
  expect(top.rotation[2]).toBeCloseTo(0);
  expect(sample(0.8, false).position[2]).toBeGreaterThan(pile.z);
});

it("places both cards face down on the player's right stack with thickness separation", () => {
  const lower = sample(1, false);
  const upper = sample(1, true);
  expect(lower.position[0]).toBeCloseTo(pile.x);
  expect(lower.position[1]).toBeCloseTo(pile.y);
  expect(upper.position[0]).toBeCloseTo(pile.x);
  expect(upper.position[1]).toBeCloseTo(pile.y);
  expect(lower.position[2] - upper.position[2]).toBeCloseTo(pitch);
  expect(lower.rotation).toEqual([0, 2 * Math.PI, 0]);
  expect(upper.rotation).toEqual(lower.rotation);
});
