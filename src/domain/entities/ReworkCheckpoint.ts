import type { AnimationProfile } from "@domain/value-types/AnimationProfile";

export type ReworkPhase = "v1-alpha";

export interface ReworkCheckpoint {
  phase: ReworkPhase;
  animationProfile: AnimationProfile;
  logicObjective: string;
}
