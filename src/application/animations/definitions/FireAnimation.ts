import type { AnimationDefinition } from "@application/animations/AnimationTypes";

export const fireAnimationDefinition: AnimationDefinition = {
  id: "fire",
  displayName: "Fire",
  description: "Placeholder fire animation scene. Empty layout for now.",
  parameters: [],
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
