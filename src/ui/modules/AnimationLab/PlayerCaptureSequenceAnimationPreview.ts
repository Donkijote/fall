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
const MAX_TABLE_CARDS = 4;

const HAND_SPACING_FACTOR = 0.5;
const HAND_ARCH_DEPTH_FACTOR = 0.14;
const HAND_MIDDLE_ARCH_REDUCTION = 0.55;
const HAND_FAN_RADIANS = 0.12;

const ANIMATED_SIDE_INDEX = 2;
const ANIMATED_SOURCE_CARD_INDEX = 1;

const PLAYER_CAPTURE_TO_FIRST_TABLE_MS = 760;
const PLAYER_CAPTURE_BETWEEN_TABLE_MS = 460;
const PLAYER_CAPTURE_FINAL_LIFT_MS = 620;
const PLAYER_CAPTURE_TO_STACK_MS = 940;

const PLAYER_CAPTURE_PLAYED_REVEAL_END = 0.38;
const PLAYER_CAPTURE_STACK_LEFT_FACTOR = 2.15;
const PLAYER_CAPTURE_STACK_Y_FACTOR = 0.04;
const PLAYER_CAPTURE_FLIP_SHIFT_FACTOR = 0.34;
const PLAYER_CAPTURE_TILT_LEFT_RADIANS = -Math.PI / 6;
const PLAYER_CAPTURE_UNDER_TABLE_RIGHT_OFFSET_FACTOR = 0.62;
const PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE = 0.72;
const PLAYER_CAPTURE_UNDER_TABLE_OFFSET_X_FACTOR = 0.2;
const PLAYER_CAPTURE_UNDER_TABLE_OFFSET_Y_FACTOR = 0.08;
const PLAYER_CAPTURE_LIFT_Y_FACTOR = 0.22;
const PLAYER_CAPTURE_FLIP_DELAY_IN_LIFT_PHASE = 0.8;
const PLAYER_CAPTURE_STACK_LAYER_OFFSET = 2;

const PLAYER_CAPTURE_TO_TABLE_ARC_FACTOR = 0.2;
const PLAYER_CAPTURE_BETWEEN_TABLE_ARC_FACTOR = 0.16;
const PLAYER_CAPTURE_TO_STACK_ARC_FACTOR = 0.28;

const TABLE_SCATTER_PRESETS: ReadonlyArray<{
  x: number;
  y: number;
  rotation: number;
}> = [
  { x: -0.92, y: -0.18, rotation: -0.26 },
  { x: 0.4, y: -0.54, rotation: 0.18 },
  { x: 0.96, y: 0.34, rotation: -0.1 },
  { x: -0.26, y: 0.66, rotation: 0.24 },
];

type Point = { x: number; y: number };

interface FlippableCard {
  back: Graphics;
  front: Graphics;
  container: Container;
}

interface CardPose {
  x: number;
  y: number;
  rotation: number;
}

