import type { AnimationDefinition } from "@application/animations/AnimationTypes";

export const playerCaptureAnimationDefinition: AnimationDefinition = {
  id: "playerCapture",
  displayName: "Player Capture",
  description:
    "Player captures table card: play one card, stack both, and collect on player side.",
  parameters: [
    {
      key: "totalPlayers",
      label: "Total players",
      min: 2,
      max: 4,
      step: 1,
      defaultValue: 4,
      valueLabels: {
        2: "2",
        3: "3",
        4: "4",
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
