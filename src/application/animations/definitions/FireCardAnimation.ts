import type { AnimationDefinition } from "@application/animations/AnimationTypes";

export const fireCardAnimationDefinition: AnimationDefinition = {
  id: "fire-card",
  displayName: "FireCard",
  description: "Card silhouette blended into the shared fire animation.",
  parameters: [],
  sample: () => ({
    x: 0,
    y: 0,
    scale: 100,
    alpha: 0.94,
    rotation: 0,
  }),
};
