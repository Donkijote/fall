export const animationEasingOptions = [
  "linear",
  "easeInOutSine",
  "easeOutCubic",
] as const;

export type AnimationEasing = (typeof animationEasingOptions)[number];

export interface AnimationPlaybackSettings {
  durationMs: number;
  delayMs: number;
  loop: boolean;
  easing: AnimationEasing;
}

export interface AnimationParameterDefinition {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface AnimationSampleInput {
  linearProgress: number;
  easedProgress: number;
  cycle: number;
  params: Readonly<Record<string, number>>;
}

export interface AnimationTransformSample {
  x: number;
  y: number;
  scale: number;
  alpha: number;
  rotation: number;
}

export interface AnimationDefinition {
  id: string;
  displayName: string;
  description: string;
  parameters: ReadonlyArray<AnimationParameterDefinition>;
  sample: (input: AnimationSampleInput) => AnimationTransformSample;
}

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

const animationDefinitions: ReadonlyArray<AnimationDefinition> = [
  {
    id: "pulse-scale",
    displayName: "Pulse Scale",
    description: "Breathing pulse with alpha drift.",
    parameters: [
      {
        key: "minScale",
        label: "Min scale",
        min: 0.3,
        max: 1.2,
        step: 0.05,
        defaultValue: 0.75,
      },
      {
        key: "maxScale",
        label: "Max scale",
        min: 0.6,
        max: 1.8,
        step: 0.05,
        defaultValue: 1.2,
      },
    ],
    sample: ({ easedProgress, params }) => {
      const pulse = Math.sin(easedProgress * Math.PI);
      const minScale = ensureNumber(params.minScale, 0.75);
      const maxScale = ensureNumber(params.maxScale, 1.2);
      const span = Math.max(0, maxScale - minScale);

      return {
        x: 0,
        y: 0,
        scale: minScale + span * pulse,
        alpha: 0.72 + pulse * 0.28,
        rotation: Math.sin(easedProgress * Math.PI * 2) * 0.04,
      };
    },
  },
  {
    id: "slide-fade",
    displayName: "Slide + Fade",
    description: "Lateral move with vertical bounce and fade-in.",
    parameters: [
      {
        key: "distanceX",
        label: "Distance X",
        min: 20,
        max: 280,
        step: 10,
        defaultValue: 160,
      },
      {
        key: "distanceY",
        label: "Distance Y",
        min: 0,
        max: 140,
        step: 5,
        defaultValue: 50,
      },
      {
        key: "startAlpha",
        label: "Start alpha",
        min: 0.05,
        max: 1,
        step: 0.05,
        defaultValue: 0.2,
      },
    ],
    sample: ({ easedProgress, params }) => {
      const distanceX = ensureNumber(params.distanceX, 160);
      const distanceY = ensureNumber(params.distanceY, 50);
      const startAlpha = ensureNumber(params.startAlpha, 0.2);

      return {
        x: -distanceX / 2 + distanceX * easedProgress,
        y: -Math.sin(easedProgress * Math.PI) * distanceY,
        scale: 0.92 + easedProgress * 0.08,
        alpha: startAlpha + (1 - startAlpha) * easedProgress,
        rotation: (easedProgress - 0.5) * 0.16,
      };
    },
  },
  {
    id: "orbit-wobble",
    displayName: "Orbit Wobble",
    description: "Circular orbit with wobble and gentle rotation.",
    parameters: [
      {
        key: "radius",
        label: "Radius",
        min: 20,
        max: 180,
        step: 5,
        defaultValue: 90,
      },
      {
        key: "wobble",
        label: "Wobble",
        min: 0,
        max: 80,
        step: 5,
        defaultValue: 24,
      },
      {
        key: "rotationAmplitude",
        label: "Rot amp",
        min: 0,
        max: 1.4,
        step: 0.05,
        defaultValue: 0.4,
      },
    ],
    sample: ({ easedProgress, cycle, params }) => {
      const radius = ensureNumber(params.radius, 90);
      const wobble = ensureNumber(params.wobble, 24);
      const rotationAmplitude = ensureNumber(params.rotationAmplitude, 0.4);
      const angle = (cycle + easedProgress) * Math.PI * 2;

      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius + Math.sin(angle * 2) * wobble,
        scale: 1 + Math.sin(angle * 2) * 0.1,
        alpha: 0.8 + Math.cos(angle) * 0.2,
        rotation: Math.sin(angle) * rotationAmplitude,
      };
    },
  },
];

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
