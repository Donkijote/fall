import {
  type AnimationDefinition,
  type AnimationEasing,
  type AnimationParameterDefinition,
  type AnimationPlaybackSettings,
  type AnimationSampleInput,
  type AnimationTransformSample,
  animationEasingOptions,
} from "@application/animations/AnimationTypes";
import { animationDefinitions } from "@application/animations/definitions";

export {
  animationEasingOptions,
  type AnimationDefinition,
  type AnimationEasing,
  type AnimationParameterDefinition,
  type AnimationPlaybackSettings,
  type AnimationSampleInput,
  type AnimationTransformSample,
};

const MIN_DURATION_MS = 200;
const MAX_DURATION_MS = 6000;
const MIN_DELAY_MS = 0;
const MAX_DELAY_MS = 2000;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const ensureNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return value;
};

const toDefaultParameters = (
  parameters: ReadonlyArray<AnimationParameterDefinition>,
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const parameter of parameters) {
    result[parameter.key] = parameter.defaultValue;
  }
  return result;
};

const isAnimationEasing = (value: string): value is AnimationEasing => {
  return animationEasingOptions.includes(value as AnimationEasing);
};

export const listAnimationDefinitions =
  (): ReadonlyArray<AnimationDefinition> => {
    return animationDefinitions;
  };

export const getAnimationDefinitionById = (
  id: string,
): AnimationDefinition | null => {
  return (
    animationDefinitions.find((definition) => definition.id === id) ?? null
  );
};

export const createDefaultAnimationParameters = (
  definition: AnimationDefinition,
): Record<string, number> => {
  return toDefaultParameters(definition.parameters);
};

export const coerceAnimationParameters = (
  definition: AnimationDefinition,
  candidate: Readonly<Record<string, number>> | null | undefined,
): Record<string, number> => {
  const defaults = toDefaultParameters(definition.parameters);
  if (!candidate) {
    return defaults;
  }

  const result: Record<string, number> = {};
  for (const parameter of definition.parameters) {
    const rawValue = candidate[parameter.key];
    const fallback = defaults[parameter.key];
    result[parameter.key] = clamp(
      ensureNumber(rawValue, fallback),
      parameter.min,
      parameter.max,
    );
  }

  return result;
};

export const normalizeAnimationPlaybackSettings = (
  candidate: Partial<AnimationPlaybackSettings> | null | undefined,
): AnimationPlaybackSettings => {
  const durationMs = clamp(
    ensureNumber(candidate?.durationMs, 1200),
    MIN_DURATION_MS,
    MAX_DURATION_MS,
  );
  const delayMs = clamp(
    ensureNumber(candidate?.delayMs, 0),
    MIN_DELAY_MS,
    MAX_DELAY_MS,
  );
  const loop = typeof candidate?.loop === "boolean" ? candidate.loop : true;
  const rawEasing = candidate?.easing;
  const easing =
    rawEasing && isAnimationEasing(rawEasing) ? rawEasing : "easeInOutSine";

  return {
    durationMs,
    delayMs,
    loop,
    easing,
  };
};

export const applyAnimationEasing = (
  easing: AnimationEasing,
  progress: number,
): number => {
  const normalized = clamp(progress, 0, 1);
  switch (easing) {
    case "linear":
      return normalized;
    case "easeOutCubic": {
      const inverse = 1 - normalized;
      return 1 - inverse * inverse * inverse;
    }
    default:
      return -(Math.cos(Math.PI * normalized) - 1) / 2;
  }
};

export const getNextAnimationEasing = (
  easing: AnimationEasing,
): AnimationEasing => {
  const currentIndex = animationEasingOptions.indexOf(easing);
  const nextIndex = (currentIndex + 1) % animationEasingOptions.length;
  return animationEasingOptions[nextIndex];
};
