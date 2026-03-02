import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import {
  createCard,
  createRoundedCardGraphic,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import { Container, type Graphics } from "pixi.js";

const CARD_BASE_WIDTH = 120;
const CARD_BASE_HEIGHT = 168;
const CARD_CORNER_RADIUS = 14;
const DECK_BASE_WIDTH = 96;
const DECK_BASE_HEIGHT = 132;
const DECK_CORNER_RADIUS = 12;
const DECK_RELATIVE_SCALE = 0.82;
const DECK_STACK_COUNT = 12;
const DECK_STACK_STEP = 2;
const DEALER_DECK_CENTER_PULL = 0.28;
const DEALER_MOVE_PHASE = 0.18;
const DEALER_DEAL_PHASE = 0.68;
const DEALER_RETURN_PHASE = 1 - DEALER_MOVE_PHASE - DEALER_DEAL_PHASE;
const DEALER_OWN_CARD_LEFT_OFFSET_FACTOR = 0.7;
const DEALER_DEAL_ROUNDS = 3;
const DEALER_LIFT_Y_OFFSET = 22;

export const DEALER_DEFAULT_DURATION_MS = 2600;

type Point = { x: number; y: number };

export interface DealerAnimationPreviewInput {
  currentProgress: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface DealerAnimationPreviewOutput {
  seatPositions: ReadonlyArray<Point>;
}

export interface DealerAnimationPreviewController {
  hide: () => void;
  render: (input: DealerAnimationPreviewInput) => DealerAnimationPreviewOutput;
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

const getDealerRightDirection = (
  dealerPositionRaw: number | undefined,
): Point => {
  const positionIndex = getDealerSideIndex(dealerPositionRaw);
  // Dealer faces center: right side depends on seating side.
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

const getSideIndexFromUnitVector = (vector: Point): number => {
  if (vector.y < 0) {
    return 0;
  }
  if (vector.x < 0) {
    return 1;
  }
  if (vector.y > 0) {
    return 2;
  }
  return 3;
};

const getOpponentSidesByDealerRightOrder = (
  dealerSideIndex: number,
  dealerRightSideIndex: number,
  opponentsCount: number,
): number[] => {
  const result: number[] = [];
  let currentSideIndex = dealerRightSideIndex;
  while (result.length < opponentsCount) {
    if (currentSideIndex !== dealerSideIndex) {
      result.push(currentSideIndex);
    }
    currentSideIndex = (currentSideIndex + 1) % 4;
  }
  return result;
};

export const createDealerAnimationPreview = (
  world: Container,
): DealerAnimationPreviewController => {
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

  const dealCard = createRoundedCardGraphic(
    CARD_BASE_WIDTH,
    CARD_BASE_HEIGHT,
    CARD_CORNER_RADIUS,
    0xf8fafc,
    0x0f172a,
    0.4,
  );
  dealCard.visible = false;
  world.addChild(dealCard);

  let seatPositions: Point[] = [];

  const hide = (): void => {
    deckStack.visible = false;
    liftShadow.visible = false;
    dealCard.visible = false;
    seatPositions = [];
  };

  const render = (
    input: DealerAnimationPreviewInput,
  ): DealerAnimationPreviewOutput => {
    const {
      currentProgress,
      sample,
      animationParams,
      layout,
      subjectBaseScale,
      normalizedScale,
    } = input;

    const dealerSideIndex = getDealerSideIndex(animationParams.dealerPosition);
    const rightDirection = getDealerRightDirection(
      animationParams.dealerPosition,
    );
    const leftDirection = {
      x: -rightDirection.x,
      y: -rightDirection.y,
    };
    const dealerRightSideIndex = getSideIndexFromUnitVector(rightDirection);

    const gap = CARD_BASE_WIDTH * subjectBaseScale * normalizedScale * 0.95;
    const deckStartX = sample.x + rightDirection.x * gap;
    const deckStartY = sample.y + rightDirection.y * gap;
    const deckHoldX = lerp(deckStartX, sample.x, DEALER_DECK_CENTER_PULL);
    const deckHoldY = lerp(deckStartY, sample.y, DEALER_DECK_CENTER_PULL);
    const moveProgress = smoothstep(currentProgress / DEALER_MOVE_PHASE);

    const seatOffset = Math.max(
      Math.abs(sample.x),
      Math.abs(sample.y),
      Math.min(layout.preview.width, layout.preview.height) * 0.34,
    );
    const totalPlayers = clamp(
      Math.round(animationParams.totalPlayers ?? 4),
      2,
      4,
    );
    const opponentsCount = totalPlayers - 1;
    const opponentSides = getOpponentSidesByDealerRightOrder(
      dealerSideIndex,
      dealerRightSideIndex,
      opponentsCount,
    );

    const dealTargets: Point[] = [];
    for (const opponentSide of opponentSides) {
      const sideVector = getSideUnitVector(opponentSide);
      dealTargets.push({
        x: sideVector.x * seatOffset,
        y: sideVector.y * seatOffset,
      });
    }
    dealTargets.push({
      x: sample.x + leftDirection.x * gap * DEALER_OWN_CARD_LEFT_OFFSET_FACTOR,
      y: sample.y + leftDirection.y * gap * DEALER_OWN_CARD_LEFT_OFFSET_FACTOR,
    });

    const fullDealTargets: Point[] = [];
    for (let round = 0; round < DEALER_DEAL_ROUNDS; round += 1) {
      for (const target of dealTargets) {
        fullDealTargets.push(target);
      }
    }

    seatPositions = [...dealTargets];

    const dealProgress = clamp(
      (currentProgress - DEALER_MOVE_PHASE) / DEALER_DEAL_PHASE,
      0,
      1,
    );
    const returnPhaseStart = DEALER_MOVE_PHASE + DEALER_DEAL_PHASE;
    const returnProgress = clamp(
      (currentProgress - returnPhaseStart) / DEALER_RETURN_PHASE,
      0,
      1,
    );

    let deckCenterX = lerp(deckStartX, deckHoldX, moveProgress);
    let deckGroundY = lerp(deckStartY, deckHoldY, moveProgress);
    let liftProgress = moveProgress;

    if (currentProgress >= DEALER_MOVE_PHASE) {
      deckCenterX = deckHoldX;
      deckGroundY = deckHoldY;
      liftProgress = 1;
    }

    if (currentProgress >= returnPhaseStart) {
      const easedReturnProgress = smoothstep(returnProgress);
      deckCenterX = lerp(deckHoldX, deckStartX, easedReturnProgress);
      deckGroundY = lerp(deckHoldY, deckStartY, easedReturnProgress);
      liftProgress = 1 - easedReturnProgress;
    }

    const deckCenterY = deckGroundY - DEALER_LIFT_Y_OFFSET * liftProgress;

    deckStack.visible = true;
    liftShadow.visible = true;
    dealCard.visible = false;

    deckStack.position.set(px(deckCenterX), px(deckCenterY));
    deckStack.scale.set(
      subjectBaseScale * normalizedScale * DECK_RELATIVE_SCALE,
    );
    deckStack.alpha = 0.98;
    deckStack.rotation = sample.rotation;

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

    if (
      currentProgress >= DEALER_MOVE_PHASE &&
      currentProgress < returnPhaseStart &&
      dealProgress > 0 &&
      fullDealTargets.length > 0
    ) {
      const segmentSize = 1 / fullDealTargets.length;
      const activeDealIndex = Math.min(
        fullDealTargets.length - 1,
        Math.floor(dealProgress / segmentSize),
      );
      const segmentStart = activeDealIndex * segmentSize;
      const localDealProgress = clamp(
        (dealProgress - segmentStart) / segmentSize,
        0,
        1,
      );
      const easedDealProgress = smoothstep(localDealProgress);
      const activeTarget = fullDealTargets[activeDealIndex];

      dealCard.visible = true;
      dealCard.position.set(
        px(lerp(deckCenterX, activeTarget.x, easedDealProgress)),
        px(lerp(deckCenterY, activeTarget.y, easedDealProgress)),
      );
      dealCard.scale.set(subjectBaseScale * normalizedScale);
      dealCard.rotation =
        sample.rotation + ((activeDealIndex % dealTargets.length) - 1.5) * 0.03;
      dealCard.alpha = 0.96;
    }

    return {
      seatPositions,
    };
  };

  return {
    hide,
    render,
  };
};
