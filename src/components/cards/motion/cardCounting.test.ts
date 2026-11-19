import { countingArrival, countingProgress, createCountingPlayback } from "./cardCounting";

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

it("uses the same arrival timing and audio at different playback speeds", () => {
  const sound = vi.fn();
  const normal = createCountingPlayback(3, 20, sound);
  const slow = createCountingPlayback(3, 20, () => {});
  for (let i = 0; i < 100; i++) normal.advance(0.02);
  for (let i = 0; i < 200; i++) slow.advance(0.02, 0.5);
  expect(slow.advance(0)).toEqual(normal.advance(0));
  expect(normal.advance(0).counted).toBe(3);
  expect(sound).toHaveBeenCalledTimes(3);
});
