import {
  createTavernSurface,
  getTavernPlacement,
  tavernPlacement,
  tavernTextureSize,
} from "./tavernModel";
import type { TavernSurface } from "./tavernModel";

test.each<TavernSurface>(["stone", "timber", "roof", "plaster"])(
  "generates a deterministic opaque %s surface without image requests",
  (surface) => {
    const pixels = createTavernSurface(surface);
    expect(pixels).toHaveLength(tavernTextureSize * tavernTextureSize * 4);
    expect(pixels).toEqual(createTavernSurface(surface));
    const colors = new Set<string>();
    for (let offset = 0; offset < pixels.length; offset += 4) {
      expect(pixels[offset + 3]).toBe(255);
      colors.add(`${pixels[offset]},${pixels[offset + 1]},${pixels[offset + 2]}`);
    }
    expect(colors.size).toBeGreaterThan(10);
  },
);

test("gives each building material a distinct surface", () => {
  const surfaces: TavernSurface[] = ["stone", "timber", "roof", "plaster"];
  const signatures = surfaces.map((surface) => createTavernSurface(surface).join(","));
  expect(new Set(signatures).size).toBe(4);
});

test.each([
  { width: 1600, height: 900 },
  { width: 844, height: 390 },
  { width: 2560, height: 1080 },
])(
  "anchors the tavern left of the game entry in $width × $height landscape",
  ({ width, height }) => {
    expect(getTavernPlacement(width, height)).toEqual(tavernPlacement.landscape);
    expect(getTavernPlacement(width, height).horizontal).toBeLessThan(500);
  },
);

test.each([
  { width: 320, height: 568 },
  { width: 390, height: 844 },
])(
  "moves and reduces the tavern to keep a visible portrait landmark at $width × $height",
  ({ width, height }) => {
    const placement = getTavernPlacement(width, height);
    expect(placement).toEqual(tavernPlacement.portrait);
    expect(placement.scale).toBeLessThan(tavernPlacement.landscape.scale);
    expect(placement.horizontal).toBeGreaterThan(tavernPlacement.landscape.horizontal);
  },
);
