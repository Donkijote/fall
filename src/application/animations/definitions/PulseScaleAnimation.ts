import type { AnimationDefinition } from "@application/animations/AnimationTypes";

const readParam = (
  params: Readonly<Record<string, number>>,
  key: string,
  fallback: number,
): number => {
  const value = params[key];
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return value;
};

const toScalePercent = (value: number): number => {
  // Backward compatibility: convert old 0..1 scale values to 0..100 percentages.
  if (value <= 2) {
    return value * 100;
  }

  return value;
};

export const pulseScaleAnimationDefinition: AnimationDefinition = {
  id: "pulse-scale",
  displayName: "Pulse Scale",
  description: "Breathing pulse with alpha drift.",
  parameters: [
    {
      key: "minScale",
      label: "Min scale (%)",
      min: 20,
      max: 100,
      step: 5,
      defaultValue: 40,
    },
    {
      key: "maxScale",
      label: "Max scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 60,
    },
  ],
  sample: ({ easedProgress, params }) => {
    const pulse = Math.sin(easedProgress * Math.PI);
    const minScale = toScalePercent(readParam(params, "minScale", 40));
    const maxScale = toScalePercent(readParam(params, "maxScale", 60));
    const span = Math.max(0, maxScale - minScale);

    return {
      x: 0,
      y: 0,
      scale: minScale + span * pulse,
      alpha: 0.72 + pulse * 0.28,
      rotation: Math.sin(easedProgress * Math.PI * 2) * 0.04,
    };
  },
};
