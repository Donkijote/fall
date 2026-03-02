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

export const slideFadeAnimationDefinition: AnimationDefinition = {
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
    const distanceX = readParam(params, "distanceX", 160);
    const distanceY = readParam(params, "distanceY", 50);
    const startAlpha = readParam(params, "startAlpha", 0.2);

    return {
      x: -distanceX / 2 + distanceX * easedProgress,
      y: -Math.sin(easedProgress * Math.PI) * distanceY,
      scale: 0.92 + easedProgress * 0.08,
      alpha: startAlpha + (1 - startAlpha) * easedProgress,
      rotation: (easedProgress - 0.5) * 0.16,
    };
  },
};
