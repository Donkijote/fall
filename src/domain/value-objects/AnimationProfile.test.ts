import { AnimationProfile } from "@domain/value-objects/AnimationProfile";

describe("AnimationProfile", () => {
  it("creates a profile when the value is allowed", () => {
    const profile = AnimationProfile.create("balanced");

    expect(profile.value).toBe("balanced");
  });

  it("throws when the value is not allowed", () => {
    expect(() => AnimationProfile.create("broken")).toThrow(
      "Invalid animation profile: broken",
    );
  });
});
