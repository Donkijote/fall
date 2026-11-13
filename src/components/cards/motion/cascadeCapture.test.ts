import {
  cascadeCaptureDuration,
  cascadeOrder,
  cascadeSteps,
  sampleCascadeCapture,
} from "./cascadeCapture";

const hand = { x: 2, y: 0.1, z: 0.06, angle: -Math.PI / 2 };
const targets = [
  { x: -0.4, y: 0.5, z: 0.05 },
  { x: 0.4, y: 0.5, z: 0.05 },
  { x: 0.4, y: -0.5, z: 0.05 },
  { x: -0.4, y: -0.5, z: 0.05 },
];
const pile = { x: 2, y: 1.55, z: 0.1 };
const pitch = 0.0075;
const sample = (seconds: number, index: number) =>
  sampleCascadeCapture(seconds / cascadeCaptureDuration, index, hand, targets, pile, pitch);

it("visits every table card once in an adjacent sequence", () => {
  expect(cascadeOrder).toEqual([0, 1, 3, 2]);
  expect(sample(0, -1).handTravel).toBe(0);
  for (let index = 0; index < targets.length; index++) {
    const arrival = cascadeSteps[index].start + cascadeSteps[index].travel;
    const own = targets[index];
    expect(sample(arrival, index).position).toEqual([own.x, own.y, own.z]);
    const played = sample(arrival, -1);
    expect(played.handTravel).toBeCloseTo(1);
    expect(Math.abs(played.position[0] - own.x)).toBeLessThan(0.06);
    expect(Math.abs(played.position[1] - own.y)).toBeLessThan(0.06);
    expect(played.position[2]).toBeCloseTo(own.z + (index + 1) * pitch);
  }
});

it("carries the growing pile together while untouched cards remain on the table", () => {
  for (let leg = 1; leg < targets.length; leg++) {
    const seconds = cascadeSteps[leg].start + cascadeSteps[leg].travel / 2;
    const played = sample(seconds, -1);
    for (let index = 0; index < targets.length; index++) {
      const card = sample(seconds, index);
      if (index < leg) {
        expect(Math.abs(card.position[0] - played.position[0])).toBeLessThan(0.06);
        expect(Math.abs(card.position[1] - played.position[1])).toBeLessThan(0.06);
        expect(played.position[2] - card.position[2]).toBeCloseTo((index + 1) * pitch);
      } else {
        expect(card.position).toEqual([targets[index].x, targets[index].y, targets[index].z]);
      }
    }
  }
});

it("keeps collected cards continuous at each pickup and stacks all five face down", () => {
  for (let leg = 1; leg <= targets.length; leg++) {
    for (let index = -1; index < leg; index++) {
      const boundary =
        leg === targets.length
          ? cascadeSteps[leg - 1].start + cascadeSteps[leg - 1].duration
          : cascadeSteps[leg].start;
      const before = sample(boundary - 1e-7, index);
      const after = sample(boundary + 1e-7, index);
      before.position.forEach((value, axis) =>
        expect(Math.abs(value - after.position[axis])).toBeLessThan(1e-5),
      );
      before.rotation.forEach((value, axis) =>
        expect(Math.abs(value - after.rotation[axis])).toBeLessThan(1e-5),
      );
    }
  }
  const heights: number[] = [];
  for (let index = -1; index < targets.length; index++) {
    const final = sample(cascadeCaptureDuration, index);
    expect(final.position[0]).toBeCloseTo(pile.x);
    expect(final.position[1]).toBeCloseTo(pile.y);
    expect(final.rotation[0]).toBeCloseTo(0);
    expect(final.rotation[1]).toBeCloseTo(2 * Math.PI);
    expect(final.rotation[2]).toBeCloseTo(0);
    heights.push(final.position[2]);
  }
  heights.slice(1).forEach((height, index) => expect(height - heights[index]).toBeCloseTo(pitch));
});

it("varies pickup cadence and banks through curved approaches", () => {
  expect(new Set(cascadeSteps.map((step) => step.duration)).size).toBeGreaterThan(1);
  for (let leg = 0; leg < cascadeSteps.length; leg++) {
    const step = cascadeSteps[leg];
    const inFlight = sample(step.start + step.travel / 2, -1);
    const from = leg === 0 ? hand : targets[leg - 1];
    const to = targets[leg];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const lateral =
      Math.abs(dx * (inFlight.position[1] - from.y) - dy * (inFlight.position[0] - from.x)) /
      Math.hypot(dx, dy);
    expect(lateral).toBeGreaterThan(0.005);
    expect(Math.abs(inFlight.rotation[0])).toBeGreaterThan(0.005);
    expect(inFlight).toEqual(sample(step.start + step.travel / 2, -1));
  }
});
