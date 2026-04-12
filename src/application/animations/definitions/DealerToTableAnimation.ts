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

export const dealerToTableAnimationDefinition: AnimationDefinition = {
  id: "dealerToTable",
  displayName: "Dealer to Table",
  description:
    "Dealer base pose for table dealing: dealer seat and deck-at-right layout.",
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
  ],
  sample: ({ params, previewWidth, previewHeight }) => {
    const side = getDealerPositionFromRawValue(params.dealerPosition ?? 2);
    const horizontalOffset = Math.round(previewWidth * 0.34);
    const verticalOffset = Math.round(previewHeight * 0.34);
    let x = 0;
    let y = 0;

    if (side === "top") {
      y = -verticalOffset;
    } else if (side === "left") {
      x = -horizontalOffset;
    } else if (side === "bottom") {
      y = verticalOffset;
    } else {
      x = horizontalOffset;
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
