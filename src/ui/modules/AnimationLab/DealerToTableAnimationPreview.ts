import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import {
  createCard,
  createRoundedCardGraphic,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import { Container, type Graphics } from "pixi.js";

const CARD_BASE_WIDTH = 120;
const DECK_BASE_WIDTH = 96;
const DECK_BASE_HEIGHT = 132;
const DECK_CORNER_RADIUS = 12;
const DECK_RELATIVE_SCALE = 0.82;
const DECK_STACK_COUNT = 12;
const DECK_STACK_STEP = 2;
const DEALER_TO_TABLE_CENTER_PULL = 0.28;
const DEALER_TO_TABLE_LIFT_Y_OFFSET = 22;

const DEALER_TO_TABLE_MOVE_DURATION_MS = 320;
const DEALER_TO_TABLE_DEAL_CARD_DURATION_MS = 520;
const DEALER_TO_TABLE_CARD_COUNT = 4;
const DEALER_TO_TABLE_CENTER_CARD_SPACING_FACTOR = 0.58;

export const getDealerToTableCycleDurationMs = (): number => {
  return (
    DEALER_TO_TABLE_MOVE_DURATION_MS +
    DEALER_TO_TABLE_DEAL_CARD_DURATION_MS * DEALER_TO_TABLE_CARD_COUNT
  );
};

export const DEALER_TO_TABLE_DEFAULT_DURATION_MS =
  getDealerToTableCycleDurationMs();

type Point = { x: number; y: number };

interface FlippableCard {
  back: Graphics;
  front: Graphics;
  container: Container;
}

export interface DealerToTableAnimationPreviewInput {
  currentProgress: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface DealerToTableAnimationPreviewController {
  hide: () => void;
  render: (input: DealerToTableAnimationPreviewInput) => void;
}

const lerp = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

const smoothstep = (value: number): number => {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

const getDealerSideIndex = (dealerPositionRaw: number | undefined): number => {
  return clamp(Math.round(dealerPositionRaw ?? 2), 0, 3);
};

const getDealerRightDirection = (
  dealerPositionRaw: number | undefined,
): Point => {
  const positionIndex = getDealerSideIndex(dealerPositionRaw);
  if (positionIndex === 0) {
    return { x: -1, y: 0 };
  }
  if (positionIndex === 1) {
    return { x: 0, y: 1 };
  }
  if (positionIndex === 2) {
    return { x: 1, y: 0 };
  }
  return { x: 0, y: -1 };
};

const getInwardCardRotation = (
  dealerPositionRaw: number | undefined,
): number => {
  const dealerSideIndex = getDealerSideIndex(dealerPositionRaw);
  if (dealerSideIndex === 0) {
    return Math.PI;
  }
  if (dealerSideIndex === 1) {
    return Math.PI / 2;
  }
  if (dealerSideIndex === 3) {
    return -Math.PI / 2;
  }
  return 0;
};

const getTableCenterCardRotation = (
  dealerPositionRaw: number | undefined,
): number => {
  const dealerSideIndex = getDealerSideIndex(dealerPositionRaw);
  if (dealerSideIndex === 0) {
    return Math.PI;
  }
  if (dealerSideIndex === 1) {
    return Math.PI / 2;
  }
  if (dealerSideIndex === 3) {
    return -Math.PI / 2;
  }
  return 0;
};

const getTableSpreadDirection = (
  dealerPositionRaw: number | undefined,
): Point => {
  const dealerSideIndex = getDealerSideIndex(dealerPositionRaw);
  if (dealerSideIndex === 1 || dealerSideIndex === 3) {
    return { x: 0, y: 1 };
  }
  return { x: 1, y: 0 };
};

const createFlippableCard = (): FlippableCard => {
  const container = new Container();
  const back = createRoundedCardGraphic(
    DECK_BASE_WIDTH,
    DECK_BASE_HEIGHT,
    DECK_CORNER_RADIUS,
    0x1d4ed8,
    0x0f172a,
    0.48,
  );
  const front = createRoundedCardGraphic(
    DECK_BASE_WIDTH,
    DECK_BASE_HEIGHT,
    DECK_CORNER_RADIUS,
    0xf8fafc,
    0x0f172a,
    0.42,
  );
  front.visible = false;

  container.addChild(back);
  container.addChild(front);
  container.visible = false;

  return {
    back,
    front,
    container,
  };
};

const applyFlipProgress = (
  card: FlippableCard,
  flipProgressRaw: number,
): void => {
  const flipProgress = clamp(flipProgressRaw, 0, 1);
  if (flipProgress < 0.5) {
    card.back.visible = true;
    card.front.visible = false;
    card.container.scale.x = Math.max(0.06, 1 - flipProgress * 2);
    return;
  }

  card.back.visible = false;
  card.front.visible = true;
  card.container.scale.x = Math.max(0.06, (flipProgress - 0.5) * 2);
};

export const createDealerToTableAnimationPreview = (
  world: Container,
): DealerToTableAnimationPreviewController => {
  const deckStack = new Container();
  deckStack.visible = false;
  world.addChild(deckStack);

  const deckCards: Graphics[] = [];
  for (let index = 0; index < DECK_STACK_COUNT; index += 1) {
    const deckCard = createRoundedCardGraphic(
      DECK_BASE_WIDTH,
      DECK_BASE_HEIGHT,
      DECK_CORNER_RADIUS,
      0x1d4ed8,
      0x0f172a,
      0.48,
    );
    deckCards.push(deckCard);
    deckStack.addChild(deckCard);
  }

  const liftShadow = createCard(0x020617, 0.26);
  liftShadow.anchor.set(0.5);
  liftShadow.visible = false;
  world.addChild(liftShadow);

  const tableCards: FlippableCard[] = [];
  for (let index = 0; index < DEALER_TO_TABLE_CARD_COUNT; index += 1) {
    const tableCard = createFlippableCard();
    tableCards.push(tableCard);
    world.addChild(tableCard.container);
  }

  const hide = (): void => {
    deckStack.visible = false;
    liftShadow.visible = false;
    for (const tableCard of tableCards) {
      tableCard.container.visible = false;
      tableCard.container.scale.set(1, 1);
      tableCard.back.visible = true;
      tableCard.front.visible = false;
    }
  };

  const render = (input: DealerToTableAnimationPreviewInput): void => {
    const {
      currentProgress,
      sample,
      animationParams,
      subjectBaseScale,
      normalizedScale,
    } = input;

    const rightDirection = getDealerRightDirection(
      animationParams.dealerPosition,
    );
    const inwardCardRotation = getInwardCardRotation(
      animationParams.dealerPosition,
    );
    const tableCenterCardRotation = getTableCenterCardRotation(
      animationParams.dealerPosition,
    );
    const tableSpreadDirection = getTableSpreadDirection(
      animationParams.dealerPosition,
    );

    const gap = CARD_BASE_WIDTH * subjectBaseScale * normalizedScale * 0.95;
    const deckStartX = sample.x + rightDirection.x * gap;
    const deckStartY = sample.y + rightDirection.y * gap;
    const deckHoldX = lerp(deckStartX, sample.x, DEALER_TO_TABLE_CENTER_PULL);
    const deckHoldY = lerp(deckStartY, sample.y, DEALER_TO_TABLE_CENTER_PULL);

    const totalDurationMs = getDealerToTableCycleDurationMs();
    const movePhaseEnd = DEALER_TO_TABLE_MOVE_DURATION_MS / totalDurationMs;
    const moveProgress = smoothstep(
      clamp(currentProgress / Math.max(movePhaseEnd, 0.0001), 0, 1),
    );

    let deckCenterX = lerp(deckStartX, deckHoldX, moveProgress);
    let deckGroundY = lerp(deckStartY, deckHoldY, moveProgress);
    let liftProgress = moveProgress;

    if (currentProgress >= movePhaseEnd) {
      deckCenterX = deckHoldX;
      deckGroundY = deckHoldY;
      liftProgress = 1;
    }

    const deckCenterY =
      deckGroundY - DEALER_TO_TABLE_LIFT_Y_OFFSET * liftProgress;

    deckStack.visible = true;
    liftShadow.visible = true;
    deckStack.position.set(px(deckCenterX), px(deckCenterY));
    deckStack.scale.set(
      subjectBaseScale * normalizedScale * DECK_RELATIVE_SCALE,
    );
    deckStack.alpha = 0.98;
    deckStack.rotation = sample.rotation + inwardCardRotation;

    for (let index = 0; index < deckCards.length; index += 1) {
      const stackOffset = index * DECK_STACK_STEP;
      deckCards[index].position.set(
        px(-rightDirection.x * stackOffset),
        px(-rightDirection.y * stackOffset),
      );
    }

    const shadowBaseScale =
      subjectBaseScale * normalizedScale * DECK_RELATIVE_SCALE;
    liftShadow.position.set(px(deckCenterX), px(deckGroundY + 24));
    liftShadow.scale.set(
      shadowBaseScale * (1.08 - liftProgress * 0.28),
      shadowBaseScale * (0.2 - liftProgress * 0.06),
    );
    liftShadow.alpha = 0.3 - liftProgress * 0.12;

    const dealProgress = clamp(
      (currentProgress - movePhaseEnd) / Math.max(1 - movePhaseEnd, 0.0001),
      0,
      1,
    );

    const targetSpacing =
      DECK_BASE_WIDTH *
      subjectBaseScale *
      normalizedScale *
      DEALER_TO_TABLE_CENTER_CARD_SPACING_FACTOR;
    const segmentSize = 1 / DEALER_TO_TABLE_CARD_COUNT;

    let startedCardCount = 0;
    for (let index = 0; index < DEALER_TO_TABLE_CARD_COUNT; index += 1) {
      const segmentStart = index * segmentSize;
      const localProgress = clamp(
        (dealProgress - segmentStart) / segmentSize,
        0,
        1,
      );
      const tableCard = tableCards[index];

      if (localProgress <= 0) {
        tableCard.container.visible = false;
        continue;
      }

      startedCardCount += 1;
      tableCard.container.visible = true;

      const spreadOffset = (index - 1.5) * targetSpacing;
      const spreadOrtho = {
        x: -tableSpreadDirection.y,
        y: tableSpreadDirection.x,
      };
      const targetX =
        spreadOffset * tableSpreadDirection.x +
        spreadOffset * 0.16 * spreadOrtho.x;
      const targetY =
        spreadOffset * tableSpreadDirection.y +
        spreadOffset * 0.16 * spreadOrtho.y;
      const travelProgress = smoothstep(clamp(localProgress / 0.62, 0, 1));
      const flipProgress = clamp((localProgress - 0.42) / 0.58, 0, 1);

      tableCard.container.position.set(
        px(lerp(deckCenterX, targetX, travelProgress)),
        px(lerp(deckCenterY, targetY, travelProgress)),
      );
      tableCard.container.scale.y = subjectBaseScale * normalizedScale;
      const dealStartRotation = sample.rotation + inwardCardRotation;
      const tableRotationTarget =
        sample.rotation + tableCenterCardRotation + (index - 1.5) * 0.035;
      tableCard.container.rotation = lerp(
        dealStartRotation,
        tableRotationTarget,
        travelProgress,
      );
      applyFlipProgress(tableCard, flipProgress);

      if (localProgress >= 1) {
        tableCard.back.visible = false;
        tableCard.front.visible = true;
        tableCard.container.scale.x = 1;
      }
    }

    const remainingDeckCards = Math.max(0, DECK_STACK_COUNT - startedCardCount);
    for (let index = 0; index < deckCards.length; index += 1) {
      deckCards[index].visible = index < remainingDeckCards;
    }
  };

  return {
    hide,
    render,
  };
};
