export interface TheFallPowerProfile {
  durationMs: number;
  startHeightFactor: number;
  impactOvershootFactor: number;
  bounceHeightFactor: number;
  shakeAmplitudeFactor: number;
  shakeCycles: number;
  rotationSwingRadians: number;
  impactRingScale: number;
  impactRingAlpha: number;
  impactFlashAlpha: number;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const THE_FALL_POWER_PROFILES: Record<number, TheFallPowerProfile> = {
  1: {
    durationMs: 1300,
    startHeightFactor: 0.5,
    impactOvershootFactor: 0.06,
    bounceHeightFactor: 0.18,
    shakeAmplitudeFactor: 0.014,
    shakeCycles: 2.4,
    rotationSwingRadians: 0.1,
    impactRingScale: 1.05,
    impactRingAlpha: 0.2,
    impactFlashAlpha: 0.18,
  },
  2: {
    durationMs: 1450,
    startHeightFactor: 0.58,
    impactOvershootFactor: 0.08,
    bounceHeightFactor: 0.2,
    shakeAmplitudeFactor: 0.02,
    shakeCycles: 3.2,
    rotationSwingRadians: 0.14,
    impactRingScale: 1.25,
    impactRingAlpha: 0.26,
    impactFlashAlpha: 0.24,
  },
  3: {
    durationMs: 1620,
    startHeightFactor: 0.66,
    impactOvershootFactor: 0.1,
    bounceHeightFactor: 0.24,
    shakeAmplitudeFactor: 0.028,
    shakeCycles: 4,
    rotationSwingRadians: 0.18,
    impactRingScale: 1.42,
    impactRingAlpha: 0.32,
    impactFlashAlpha: 0.3,
  },
  4: {
    durationMs: 1800,
    startHeightFactor: 0.76,
    impactOvershootFactor: 0.12,
    bounceHeightFactor: 0.28,
    shakeAmplitudeFactor: 0.036,
    shakeCycles: 4.9,
    rotationSwingRadians: 0.22,
    impactRingScale: 1.62,
    impactRingAlpha: 0.38,
    impactFlashAlpha: 0.36,
  },
};

export const getTheFallPowerLevel = (
  animationParams: Readonly<Record<string, number>>,
): number => {
  return clamp(Math.round(animationParams.power ?? 1), 1, 4);
};

export const getTheFallPowerProfile = (power: number): TheFallPowerProfile => {
  const level = clamp(Math.round(power), 1, 4);
  return THE_FALL_POWER_PROFILES[level] ?? THE_FALL_POWER_PROFILES[1];
};

export const getTheFallPowerProfileFromParams = (
  animationParams: Readonly<Record<string, number>>,
): TheFallPowerProfile => {
  return getTheFallPowerProfile(getTheFallPowerLevel(animationParams));
};
