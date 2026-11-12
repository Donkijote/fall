import { sampleFallCascade } from "./sampleFallCascade";

const hand = { x: 0, y: -2, z: 0, angle: -0.12, faceUp: true };
const targets = [
  { x: 0.5, y: 0, z: 0 },
  { x: 1, y: -0.5, z: 0 },
];
const pile = { x: 0, y: -1.8, z: 0 };
const landing = { position: [0.54, 0.02, 0.0075], rotation: [0, Math.PI, 0.06] };

it("continues from the Fall contact pose without jumping, then collects all cards", () => {
  const top = sampleFallCascade(0, -1, hand, targets, pile, 0.0075, landing);
  top.position.forEach((value, index) => expect(value).toBeCloseTo(landing.position[index]));
  top.rotation.forEach((value, index) => expect(value).toBeCloseTo(landing.rotation[index]));
  for (const index of [-1, 0, 1]) {
    const end = sampleFallCascade(
      1,
      index,
      hand,
      targets,
      pile,
      0.0075,
      index === -1 ? landing : undefined,
    );
    expect(end.position[0]).toBeCloseTo(pile.x);
    expect(end.position[1]).toBeCloseTo(pile.y);
    expect(end.rotation[1]).toBeCloseTo(2 * Math.PI);
  }
});
