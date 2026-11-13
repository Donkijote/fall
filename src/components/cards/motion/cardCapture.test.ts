import { sampleCardCapture } from "./cardCapture";

const hand = { x: 2, y: 0.1, z: 0.06, angle: -Math.PI / 2 };
const table = { x: -0.4, y: 0.5, z: 0.05 };
const pile = { x: 2, y: 1.55, z: 0.08 };
const pitch = 0.0075;
const sample = (progress: number, top: boolean) =>
  sampleCardCapture(progress, top, hand, table, pile, pitch);

it("starts with one card in hand and the captured card already face up on the table", () => {
  expect(sample(0, true)).toEqual({
    handTravel: 0,
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
  expect(sample(0.21, true).handTravel).toBeGreaterThan(0);
  expect(top.handTravel).toBe(1);
  expect(Math.abs(top.position[0] - table.x)).toBeLessThan(0.06);
  expect(Math.abs(top.position[1] - table.y)).toBeLessThan(0.06);
  expect(top.position[2]).toBeCloseTo(table.z + pitch);
  expect(top.rotation[0]).toBeCloseTo(0);
  expect(top.rotation[1]).toBeCloseTo(Math.PI);
  expect(Math.abs(top.rotation[2])).toBeGreaterThan(0.02);
  expect(Math.abs(top.rotation[2])).toBeLessThan(0.08);
  expect(sample(0.8, false).position[2]).toBeGreaterThan(pile.z);
});

it("places both cards face down on the player's right stack with thickness separation", () => {
  expect(sample(0.75, true).pileTravel).toBeGreaterThan(0);
  expect(sample(0.75, true).pileTravel).toBeLessThan(1);
  const lower = sample(1, false);
  const upper = sample(1, true);
  expect(lower.position[0]).toBeCloseTo(pile.x);
  expect(lower.position[1]).toBeCloseTo(pile.y);
  expect(upper.position[0]).toBeCloseTo(pile.x);
  expect(upper.position[1]).toBeCloseTo(pile.y);
  expect(lower.position[2] - upper.position[2]).toBeCloseTo(pitch);
  [lower, upper].forEach((card) => {
    expect(card.pileTravel).toBe(1);
    expect(card.rotation[0]).toBeCloseTo(0);
    expect(card.rotation[1]).toBeCloseTo(2 * Math.PI);
    expect(card.rotation[2]).toBeCloseTo(0);
  });
});

it("curves and banks the played card in flight, then keeps the settled pair continuous at pickup", () => {
  const inFlight = sample(0.21, true);
  const dx = table.x - hand.x;
  const dy = table.y - hand.y;
  const lateralDistance =
    Math.abs(dx * (inFlight.position[1] - hand.y) - dy * (inFlight.position[0] - hand.x)) /
    Math.hypot(dx, dy);
  expect(lateralDistance).toBeGreaterThan(0.04);
  expect(Math.abs(inFlight.rotation[0])).toBeGreaterThan(0.04);
  for (const top of [true, false]) {
    const before = sample(0.58 - 1e-7, top);
    const after = sample(0.58 + 1e-7, top);
    before.position.forEach((value, axis) =>
      expect(Math.abs(value - after.position[axis])).toBeLessThan(1e-5),
    );
    before.rotation.forEach((value, axis) =>
      expect(Math.abs(value - after.rotation[axis])).toBeLessThan(1e-5),
    );
  }
});
