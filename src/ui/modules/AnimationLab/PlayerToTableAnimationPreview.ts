import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import { createRoundedCardGraphic } from "@modules/AnimationLab/AnimationLabPrimitives";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import { Container, type Graphics } from "pixi.js";

const CARD_WIDTH = 96;
const CARD_HEIGHT = 132;
const CARD_RADIUS = 12;
const HAND_CARD_COUNT = 3;
const MAX_PLAYERS = 4;
const HAND_SPACING_FACTOR = 0.5;
const HAND_ARCH_DEPTH_FACTOR = 0.14;
const HAND_MIDDLE_ARCH_REDUCTION = 0.55;
const HAND_FAN_RADIANS = 0.12;

const ANIMATED_SIDE_INDEX = 2;
const ANIMATED_SOURCE_CARD_INDEX = 1;
const MOVE_TO_TABLE_FLIP_START = 0.36;

type Point = { x: number; y: number };

interface FlippableCard {
  back: Graphics;
  front: Graphics;
  container: Container;
}

export interface PlayerToTableAnimationPreviewInput {
  currentProgress: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface PlayerToTableAnimationPreviewController {
  hide: () => void;
  render: (input: PlayerToTableAnimationPreviewInput) => void;
}

const getSideUnitVector = (sideIndex: number): Point => {
  if (sideIndex === 0) {
    return { x: 0, y: -1 };
  }
  if (sideIndex === 1) {
    return { x: -1, y: 0 };
  }
  if (sideIndex === 2) {
    return { x: 0, y: 1 };
  }
  return { x: 1, y: 0 };
};

const getInwardCardRotation = (sideIndex: number): number => {
  if (sideIndex === 0) {
    return Math.PI;
  }
  if (sideIndex === 1) {
    return Math.PI / 2;
  }
  if (sideIndex === 3) {
    return -Math.PI / 2;
  }
  return 0;
};

const getPlayerSideOrder = (totalPlayersRaw: number | undefined): number[] => {
  const totalPlayers = clamp(Math.round(totalPlayersRaw ?? 4), 2, 4);
  if (totalPlayers === 2) {
    return [2, 0];
  }
  if (totalPlayers === 3) {
    return [2, 1, 3];
  }
  return [2, 1, 0, 3];
};

const getSeatAnchor = (sideIndex: number, layout: LayoutState): Point => {
  const horizontalOffset = Math.round(layout.preview.width * 0.34);
  const verticalOffset = Math.round(layout.preview.height * 0.34);

  if (sideIndex === 0) {
    return { x: 0, y: -verticalOffset };
  }
  if (sideIndex === 1) {
    return { x: -horizontalOffset, y: 0 };
  }
  if (sideIndex === 2) {
    return { x: 0, y: verticalOffset };
  }
  return { x: horizontalOffset, y: 0 };
};

const smoothstep = (value: number): number => {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

const lerp = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

const createFlippableCard = (): FlippableCard => {
  const container = new Container();
  const back = createRoundedCardGraphic(
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_RADIUS,
    0x1d4ed8,
    0x0f172a,
    0.48,
  );
  const front = createRoundedCardGraphic(
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_RADIUS,
    0xf8fafc,
    0x0f172a,
    0.42,
  );
  front.visible = false;
  container.visible = false;

  container.addChild(back);
  container.addChild(front);

  return {
    back,
    front,
    container,
  };
};

const applyFlipProgress = (
  card: FlippableCard,
  flipProgressRaw: number,
  cardScale: number,
): void => {
  const flipProgress = clamp(flipProgressRaw, 0, 1);
  if (flipProgress < 0.5) {
    card.back.visible = true;
    card.front.visible = false;
    card.container.scale.x = cardScale * Math.max(0.06, 1 - flipProgress * 2);
    return;
  }

  card.back.visible = false;
  card.front.visible = true;
  card.container.scale.x = cardScale * Math.max(0.06, (flipProgress - 0.5) * 2);
};

export const createPlayerToTableAnimationPreview = (
  world: Container,
): PlayerToTableAnimationPreviewController => {
  const handCards: Graphics[] = [];

  for (let index = 0; index < MAX_PLAYERS * HAND_CARD_COUNT; index += 1) {
    const handCard = createRoundedCardGraphic(
      CARD_WIDTH,
      CARD_HEIGHT,
      CARD_RADIUS,
      0x1d4ed8,
      0x0f172a,
      0.48,
    );
    handCard.visible = false;
    handCards.push(handCard);
    world.addChild(handCard);
  }

  const movingCard = createFlippableCard();
  world.addChild(movingCard.container);

  const hide = (): void => {
    for (const handCard of handCards) {
      handCard.visible = false;
    }
    movingCard.container.visible = false;
    movingCard.back.visible = true;
    movingCard.front.visible = false;
  };

  const render = (input: PlayerToTableAnimationPreviewInput): void => {
    const {
      currentProgress,
      sample,
      animationParams,
      layout,
      subjectBaseScale,
      normalizedScale,
    } = input;

    hide();

    const sideOrder = getPlayerSideOrder(animationParams.totalPlayers);
    const cardScale = subjectBaseScale * normalizedScale;
    const cardSpacing = CARD_WIDTH * cardScale * HAND_SPACING_FACTOR;
    const archDepth = CARD_HEIGHT * cardScale * HAND_ARCH_DEPTH_FACTOR;
    const animationProgress = smoothstep(currentProgress);

    let movingSource: { x: number; y: number; rotation: number } | null = null;

    let cardCursor = 0;
    for (const sideIndex of sideOrder) {
      const seatAnchor = getSeatAnchor(sideIndex, layout);
      const sideVector = getSideUnitVector(sideIndex);
      const inward = {
        x: -sideVector.x,
        y: -sideVector.y,
      };
      const tangent = {
        x: -inward.y,
        y: inward.x,
      };
      const baseRotation = sample.rotation + getInwardCardRotation(sideIndex);

      for (let cardIndex = 0; cardIndex < HAND_CARD_COUNT; cardIndex += 1) {
        const handCard = handCards[cardCursor];
        if (!handCard) {
          continue;
        }
        cardCursor += 1;

        const spreadOffset = cardIndex - (HAND_CARD_COUNT - 1) / 2;
        const archFactor =
          (1 - Math.abs(spreadOffset)) * HAND_MIDDLE_ARCH_REDUCTION;
        const cardX =
          sample.x +
          seatAnchor.x +
          tangent.x * spreadOffset * cardSpacing +
          inward.x * archDepth * archFactor;
        const cardY =
          sample.y +
          seatAnchor.y +
          tangent.y * spreadOffset * cardSpacing +
          inward.y * archDepth * archFactor;
        const cardRotation = baseRotation + spreadOffset * HAND_FAN_RADIANS;

        const isAnimatedSourceCard =
          sideIndex === ANIMATED_SIDE_INDEX &&
          cardIndex === ANIMATED_SOURCE_CARD_INDEX;

        if (isAnimatedSourceCard && animationProgress > 0) {
          movingSource = {
            x: cardX,
            y: cardY,
            rotation: cardRotation,
          };
          handCard.visible = false;
          continue;
        }

        handCard.visible = true;
        handCard.position.set(px(cardX), px(cardY));
        handCard.scale.set(cardScale);
        handCard.rotation = cardRotation;
        handCard.alpha = 0.98;
      }
    }

    if (!movingSource) {
      return;
    }

    const targetX = sample.x;
    const targetY = sample.y;
    const travelProgress = animationProgress;
    const flipProgress = clamp(
      (animationProgress - MOVE_TO_TABLE_FLIP_START) /
        Math.max(1 - MOVE_TO_TABLE_FLIP_START, 0.0001),
      0,
      1,
    );

    movingCard.container.visible = true;
    movingCard.container.position.set(
      px(lerp(movingSource.x, targetX, travelProgress)),
      px(lerp(movingSource.y, targetY, travelProgress)),
    );
    movingCard.container.scale.set(cardScale, cardScale);
    movingCard.container.rotation = lerp(
      movingSource.rotation,
      sample.rotation,
      travelProgress,
    );
    movingCard.container.alpha = 0.98;
    applyFlipProgress(movingCard, flipProgress, cardScale);

    if (animationProgress >= 1) {
      movingCard.back.visible = false;
      movingCard.front.visible = true;
      movingCard.container.scale.x = cardScale;
    }
  };

  return {
    hide,
    render,
  };
};
