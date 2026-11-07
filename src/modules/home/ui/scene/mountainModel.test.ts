import { Shape, ShapeGeometry, Vector2 } from "three";

import { getMountainScale, mountainFrame, mountainLayers, mountainPoints } from "./mountainModel";

test("keeps three back-to-front ridgelines with progressively lower peaks", () => {
  expect(mountainLayers.map((layer) => layer.id)).toEqual(["distant", "middle", "foothills"]);
  const peaks = mountainLayers.map((layer) =>
    Math.min(...layer.ridge.map(([, vertical]) => vertical)),
  );
  expect(peaks[0]).toBeLessThan(peaks[1]);
  expect(peaks[1]).toBeLessThan(peaks[2]);
  for (const layer of mountainLayers) {
    expect(layer.ridge.at(-2)).toEqual([mountainFrame.width, mountainFrame.height]);
    expect(layer.ridge.at(-1)).toEqual([0, mountainFrame.height]);
  }
});

test("uses finite in-frame coordinates that triangulate for both renderers", () => {
  for (const layer of mountainLayers) {
    for (const points of [layer.ridge, ...layer.facets.map((facet) => facet.points)]) {
      expect(points.length).toBeGreaterThanOrEqual(3);
      for (const [horizontal, vertical] of points) {
        expect(horizontal).toBeGreaterThanOrEqual(0);
        expect(horizontal).toBeLessThanOrEqual(mountainFrame.width);
        expect(vertical).toBeGreaterThanOrEqual(0);
        expect(vertical).toBeLessThanOrEqual(mountainFrame.height);
      }
      const geometry = new ShapeGeometry(
        new Shape(points.map(([horizontal, vertical]) => new Vector2(horizontal, -vertical))),
      );
      expect(geometry.index!.count).toBeGreaterThan(0);
      geometry.dispose();
    }
  }
});

test.each([
  { width: 1600, height: 900, scale: 1 },
  { width: 320, height: 568, scale: 568 / 900 },
  { width: 844, height: 390, scale: 844 / 1600 },
  { width: 2560, height: 1080, scale: 2560 / 1600 },
])("matches SVG cover sizing at $width × $height", ({ width, height, scale }) => {
  expect(getMountainScale(width, height)).toBe(scale);
  expect(mountainFrame.width * scale).toBeGreaterThanOrEqual(width);
  expect(mountainFrame.height * scale).toBeGreaterThanOrEqual(height);
});

test("serializes shared points for the static SVG without changing the composition", () => {
  expect(
    mountainPoints([
      [0, 472],
      [621, 246],
      [1600, 900],
    ]),
  ).toBe("0,472 621,246 1600,900");
});
