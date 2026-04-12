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

export const orbitWobbleAnimationDefinition: AnimationDefinition = {
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
    const radius = readParam(params, "radius", 90);
    const wobble = readParam(params, "wobble", 24);
    const rotationAmplitude = readParam(params, "rotationAmplitude", 0.4);
    const angle = (cycle + easedProgress) * Math.PI * 2;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius + Math.sin(angle * 2) * wobble,
      scale: 40 + Math.sin(angle * 2) * 15,
      alpha: 0.8 + Math.cos(angle) * 0.2,
      rotation: Math.sin(angle) * rotationAmplitude,
    };
  },
};
