import { MathUtils } from "three";

import type { CardDropEffect } from "./cardFlights";
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

import type { CardAnchor, CardPoint, CardPose } from "./cardFlights";
import { cardLandingPose } from "./cardImpactMotion";

export type FallPose = CardPose & {
  handTravel?: number;
  shadow?: { lift: number; opacity: number };
};

export function sampleFallCapture(
  progress: number,
  topCard: boolean,
  origin: CardAnchor,
  match: CardPoint,
  pile: CardPoint,
  pitch: number,
  impactScale: number,
  effect: CardDropEffect,
  impact: CardImpactSample,
): FallPose {
  const pose = cardLandingPose(effect, impact);
  const hitX = match.x + (pose.x + 0.18) * impactScale;
  const hitY = match.y + pose.y * impactScale;
  const lowerX = match.x + (pose.lowerX + 0.03) * impactScale;
  const lowerY = match.y + (pose.lowerY + 0.06) * impactScale;
  const lerp = MathUtils.lerp;
  const smooth = MathUtils.smoothstep;

  if (progress < collectAt) {
    if (topCard) {
      if (progress <= 0.27)
        return {
          handTravel: 0,
          position: [origin.x, origin.y, origin.z],
          rotation: [0, origin.faceUp ? Math.PI : 0, origin.angle],
        };
      const flight = captureFlight(progress, effect, impact);
      return {
        handTravel: flight.travel,
        position: [
          lerp(origin.x, hitX, flight.travel),
          lerp(origin.y, hitY, flight.travel) + flight.lift * 0.22,
          lerp(origin.z, match.z + pitch, flight.travel) + flight.lift,
        ],
        rotation: [
          pose.pitch * flight.flip,
          (origin.faceUp ? Math.PI : Math.PI * flight.flip) + pose.roll * flight.flip,
          lerp(origin.angle, -pose.yaw, flight.travel),
        ],
        scale: 1 + flight.lift * 0.27,
        shadow:
          progress < impactAt
            ? {
                lift: flight.lift,
                opacity: flight.travel * (0.36 - Math.min(flight.lift, 1.6) * 0.16),
              }
            : undefined,
      };
    }

    const earlier = smooth(progress, 0, 0.23);
    return {
      position: [
        lerp(origin.x, lowerX, earlier),
        lerp(origin.y, lowerY, earlier),
        lerp(origin.z, match.z, earlier) + 0.38 * Math.sin(Math.PI * earlier),
      ],
      rotation: [
        0,
        origin.faceUp ? Math.PI : Math.PI * smooth(earlier, 0.12, 0.88),
        origin.angle * (1 - earlier) - (pose.lowerYaw - 0.09),
      ],
    };
  }

  const collect = smooth(progress, collectAt, 1);
  const flip = Math.PI * smooth(collect, 0.14, 0.86);
  const offsetZ = topCard ? pitch : 0;
  const offsetX = topCard ? (hitX - lowerX) * (1 - collect) : 0;
  const offsetY = topCard ? (hitY - lowerY) * (1 - collect) : 0;
  const landingYaw = topCard ? -pose.yaw : -(pose.lowerYaw - 0.09);
  return {
    position: [
      lerp(lowerX, pile.x, collect) + Math.cos(flip) * offsetX + Math.sin(flip) * offsetZ,
      lerp(lowerY, pile.y, collect) + offsetY,
      lerp(match.z, pile.z, collect) +
        0.52 * Math.sin(Math.PI * collect) +
        Math.cos(flip) * offsetZ -
        Math.sin(flip) * offsetX,
    ],
    rotation: [0, Math.PI + flip, landingYaw * (1 - collect)],
  };
}