export interface PlayerCaptureSequenceAnimationPreviewInput {
  currentProgress: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface PlayerCaptureSequenceAnimationPreviewController {
  hide: () => void;
  render: (input: PlayerCaptureSequenceAnimationPreviewInput) => void;
}

const getTableCardsCount = (
  animationParams: Readonly<Record<string, number>>,
): number => {
  return clamp(Math.round(animationParams.tableCards ?? 4), 2, MAX_TABLE_CARDS);
};

export const getPlayerCaptureSequenceCycleDurationMs = (
  animationParams: Readonly<Record<string, number>>,
): number => {
  const tableCards = getTableCardsCount(animationParams);
  const betweenTransitions = Math.max(0, tableCards - 1);
  return (
    PLAYER_CAPTURE_TO_FIRST_TABLE_MS +
    betweenTransitions * PLAYER_CAPTURE_BETWEEN_TABLE_MS +
    PLAYER_CAPTURE_FINAL_LIFT_MS +
    PLAYER_CAPTURE_TO_STACK_MS
  );
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
  return -shiftMagnitude;
};

const setMovingCapturedCards = (
  capturedCards: FlippableCard[],
  capturedCount: number,
  baseX: number,
  baseY: number,
  rotation: number,
  cardScale: number,
  flipProgressRaw: number | null,
): void => {
  const visibleCaptured = clamp(capturedCount, 0, capturedCards.length);
  for (let index = 0; index < capturedCards.length; index += 1) {
    const capturedCard = capturedCards[index];
    const isVisible = index < visibleCaptured;
    capturedCard.container.visible = isVisible;
    if (!isVisible) {
      continue;
    }

    const offset = (index + 1) * PLAYER_CAPTURE_STACK_LAYER_OFFSET;
    let flipShift = 0;
    if (flipProgressRaw === null) {
      setFaceUp(capturedCard);
      capturedCard.container.scale.set(cardScale, cardScale);
    } else {
      flipShift = applyFlipFrontToBack(
        capturedCard,
        flipProgressRaw,
        cardScale,
      );
      capturedCard.container.scale.y = cardScale;
    }

    capturedCard.container.position.set(
      px(baseX - offset + flipShift),
      px(baseY - offset),
    );
    capturedCard.container.rotation = rotation;
    capturedCard.container.alpha = 0.98;
  }
};

export const createPlayerCaptureSequenceAnimationPreview = (
  world: Container,
): PlayerCaptureSequenceAnimationPreviewController => {
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

  const movingLeadCard = createFlippableCard();
  world.addChild(movingLeadCard.container);
  const movingCapturedCards: FlippableCard[] = [];
  for (let index = 0; index < MAX_TABLE_CARDS; index += 1) {
    const movingCapturedCard = createFlippableCard();
    movingCapturedCards.push(movingCapturedCard);
    world.addChild(movingCapturedCard.container);
  }
  const tableCards: FlippableCard[] = [];
  for (let index = 0; index < MAX_TABLE_CARDS; index += 1) {
    const tableCard = createFlippableCard();
    tableCards.push(tableCard);
    world.addChild(tableCard.container);
  }

  const liftShadow = createCard(0x020617, 0.26);
  liftShadow.anchor.set(0.5);
  liftShadow.visible = false;
  world.addChild(liftShadow);

  const hide = (): void => {
    for (const handCard of handCards) {
      handCard.visible = false;
    }
    for (const tableCard of tableCards) {
      tableCard.container.visible = false;
      tableCard.container.scale.set(1, 1);
      setFaceUp(tableCard);
    }
    for (const capturedCard of movingCapturedCards) {
      capturedCard.container.visible = false;
      capturedCard.container.scale.set(1, 1);
      setFaceDown(capturedCard);
    }
    movingLeadCard.container.visible = false;
    movingLeadCard.container.scale.set(1, 1);
    setFaceDown(movingLeadCard);
    liftShadow.visible = false;
  };

  const bringLeadAboveAll = (): void => {
    world.setChildIndex(movingLeadCard.container, world.children.length - 1);
  };

  const placeLeadBelowStackAndTable = (): void => {
    const firstCaptured = movingCapturedCards[0];
    if (firstCaptured) {
      const capturedIndex = world.getChildIndex(firstCaptured.container);
      world.setChildIndex(
        movingLeadCard.container,
        Math.max(0, capturedIndex - 1),
      );
      return;
    }

    const firstTable = tableCards[0];
    if (firstTable) {
      const tableIndex = world.getChildIndex(firstTable.container);
      world.setChildIndex(
        movingLeadCard.container,
        Math.max(0, tableIndex - 1),
      );
    }
  };

  const render = (input: PlayerCaptureSequenceAnimationPreviewInput): void => {
    const {
      currentProgress,
      sample,
      animationParams,
      layout,
      subjectBaseScale,
      normalizedScale,
    } = input;

    hide();

    const tableCount = getTableCardsCount(animationParams);
    const sideOrder = getPlayerSideOrder(animationParams.totalPlayers);

    const cardScale = subjectBaseScale * normalizedScale;
    const cardSpacing = CARD_WIDTH * cardScale * HAND_SPACING_FACTOR;
    const archDepth = CARD_HEIGHT * cardScale * HAND_ARCH_DEPTH_FACTOR;

    let playedSource: CardPose | null = null;

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

    const tableSpreadX = CARD_WIDTH * cardScale * 1.02;
    const tableSpreadY = CARD_HEIGHT * cardScale * 0.92;
    const tableTargets: CardPose[] = [];
    for (let index = 0; index < tableCount; index += 1) {
      const preset = TABLE_SCATTER_PRESETS[index];
      tableTargets.push({
        x: sample.x + preset.x * tableSpreadX,
        y: sample.y + preset.y * tableSpreadY,
        rotation: sample.rotation + preset.rotation,
      });
    }

    const toFirstMs = PLAYER_CAPTURE_TO_FIRST_TABLE_MS;
    const betweenTransitions = Math.max(0, tableCount - 1);
    const betweenMs = betweenTransitions * PLAYER_CAPTURE_BETWEEN_TABLE_MS;
    const collectionMs = toFirstMs + betweenMs;
    const totalMs =
      collectionMs + PLAYER_CAPTURE_FINAL_LIFT_MS + PLAYER_CAPTURE_TO_STACK_MS;

    const phaseCollectionEnd = collectionMs / totalMs;
    const phaseLiftEnd =
      (collectionMs + PLAYER_CAPTURE_FINAL_LIFT_MS) / totalMs;
    const flipStartProgress =
      phaseCollectionEnd +
      (phaseLiftEnd - phaseCollectionEnd) *
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

    const underTargets: Point[] = tableTargets.map((target) => {
      return {
        x:
          target.x +
          CARD_WIDTH * cardScale * PLAYER_CAPTURE_UNDER_TABLE_OFFSET_X_FACTOR,
        y:
          target.y +
          CARD_HEIGHT * cardScale * PLAYER_CAPTURE_UNDER_TABLE_OFFSET_Y_FACTOR,
      };
    });

    const firstUnder = underTargets[0];
    const firstRight = {
      x:
        firstUnder.x +
        CARD_WIDTH * cardScale * PLAYER_CAPTURE_UNDER_TABLE_RIGHT_OFFSET_FACTOR,
      y: firstUnder.y + CARD_HEIGHT * cardScale * 0.02,
    };

    const centerLiftOffsetY =
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_LIFT_Y_FACTOR;
    const captureTiltRotation =
      sample.rotation + PLAYER_CAPTURE_TILT_LEFT_RADIANS;
    const toTableArcHeight =
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_TO_TABLE_ARC_FACTOR;
    const betweenArcHeight =
      CARD_HEIGHT * cardScale * PLAYER_CAPTURE_BETWEEN_TABLE_ARC_FACTOR;
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

    let completedTargets = 0;
    let movingX = playedSource.x;
    let movingY = playedSource.y;
    let movingRotation = playedSource.rotation;
    let leadAboveAll = false;

    if (currentProgress > 0) {
      if (currentProgress < phaseCollectionEnd) {
        const collectionProgress = clamp(
          currentProgress / Math.max(phaseCollectionEnd, 0.0001),
          0,
          1,
        );
        const elapsedMs = collectionProgress * collectionMs;

        if (elapsedMs < toFirstMs) {
          const phaseProgress = clamp(
            elapsedMs / Math.max(toFirstMs, 0.0001),
            0,
            1,
          );
          if (phaseProgress < PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE) {
            leadAboveAll = true;
            const approachProgress = smoothstep(
              clamp(
                phaseProgress /
                  Math.max(PLAYER_CAPTURE_UNDER_TABLE_RIGHT_PHASE, 0.0001),
                0,
                1,
              ),
            );
            movingX = lerp(playedSource.x, firstRight.x, approachProgress);
            movingY = lerpArcY(
              playedSource.y,
              firstRight.y,
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
            movingX = lerp(firstRight.x, firstUnder.x, slideProgress);
            movingY = lerp(firstRight.y, firstUnder.y, slideProgress);
          }
          movingRotation = lerp(
            playedSource.rotation,
            sample.rotation,
            phaseProgress,
          );
          completedTargets = phaseProgress >= 1 ? 1 : 0;
        } else if (tableCount > 1) {
          const betweenElapsed = elapsedMs - toFirstMs;
          const segmentIndex = Math.min(
            tableCount - 2,
            Math.floor(betweenElapsed / PLAYER_CAPTURE_BETWEEN_TABLE_MS),
          );
          const segmentStart = segmentIndex * PLAYER_CAPTURE_BETWEEN_TABLE_MS;
          const localProgress = clamp(
            (betweenElapsed - segmentStart) /
              Math.max(PLAYER_CAPTURE_BETWEEN_TABLE_MS, 0.0001),
            0,
            1,
          );

          const from = underTargets[segmentIndex];
          const to = underTargets[segmentIndex + 1];
          movingX = lerp(from.x, to.x, localProgress);
          movingY = lerpArcY(from.y, to.y, localProgress, betweenArcHeight);
          movingRotation = sample.rotation;

          completedTargets = clamp(
            1 + Math.floor(betweenElapsed / PLAYER_CAPTURE_BETWEEN_TABLE_MS),
            1,
            tableCount,
          );
        } else {
          movingX = firstUnder.x;
          movingY = firstUnder.y;
          movingRotation = sample.rotation;
          completedTargets = 1;
        }

        const revealProgress = clamp(
          collectionProgress /
            Math.max(PLAYER_CAPTURE_PLAYED_REVEAL_END, 0.0001),
          0,
          1,
        );
        movingLeadCard.container.visible = true;
        movingLeadCard.container.position.set(px(movingX), px(movingY));
        movingLeadCard.container.scale.set(cardScale, cardScale);
        movingLeadCard.container.rotation = movingRotation;
        movingLeadCard.container.alpha = 0.98;
        applyFlipBackToFront(movingLeadCard, revealProgress, cardScale);

        setMovingCapturedCards(
          movingCapturedCards,
          completedTargets,
          movingX,
          movingY,
          movingRotation,
          cardScale,
          null,
        );
      } else {
        completedTargets = tableCount;
        const lastUnder = underTargets[tableCount - 1];

        if (currentProgress < phaseLiftEnd) {
          const liftProgress = easeOutCubic(
            clamp(
              (currentProgress - phaseCollectionEnd) /
                Math.max(phaseLiftEnd - phaseCollectionEnd, 0.0001),
              0,
              1,
            ),
          );
          const liftedY = lastUnder.y - centerLiftOffsetY * liftProgress;

          movingX = lastUnder.x;
          movingY = liftedY;
          movingRotation = sample.rotation;

          const flipShift = applyFlipFrontToBack(
            movingLeadCard,
            captureFlipProgress,
            cardScale,
          );
          movingLeadCard.container.visible = true;
          movingLeadCard.container.position.set(
            px(movingX + flipShift),
            px(movingY + 3),
          );
          movingLeadCard.container.scale.y = cardScale;
          movingLeadCard.container.rotation = movingRotation;
          movingLeadCard.container.alpha = 0.98;

          setMovingCapturedCards(
            movingCapturedCards,
            tableCount,
            movingX,
            movingY,
            movingRotation,
            cardScale,
            captureFlipProgress,
          );

          liftShadow.visible = true;
          liftShadow.position.set(
            px(movingX),
            px(movingY + CARD_HEIGHT * cardScale * 0.72),
          );
          liftShadow.scale.set(
            cardScale * (1.25 - liftProgress * 0.18),
            cardScale * (0.24 - liftProgress * 0.05),
          );
          liftShadow.alpha = 0.28 - liftProgress * 0.09;
        } else {
          const moveProgress = smoothstep(
            clamp(
              (currentProgress - phaseLiftEnd) /
                Math.max(1 - phaseLiftEnd, 0.0001),
              0,
              1,
            ),
          );
          const startLiftedY = lastUnder.y - centerLiftOffsetY;
          movingX = lerp(lastUnder.x, stackX, moveProgress);
          movingY = lerpArcY(
            startLiftedY,
            stackY,
            moveProgress,
            toStackArcHeight,
          );
          movingRotation = lerp(
            sample.rotation,
            captureTiltRotation,
            moveProgress,
          );

          const flipShift = applyFlipFrontToBack(
            movingLeadCard,
            captureFlipProgress,
            cardScale,
          );
          movingLeadCard.container.visible = true;
          movingLeadCard.container.position.set(
            px(movingX + flipShift),
            px(movingY + 2),
          );
          movingLeadCard.container.scale.y = cardScale;
          movingLeadCard.container.rotation = movingRotation;
          movingLeadCard.container.alpha = 0.98;

          setMovingCapturedCards(
            movingCapturedCards,
            tableCount,
            movingX,
            movingY,
            movingRotation,
            cardScale,
            captureFlipProgress,
          );

          liftShadow.visible = true;
          liftShadow.position.set(
            px(lerp(lastUnder.x, stackX, moveProgress)),
            px(
              lerpArcY(
                startLiftedY + CARD_HEIGHT * cardScale * 0.72,
                stackY + 18,
                moveProgress,
                toStackArcHeight * 0.7,
              ),
            ),
          );
          liftShadow.scale.set(
            cardScale * (1.07 - moveProgress * 0.1),
            cardScale * (0.18 - moveProgress * 0.03),
          );
          liftShadow.alpha = 0.2 - moveProgress * 0.08;

          if (moveProgress >= 1) {
            setFaceDown(movingLeadCard);
            movingLeadCard.container.scale.set(cardScale, cardScale);
            for (let index = 0; index < tableCount; index += 1) {
              const capturedCard = movingCapturedCards[index];
              if (!capturedCard) {
                continue;
              }
              setFaceDown(capturedCard);
              capturedCard.container.scale.set(cardScale, cardScale);
            }
          }
        }
      }
    }

    if (leadAboveAll) {
      bringLeadAboveAll();
    } else {
      placeLeadBelowStackAndTable();
    }

    for (let index = 0; index < MAX_TABLE_CARDS; index += 1) {
      const tableCard = tableCards[index];
      const isInUse = index < tableCount;
      if (!isInUse) {
        tableCard.container.visible = false;
        continue;
      }

      const target = tableTargets[index];
      const captured = index < completedTargets;
      tableCard.container.visible = !captured;
      if (captured) {
        continue;
      }

      tableCard.container.position.set(px(target.x), px(target.y));
      tableCard.container.scale.set(cardScale, cardScale);
      tableCard.container.rotation = target.rotation;
      tableCard.container.alpha = 0.98;
      setFaceUp(tableCard);
    }
  };

  return {
    hide,
    render,
  };
};
