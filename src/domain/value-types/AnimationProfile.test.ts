import {
  createAnimationProfile,
  toAnimationProfileName,
} from "@domain/value-types/AnimationProfile";

describe("AnimationProfile", () => {
  it("creates a profile when the value is allowed", () => {
    const profile = createAnimationProfile("balanced");

    expect(toAnimationProfileName(profile)).toBe("balanced");
  });

  it("throws when the value is not allowed", () => {
    expect(() => createAnimationProfile("broken")).toThrow(
      "Invalid animation profile: broken",
    );
  });
});
