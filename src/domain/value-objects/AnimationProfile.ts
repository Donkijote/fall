export const animationProfiles = ["minimal", "balanced", "cinematic"] as const;

export type AnimationProfileName = (typeof animationProfiles)[number];

export class AnimationProfile {
  public readonly value: AnimationProfileName;

  private constructor(value: AnimationProfileName) {
    this.value = value;
  }

  static create(value: string): AnimationProfile {
    if (!animationProfiles.includes(value as AnimationProfileName)) {
      throw new Error(`Invalid animation profile: ${value}`);
    }

    return new AnimationProfile(value as AnimationProfileName);
  }
}
