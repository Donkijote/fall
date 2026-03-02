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

export const pulseScaleAnimationDefinition: AnimationDefinition = {
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
    const minScale = readParam(params, "minScale", 0.75);
    const maxScale = readParam(params, "maxScale", 1.2);
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
