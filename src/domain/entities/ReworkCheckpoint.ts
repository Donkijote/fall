import type { AnimationProfile } from "@domain/value-objects/AnimationProfile";

export type ReworkPhase = "v1-alpha";

export interface ReworkCheckpoint {
  phase: ReworkPhase;
  animationProfile: AnimationProfile;
  logicObjective: string;
}
