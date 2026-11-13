import { countingArrival, countingProgress, sampleCountingCard } from "./cardCounting";

it.each([12, 13, 20])("awards points only for cards over the %i quota", (quota) => {
  const total = quota + 6;
  expect(countingProgress(0, total, quota)).toEqual({ counted: 0, points: 0, complete: false });
  expect(countingProgress(countingArrival(quota - 1, quota), total, quota)).toEqual({
    counted: quota,
    points: 0,
    complete: false,
  });
  for (let bonus = 1; bonus <= 6; bonus++) {
    const time = countingArrival(quota + bonus - 1, quota);
    expect(countingProgress(time - 0.001, total, quota).points).toBe(bonus - 1);
    expect(countingProgress(time, total, quota)).toEqual({
      counted: quota + bonus,
      points: bonus,
      complete: bonus === 6,
    });
  }
});

it.each([0, 12, 19, 20])("finishes a pile of %i cards with no bonus at quota 20", (total) => {
  expect(countingProgress(100, total, 20)).toEqual({ counted: total, points: 0, complete: true });
});

it("keeps the counted quota visible and consumes only bonus cards", () => {
  const regular = sampleCountingCard(19, 100, 26, 20);
  expect(regular.visible).toBe(true);
  expect(regular.scale).toBe(1);
  const extra = sampleCountingCard(20, 100, 26, 20);
  expect(extra.visible).toBe(false);
  expect(extra.scale).toBeCloseTo(0);
});

it("starts at the captured pile, travels on a banked arc, and has deterministic finite poses", () => {
  for (let index = 0; index < 26; index++) {
    const start = sampleCountingCard(index, 0, 26, 20);
    expect(start.position[0]).toBeCloseTo(2.1);
    expect(start.position[1]).toBeCloseTo(-0.6);
    expect(start.scale).toBe(1);
    const time = countingArrival(index, 20) - 0.25;
    const middle = sampleCountingCard(index, time, 26, 20);
    expect(middle.position[2]).toBeGreaterThan(start.position[2]);
    expect(Math.abs(middle.rotation[0])).toBeGreaterThan(0.1);
    for (const seconds of [-1, 0, time, 10, 100]) {
      const pose = sampleCountingCard(index, seconds, 26, 20);
      expect(pose).toEqual(sampleCountingCard(index, seconds, 26, 20));
      expect([...pose.position, ...pose.rotation, pose.scale].every(Number.isFinite)).toBe(true);
    }
  }
});
