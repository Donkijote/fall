import type { CardDropEffect } from "./cardFlights";

type ImpactProfile = {
  height: number;
  fall: number;
  slap: number;
  jolt: number;
};

export const cardImpactProfiles = {
  plain: { height: 1.7, fall: 0.4, slap: 0.075, jolt: 0.04 },
  ice: { height: 1.76, fall: 0.38, slap: 0.067, jolt: 0.07 },
  heat: { height: 2.15, fall: 0.23, slap: 0.035, jolt: 0.15 },
  flame: { height: 2.61, fall: 0.2, slap: 0.034, jolt: 0.29 },
} satisfies Record<CardDropEffect, ImpactProfile>;

function ramp(seconds: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (seconds - start) / (end - start)));
}

function smooth(seconds: number, start: number, end: number) {
  const t = ramp(seconds, start, end);
  return t * t * (3 - 2 * t);
}

// Time is relative to first contact. Both scenes sample this motion and
// effect envelope, then place the cards in their own scene coordinates.
export const flameCooldownDuration = 2.2;

export function sampleCardImpact(effect: CardDropEffect, seconds: number, flameCoolFrom = 0.38) {
  const profile = cardImpactProfiles[effect];
  const fallTime = ramp(seconds, -profile.fall, 0);
  const slap = 1 - (1 - ramp(seconds, 0, profile.slap)) ** 3;
  const hot = effect === "heat";
  const flame = effect === "flame";
  const cooled = smooth(
    seconds,
    flame ? flameCoolFrom : 0.31,
    flame ? flameCoolFrom + flameCooldownDuration : 1.96,
  );
  const transfer = 1 - (1 - ramp(seconds, 0, 0.3)) ** 3;
  const fireLife = 1 - cooled;

  return {
    fall: fallTime ** 3,
    fallTime,
    slap,
    slide: 1 - (1 - ramp(seconds, 0, 0.08)) ** 3,
    jolt: Math.sin(Math.max(0, seconds) * 36) * (1 - smooth(seconds, 0.035, 0.59)) * profile.jolt,
    frost: effect === "ice" ? 1 - smooth(seconds, 0, 0.12) : 0,
    shards: effect === "ice" ? ramp(seconds, 0, 0.78) : 0,
    topHeat: hot || flame ? (1 - transfer * 0.31) * fireLife : 0,
    bottomHeat: hot || flame ? transfer * 0.93 * fireLife : 0,
    topScorch: flame ? (0.85 + transfer * 0.15) * fireLife : 0,
    bottomScorch: flame ? smooth(seconds, 0, 0.64) * fireLife : 0,
    heatWave: hot ? ramp(seconds, 0, 0.38) : 0,
    blast: flame ? 1 - (1 - ramp(seconds, 0, 0.94)) ** 2 : 0,
    burn: flame ? (1 - (1 - ramp(seconds, 0, 0.7)) ** 2) * fireLife : 0,
    fireLife: flame ? fireLife : 0,
    light: flame
      ? (22 *
          Math.sin(Math.PI * 0.5 * ramp(seconds, 0, 0.055)) *
          (1 - smooth(seconds, 0.055, 0.31)) +
          transfer * 3.2) *
        fireLife
      : hot
        ? transfer * 2.3 * fireLife
        : 0,
  };
}

export type CardImpactSample = ReturnType<typeof sampleCardImpact>;

export function cardLandingPose(effect: CardDropEffect, sample: CardImpactSample) {
  const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
  const tilt = sample.fallTime ** 2;
  return {
    x: lerp(0.41, 0.24, sample.fall) - 0.05 * sample.slap,
    y: lerp(0.19, 0.1, sample.fall),
    pitch: lerp(0.2, 0.07, tilt) * (1 - sample.slap),
    roll: lerp(-0.17, -0.035, tilt) * (1 - sample.slap),
    yaw: lerp(0.04, -0.12, tilt) - 0.02 * sample.slap,
    lowerX: lerp(
      -0.03,
      effect === "flame" ? -0.69 : effect === "heat" ? -0.49 : -0.075,
      sample.slide,
    ),
    lowerY: lerp(
      -0.06,
      effect === "flame" ? -0.3 : effect === "heat" ? -0.15 : -0.08,
      sample.slide,
    ),
    lowerYaw: lerp(0.09, effect === "flame" ? 0.28 : 0.06, sample.slide),
    tableShake: effect === "flame" ? sample.jolt : 0,
  };
}
