import {
  cascadeCaptureDuration,
  cascadeOrder,
  cascadeStepTime,
  cascadeTravelTime,
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
  for (let index = 0; index < targets.length; index++) {
    const arrival = index * cascadeStepTime + cascadeTravelTime;
    const own = targets[index];
    expect(sample(arrival, index).position).toEqual([own.x, own.y, own.z]);
    const played = sample(arrival, -1);
    expect(played.position[0]).toBeCloseTo(own.x);
    expect(played.position[1]).toBeCloseTo(own.y);
    expect(played.position[2]).toBeCloseTo(own.z + (index + 1) * pitch);
  }
});

it("carries the growing pile together while untouched cards remain on the table", () => {
  for (let leg = 1; leg < targets.length; leg++) {
    const seconds = leg * cascadeStepTime + cascadeTravelTime / 2;
    const played = sample(seconds, -1);
    for (let index = 0; index < targets.length; index++) {
      const card = sample(seconds, index);
      if (index < leg) {
        expect(card.position[0]).toBeCloseTo(played.position[0]);
        expect(card.position[1]).toBeCloseTo(played.position[1]);
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
      const before = sample(leg * cascadeStepTime - 1e-7, index);
      const after = sample(leg * cascadeStepTime + 1e-7, index);
      before.position.forEach((value, axis) =>
        expect(Math.abs(value - after.position[axis])).toBeLessThan(1e-5),
      );
    }
  }
  const heights: number[] = [];
  for (let index = -1; index < targets.length; index++) {
    const final = sample(cascadeCaptureDuration, index);
    expect(final.position[0]).toBeCloseTo(pile.x);
    expect(final.position[1]).toBeCloseTo(pile.y);
    expect(final.rotation).toEqual([0, 2 * Math.PI, 0]);
    heights.push(final.position[2]);
  }
  heights.slice(1).forEach((height, index) => expect(height - heights[index]).toBeCloseTo(pitch));
});
