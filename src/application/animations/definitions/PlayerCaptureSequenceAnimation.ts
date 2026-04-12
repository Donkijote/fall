import type { AnimationDefinition } from "@application/animations/AnimationTypes";

export const playerCaptureSequenceAnimationDefinition: AnimationDefinition = {
  id: "playerCaptureSequence",
  displayName: "Player Capture Sequence",
  description:
    "Capture multiple table cards in sequence, then collect full stack to player side.",
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
    {
      key: "tableCards",
      label: "Table cards",
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
