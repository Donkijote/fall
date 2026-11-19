import { pointsFlight } from "./pointsFlight";

it.each([
  [844, 390],
  [667, 320],
  [390, 844],
  [1440, 900],
])(
  "keeps the badge and visible caption inside a %s × %s board throughout flight",
  (width, height) => {
    for (const left of [4, width / 2, width - 44]) {
      const input = {
        bounds: { left: 20, top: 30, width, height },
        source: { left: width + 2, top: height + 10, width: 30, height: 30 },
        destination: { left: left + 20, top: 34, width: 40, height: 28 },
        badge: { width: 56, height: 56 },
        caption: { width: 160, height: 24 },
        reveal: 1,
      };
      for (let step = 0; step <= 100; step++) {
        const pose = pointsFlight({ ...input, progress: step / 100 });
        const halfWidth = (Math.max(56, pose.captionOpacity > 0 ? 160 : 0) * pose.scale) / 2;
        const halfHeight = 28 * pose.scale;
        const extraHeight = pose.captionOpacity > 0 ? 28 * pose.scale : 0;
        expect(pose.x - halfWidth).toBeGreaterThanOrEqual(2.999);
        expect(pose.x + halfWidth).toBeLessThanOrEqual(width - 2.999);
        expect(pose.y - halfHeight).toBeGreaterThanOrEqual(2.999);
        expect(pose.y + halfHeight + extraHeight).toBeLessThanOrEqual(height - 2.999);
      }
      const landed = pointsFlight({ ...input, progress: 1 });
      expect(landed.x).toBeCloseTo(left + 20);
      expect(landed.y).toBeCloseTo(18);
      expect(56 * landed.scale).toBeLessThanOrEqual(28);
      expect(landed.captionOpacity).toBe(0);
    }
  },
);

it("adapts an in-flight token after orientation changes and keeps the arrival inside the tile", () => {
  const input = {
    bounds: { left: 0, top: 0, width: 390, height: 844 },
    destination: { left: 150, top: 8, width: 44, height: 32 },
    badge: { width: 56, height: 56 },
    caption: { width: 100, height: 24 },
    progress: 0.85,
    reveal: 1,
  };
  const portrait = pointsFlight(input);
  const landscape = pointsFlight({
    ...input,
    bounds: { left: 0, top: 0, width: 844, height: 390 },
    destination: { left: 4, top: 4, width: 40, height: 28 },
  });
  expect(landscape.scale).toBeLessThan(portrait.scale);
  expect(landscape.y - 28 * landscape.scale).toBeGreaterThanOrEqual(3);
  expect(landscape.x).not.toBe(portrait.x);
});
