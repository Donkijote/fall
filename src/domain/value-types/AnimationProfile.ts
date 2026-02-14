import type { Brand } from "@shared/types/Brand";

export const animationProfiles = ["minimal", "balanced", "cinematic"] as const;

export type AnimationProfileName = (typeof animationProfiles)[number];
export type AnimationProfile = Brand<AnimationProfileName, "AnimationProfile">;

export const createAnimationProfile = (value: string): AnimationProfile => {
  if (!animationProfiles.includes(value as AnimationProfileName)) {
    throw new Error(`Invalid animation profile: ${value}`);
  }

  return value as AnimationProfile;
};

export const toAnimationProfileName = (
  value: AnimationProfile,
): AnimationProfileName => {
  return value as AnimationProfileName;
};
