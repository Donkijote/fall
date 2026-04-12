import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import {
  createCard,
  createRoundedCardGraphic,
} from "@modules/AnimationLab/AnimationLabPrimitives";
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

const PLAYER_CAPTURE_TO_TABLE_MS = 760;
const PLAYER_CAPTURE_LIFT_MS = 620;
const PLAYER_CAPTURE_TO_STACK_MS = 940;

const PLAYER_CAPTURE_PLAYED_REVEAL_END = 0.38;
const PLAYER_CAPTURE_STACK_LEFT_FACTOR = 2.15;
const PLAYER_CAPTURE_LIFT_Y_FACTOR = 0.22;
const PLAYER_CAPTURE_STACK_Y_FACTOR = 0.04;
const PLAYER_CAPTURE_FLIP_SHIFT_FACTOR = 0.34;
const PLAYER_CAPTURE_TILT_LEFT_RADIANS = -Math.PI / 6;
const PLAYER_CAPTURE_TO_TABLE_ARC_FACTOR = 0.2;
const PLAYER_CAPTURE_TO_STACK_ARC_FACTOR = 0.28;
const PLAYER_CAPTURE_UNDER_TABLE_RIGHT_OFFSET_FACTOR = 0.62;
const PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE = 0.72;
const PLAYER_CAPTURE_UNDER_TABLE_OFFSET_X_FACTOR = 0.2;
const PLAYER_CAPTURE_UNDER_TABLE_OFFSET_Y_FACTOR = 0.08;
const PLAYER_CAPTURE_FLIP_DELAY_IN_LIFT_PHASE = 0.8;

export const getPlayerCaptureCycleDurationMs = (): number => {
  return (
    PLAYER_CAPTURE_TO_TABLE_MS +
    PLAYER_CAPTURE_LIFT_MS +
    PLAYER_CAPTURE_TO_STACK_MS
  );
};

type Point = { x: number; y: number };

interface FlippableCard {
  back: Graphics;
  front: Graphics;
  container: Container;
}

