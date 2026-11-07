import { createEmberSeeds, getAtmosphereQuality, getCoverScale } from "./atmosphereModel";

describe("login atmosphere model", () => {
  it.each([
    [2, [1, 0.5]],
    [0.5, [0.5, 1]],
    [1, [1, 1]],
  ])("keeps the square photograph and foreground mask aligned at aspect %s", (aspect, expected) => {
    expect(getCoverScale(aspect as number)).toEqual(expected);
  });

  it("creates repeatable bounded particle seeds without random initialization", () => {
    const seeds = createEmberSeeds(160);
    expect(seeds).toEqual(createEmberSeeds(160));
    expect(seeds).toHaveLength(480);
    for (let index = 0; index < seeds.length; index += 3) {
      expect(seeds[index]).toBeGreaterThanOrEqual(-0.5);
      expect(seeds[index]).toBeLessThanOrEqual(0.5);
      expect(seeds[index + 1]).toBeGreaterThanOrEqual(0);
      expect(seeds[index + 1]).toBeLessThanOrEqual(1);
      expect(seeds[index + 2]).toBeGreaterThanOrEqual(0);
      expect(seeds[index + 2]).toBeLessThanOrEqual(1);
    }
  });

  it("caps rendering quality and halves the particle budget on compact devices", () => {
    expect(getAtmosphereQuality(false)).toEqual({
      dpr: [1, 1.5],
      distantEmbers: 104,
      nearEmbers: 56,
    });
    expect(getAtmosphereQuality(true)).toEqual({ dpr: 1, distantEmbers: 52, nearEmbers: 28 });
  });
});
