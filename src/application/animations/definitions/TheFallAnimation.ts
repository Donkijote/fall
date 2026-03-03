import type { AnimationDefinition } from "@application/animations/AnimationTypes";

export const theFallAnimationDefinition: AnimationDefinition = {
  id: "theFall",
  displayName: "The Fall",
  description:
    "High-impact fall animation with four power tiers that tune force and pacing.",
  parameters: [
    {
      key: "power",
      label: "Power",
      min: 1,
      max: 4,
      step: 1,
      defaultValue: 1,
      valueLabels: {
        1: "1 power",
        2: "2 power",
        3: "3 power",
        4: "4 power",
      },
    },
  ],
  sample: () => {
    return {
      x: 0,
      y: 0,
      scale: 100,
      alpha: 1,
      rotation: 0,
    };
  },
};
