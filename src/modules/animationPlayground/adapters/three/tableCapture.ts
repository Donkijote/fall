import { MathUtils } from "three";

import type { CardDropEffect } from "../../application/lab";
import { cardImpactProfiles } from "./cardImpactMotion";
import type { CardImpactSample } from "./cardImpactMotion";

export const impactAt = 0.55;
export const collectAt = 0.79;
const riseAt = 0.27;

const elementalLift = {
  ice: { apex: 0.36, activation: 0.052, height: 0.88 },
  heat: { apex: 0.375, activation: 0.06, height: 1.2 },
  flame: { apex: 0.383, activation: 0.074, height: 2.05 },
} as const;

export function captureElement(progress: number, effect: CardDropEffect) {
  if (effect === "plain") return 0;
  const { apex, activation } = elementalLift[effect];
  const start = apex + (effect === "flame" ? 0.017 : 0);
  return MathUtils.smoothstep(progress, start, start + activation);
}

export function captureDuration(effect: CardDropEffect) {
  return effect === "flame" ? 4.05 : 3.05;
}

export function captureFlight(progress: number, effect: CardDropEffect, drop: CardImpactSample) {
  const profile = cardImpactProfiles[effect];
  const release = impactAt - profile.fall / captureDuration(effect);
  const lift =
    effect === "plain"
      ? { apex: release, height: (profile.height - 0.8) * 0.59 }
      : elementalLift[effect];
  const raised = MathUtils.smoothstep(progress, riseAt, lift.apex);
  return {
    travel: raised,
    flip: MathUtils.smoothstep(raised, 0.06, 0.91),
    lift: raised * (lift.height * (1 - drop.fall) + 0.063 * drop.fall * (1 - drop.slap)),
    slam: drop.fallTime,
  };
}
