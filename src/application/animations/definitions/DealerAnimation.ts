import type { AnimationDefinition } from "@application/animations/AnimationTypes";

type DealerPosition = "top" | "left" | "bottom" | "right";

const DEALER_POSITIONS: ReadonlyArray<DealerPosition> = [
  "top",
  "left",
  "bottom",
  "right",
];

const getDealerPositionFromRawValue = (value: number): DealerPosition => {
  const roundedValue = Math.round(value);
  const normalizedValue = Math.max(
    0,
    Math.min(DEALER_POSITIONS.length - 1, roundedValue),
  );
  return DEALER_POSITIONS[normalizedValue];
};

export const dealerAnimationDefinition: AnimationDefinition = {
  id: "dealer",
  displayName: "Dealer",
  description: "Dealer card base pose for upcoming in-game dealing animation.",
  parameters: [
    {
      key: "dealerPosition",
      label: "Dealer position",
      min: 0,
      max: 3,
      step: 1,
      defaultValue: 2,
      valueLabels: {
        0: "Top",
        1: "Left",
        2: "Bottom",
        3: "Right",
      },
    },
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
  sample: ({ params, previewWidth, previewHeight }) => {
    const side = getDealerPositionFromRawValue(params.dealerPosition ?? 2);
    const sideOffset = Math.round(Math.min(previewWidth, previewHeight) * 0.34);
    let x = 0;
    let y = 0;

    if (side === "top") {
      y = -sideOffset;
    } else if (side === "left") {
      x = -sideOffset;
    } else if (side === "bottom") {
      y = sideOffset;
    } else {
      x = sideOffset;
    }

    return {
      x,
      y,
      scale: 100,
      alpha: 1,
      rotation: 0,
    };
  },
};