export interface PlayerCaptureAnimationPreviewInput {
  currentProgress: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface PlayerCaptureAnimationPreviewController {
  hide: () => void;
  render: (input: PlayerCaptureAnimationPreviewInput) => void;
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

const easeOutCubic = (value: number): number => {
  const normalized = clamp(value, 0, 1);
  const inverse = 1 - normalized;
  return 1 - inverse * inverse * inverse;
};

const lerp = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

const lerpArcY = (
  from: number,
  to: number,
  progress: number,
  arcHeight: number,
): number => {
  const clampedProgress = clamp(progress, 0, 1);
  const base = lerp(from, to, clampedProgress);
  const arcOffset = 4 * arcHeight * clampedProgress * (1 - clampedProgress);
  return base - arcOffset;
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

const setFaceDown = (card: FlippableCard): void => {
  card.back.visible = true;
  card.front.visible = false;
};

const setFaceUp = (card: FlippableCard): void => {
  card.back.visible = false;
  card.front.visible = true;
};

const applyFlipFrontToBack = (
  card: FlippableCard,
  flipProgressRaw: number,
  cardScale: number,
): number => {
  const flipProgress = clamp(flipProgressRaw, 0, 1);
  const normalizedScaleX =
    flipProgress < 0.5
      ? Math.max(0.06, 1 - flipProgress * 2)
      : Math.max(0.06, (flipProgress - 0.5) * 2);
  if (flipProgress < 0.5) {
    setFaceUp(card);
  } else {
    setFaceDown(card);
  }
  card.container.scale.x = cardScale * normalizedScaleX;
  const shiftMagnitude =
    CARD_WIDTH *
    cardScale *
    PLAYER_CAPTURE_FLIP_SHIFT_FACTOR *
    (1 - normalizedScaleX);
  // Right-to-left flip direction.
  return -shiftMagnitude;
};

const applyFlipBackToFront = (
  card: FlippableCard,
  flipProgressRaw: number,
  cardScale: number,
): void => {
  const flipProgress = clamp(flipProgressRaw, 0, 1);
  if (flipProgress < 0.5) {
    setFaceDown(card);
    card.container.scale.x = cardScale * Math.max(0.06, 1 - flipProgress * 2);
    return;
  }

  setFaceUp(card);
  card.container.scale.x = cardScale * Math.max(0.06, (flipProgress - 0.5) * 2);
};

export const createPlayerCaptureAnimationPreview = (
  world: Container,
): PlayerCaptureAnimationPreviewController => {
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

  // Played card stays under the table card while capturing.
  const playedCard = createFlippableCard();
  world.addChild(playedCard.container);
  const tableCard = createFlippableCard();
  world.addChild(tableCard.container);
  const liftShadow = createCard(0x020617, 0.26);
  liftShadow.anchor.set(0.5);
  liftShadow.visible = false;
  world.addChild(liftShadow);

  const hide = (): void => {
    for (const handCard of handCards) {
      handCard.visible = false;
    }

    playedCard.container.visible = false;
    tableCard.container.visible = false;
    setFaceDown(playedCard);
    setFaceDown(tableCard);
    playedCard.container.scale.set(1, 1);
    tableCard.container.scale.set(1, 1);
    liftShadow.visible = false;
  };

  const render = (input: PlayerCaptureAnimationPreviewInput): void => {
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

    let playedSource: { x: number; y: number; rotation: number } | null = null;

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

        const isPlayedCard =
          sideIndex === ANIMATED_SIDE_INDEX &&
          cardIndex === ANIMATED_SOURCE_CARD_INDEX;

        if (isPlayedCard) {
          playedSource = {
            x: cardX,
            y: cardY,
            rotation: cardRotation,
          };
          if (currentProgress > 0) {
            handCard.visible = false;
            continue;
          }
        }

        handCard.visible = true;
        handCard.position.set(px(cardX), px(cardY));
        handCard.scale.set(cardScale);
        handCard.rotation = cardRotation;
        handCard.alpha = 0.98;
      }
    }

    if (!playedSource) {
      return;
    }

    const totalDurationMs = getPlayerCaptureCycleDurationMs();
    const phaseToTableEnd = PLAYER_CAPTURE_TO_TABLE_MS / totalDurationMs;
    const phaseLiftEnd =
      (PLAYER_CAPTURE_TO_TABLE_MS + PLAYER_CAPTURE_LIFT_MS) / totalDurationMs;
    const flipStartProgress =
      phaseToTableEnd +
      (phaseLiftEnd - phaseToTableEnd) *
        PLAYER_CAPTURE_FLIP_DELAY_IN_LIFT_PHASE;
    const captureFlipProgress = smoothstep(
      smoothstep(
        clamp(
          (currentProgress - flipStartProgress) /
            Math.max(1 - flipStartProgress, 0.0001),
          0,
          1,
        ),
      ),
    );

    const centerX = sample.x;
    const centerY = sample.y;
    const beneathCenterY = centerY + CARD_HEIGHT * cardScale * 0.03;
    const underTargetX =
      centerX +
      CARD_WIDTH * cardScale * PLAYER_CAPTURE_UNDER_TABLE_OFFSET_X_FACTOR;
    const underTargetY =
      centerY +
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_UNDER_TABLE_OFFSET_Y_FACTOR;
    const beneathRightX =
      centerX +
      CARD_WIDTH * cardScale * PLAYER_CAPTURE_UNDER_TABLE_RIGHT_OFFSET_FACTOR;
    const beneathRightY = underTargetY + CARD_HEIGHT * cardScale * 0.02;
    const liftOffsetY = CARD_HEIGHT * cardScale * PLAYER_CAPTURE_LIFT_Y_FACTOR;
    const captureTiltRotation =
      sample.rotation + PLAYER_CAPTURE_TILT_LEFT_RADIANS;
    const toTableArcHeight =
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_TO_TABLE_ARC_FACTOR;
    const toStackArcHeight =
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_TO_STACK_ARC_FACTOR;

    const playerAnchor = getSeatAnchor(ANIMATED_SIDE_INDEX, layout);
    const stackX =
      sample.x +
      playerAnchor.x -
      CARD_WIDTH * cardScale * PLAYER_CAPTURE_STACK_LEFT_FACTOR;
    const stackY =
      sample.y +
      playerAnchor.y -
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_STACK_Y_FACTOR;

    tableCard.container.visible = true;
    tableCard.container.position.set(px(centerX), px(centerY));
    tableCard.container.scale.set(cardScale, cardScale);
    tableCard.container.rotation = sample.rotation;
    tableCard.container.alpha = 0.98;
    setFaceUp(tableCard);

    if (currentProgress <= 0) {
      return;
    }

    playedCard.container.visible = true;
    playedCard.container.scale.set(cardScale, cardScale);
    playedCard.container.alpha = 0.98;
    setFaceDown(playedCard);

    if (currentProgress < phaseToTableEnd) {
      const phaseProgress = clamp(
        currentProgress / Math.max(phaseToTableEnd, 0.0001),
        0,
        1,
      );
      let movingX = centerX;
      let movingY = beneathCenterY;
      if (phaseProgress < PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE) {
        const approachProgress = smoothstep(
          clamp(
            phaseProgress /
              Math.max(PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE, 0.0001),
            0,
            1,
          ),
        );
        movingX = lerp(playedSource.x, beneathRightX, approachProgress);
        movingY = lerpArcY(
          playedSource.y,
          beneathRightY,
          approachProgress,
          toTableArcHeight,
        );
      } else {
        const slideProgress = clamp(
          (phaseProgress - PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE) /
            Math.max(1 - PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE, 0.0001),
          0,
          1,
        );
        movingX = lerp(beneathRightX, underTargetX, slideProgress);
        movingY = lerp(beneathRightY, underTargetY, slideProgress);
      }
      playedCard.container.position.set(px(movingX), px(movingY));
      playedCard.container.rotation = lerp(
        playedSource.rotation,
        sample.rotation,
        phaseProgress,
      );
      const revealProgress = clamp(
        phaseProgress / Math.max(PLAYER_CAPTURE_PLAYED_REVEAL_END, 0.0001),
        0,
        1,
      );
      applyFlipBackToFront(playedCard, revealProgress, cardScale);
      return;
    }

    if (currentProgress < phaseLiftEnd) {
      const phaseProgress = easeOutCubic(
        clamp(
          (currentProgress - phaseToTableEnd) /
            Math.max(phaseLiftEnd - phaseToTableEnd, 0.0001),
          0,
          1,
        ),
      );
      const liftedY = centerY - liftOffsetY * phaseProgress;
      const tableFlipShift = applyFlipFrontToBack(
        tableCard,
        captureFlipProgress,
        cardScale,
      );
      const playedFlipShift = applyFlipFrontToBack(
        playedCard,
        captureFlipProgress,
        cardScale,
      );

      playedCard.container.position.set(
        px(lerp(underTargetX, centerX, phaseProgress) + playedFlipShift),
        px(lerp(underTargetY, liftedY + 3, phaseProgress)),
      );
      playedCard.container.rotation = sample.rotation;
      playedCard.container.scale.y = cardScale;
      tableCard.container.position.set(
        px(centerX + tableFlipShift),
        px(liftedY),
      );
      tableCard.container.rotation = sample.rotation;
      tableCard.container.scale.y = cardScale;

      liftShadow.visible = true;
      liftShadow.position.set(
        px(centerX),
        px(liftedY + CARD_HEIGHT * cardScale * 0.72),
      );
      liftShadow.scale.set(
        cardScale * (1.25 - phaseProgress * 0.18),
        cardScale * (0.24 - phaseProgress * 0.05),
      );
      liftShadow.alpha = 0.28 - phaseProgress * 0.09;
      return;
    }

    const phaseProgress = smoothstep(
      clamp(
        (currentProgress - phaseLiftEnd) / Math.max(1 - phaseLiftEnd, 0.0001),
        0,
        1,
      ),
    );
    const startLiftedY = centerY - liftOffsetY;
    const tableFlipShift = applyFlipFrontToBack(
      tableCard,
      captureFlipProgress,
      cardScale,
    );
    const playedFlipShift = applyFlipFrontToBack(
      playedCard,
      captureFlipProgress,
      cardScale,
    );

    playedCard.container.position.set(
      px(lerp(centerX + playedFlipShift, stackX + 2, phaseProgress)),
      px(
        lerpArcY(startLiftedY + 3, stackY + 2, phaseProgress, toStackArcHeight),
      ),
    );
    playedCard.container.rotation = lerp(
      sample.rotation,
      captureTiltRotation,
      phaseProgress,
    );

    tableCard.container.position.set(
      px(lerp(centerX + tableFlipShift, stackX, phaseProgress)),
      px(lerpArcY(startLiftedY, stackY, phaseProgress, toStackArcHeight)),
    );
    tableCard.container.rotation = lerp(
      sample.rotation,
      captureTiltRotation,
      phaseProgress,
    );

    playedCard.container.scale.y = cardScale;
    tableCard.container.scale.y = cardScale;

    liftShadow.visible = true;
    liftShadow.position.set(
      px(lerp(centerX, stackX, phaseProgress)),
      px(
        lerpArcY(
          startLiftedY + CARD_HEIGHT * cardScale * 0.72,
          stackY + 18,
          phaseProgress,
          toStackArcHeight * 0.7,
        ),
      ),
    );
    liftShadow.scale.set(
      cardScale * (1.07 - phaseProgress * 0.1),
      cardScale * (0.18 - phaseProgress * 0.03),
    );
    liftShadow.alpha = 0.2 - phaseProgress * 0.08;

    if (phaseProgress >= 1) {
      setFaceDown(playedCard);
      setFaceDown(tableCard);
      playedCard.container.scale.set(cardScale, cardScale);
      tableCard.container.scale.set(cardScale, cardScale);
    }
  };

  return {
    hide,
    render,
  };
};
