import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import {
  createCard,
  createRoundedCardGraphic,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import { createFireCardAnimationPreview } from "@modules/AnimationLab/FireCardAnimationPreview";
import { getTheFallPowerProfileFromParams } from "@modules/AnimationLab/TheFallPowerProfiles";
import { Container, Graphics } from "pixi.js";

const CARD_WIDTH = 96;
const CARD_HEIGHT = 132;
const CARD_RADIUS = 12;

const HAND_CARD_COUNT = 3;
const HAND_SPACING_FACTOR = 0.5;
const HAND_ARCH_DEPTH_FACTOR = 0.14;
const HAND_MIDDLE_ARCH_REDUCTION = 0.55;
const HAND_FAN_RADIANS = 0.12;
const SOURCE_CARD_INDEX = 1;

const REVEAL_RAISE_PHASE_END = 0.28;
const FALL_TO_TABLE_PHASE_END = 0.48;
const LIFT_PHASE_END = 0.68;
const FLIP_DELAY_IN_LIFT_PHASE = 0.8;
const POWER_TWO_SPLASH_WINDOW = 0.18;
const POWER_THREE_SPLASH_WINDOW = 0.28;
const POWER_THREE_LINGER_END = 0.72;
const POWER_THREE_LIFT_END = 0.91;
const POWER_FOUR_DISAPPEAR_END = 0.08;
const POWER_FOUR_FALL_END = 0.24;
const POWER_FOUR_LINGER_END = 0.76;
const POWER_FOUR_LIFT_END = 0.9;
const POWER_FOUR_SPLASH_WINDOW = 0.36;
const POWER_FOUR_SHAKE_END = 0.76;

const CAPTURE_STACK_LEFT_FACTOR = 2.15;
const CAPTURE_STACK_Y_FACTOR = 0.04;
const CAPTURE_LIFT_Y_FACTOR = 0.22;
const CAPTURE_FLIP_SHIFT_FACTOR = 0.34;
const CAPTURE_TILT_LEFT_RADIANS = -Math.PI / 6;
const CAPTURE_TO_STACK_ARC_FACTOR = 0.28;

interface TablePose {
  x: number;
  y: number;
  rotation: number;
}

interface FlippableCard {
  back: Graphics;
  front: Graphics;
  container: Container;
}

export interface TheFallAnimationPreviewInput {
  currentProgress: number;
  cycle: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface TheFallAnimationPreviewController {
  hide: () => void;
  render: (input: TheFallAnimationPreviewInput) => void;
}

export const getTheFallCycleDurationMs = (
  animationParams: Readonly<Record<string, number>>,
): number => {
  return getTheFallPowerProfileFromParams(animationParams).durationMs;
};

const randomBetween = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
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

const easeInCubic = (value: number): number => {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * normalized;
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

const createFaceDownCard = (): Graphics => {
  return createRoundedCardGraphic(
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_RADIUS,
    0x1d4ed8,
    0x0f172a,
    0.48,
  );
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
    CARD_WIDTH * cardScale * CAPTURE_FLIP_SHIFT_FACTOR * (1 - normalizedScaleX);
  return -shiftMagnitude;
};

export const createTheFallAnimationPreview = (
  world: Container,
): TheFallAnimationPreviewController => {
  const handCards: Graphics[] = [];
  for (let index = 0; index < HAND_CARD_COUNT; index += 1) {
    const handCard = createFaceDownCard();
    handCard.visible = false;
    handCards.push(handCard);
    world.addChild(handCard);
  }

  const tableCard = createFlippableCard();
  world.addChild(tableCard.container);
  const playedCard = createFlippableCard();
  world.addChild(playedCard.container);
  const fireCardLayer = new Container();
  world.addChild(fireCardLayer);
  const fireCardPreview = createFireCardAnimationPreview(fireCardLayer);
  const impactFlash = createCard(0x38bdf8, 0.22);
  impactFlash.anchor.set(0.5);
  impactFlash.visible = false;
  world.addChild(impactFlash);
  const impactRing = new Graphics();
  impactRing.visible = false;
  world.addChild(impactRing);
  const liftShadow = createCard(0x020617, 0.26);
  liftShadow.anchor.set(0.5);
  liftShadow.visible = false;
  world.addChild(liftShadow);

  let lastProgress = 0;
  let lastCycle = -1;
  let tablePose: TablePose | null = null;
  let meteorStartOffsetX = 0;

  const hide = (): void => {
    for (const handCard of handCards) {
      handCard.visible = false;
    }
    tableCard.container.visible = false;
    tableCard.container.scale.set(1, 1);
    setFaceUp(tableCard);

    playedCard.container.visible = false;
    playedCard.container.scale.set(1, 1);
    setFaceDown(playedCard);
    fireCardPreview.hide();

    impactFlash.visible = false;
    impactRing.visible = false;
    impactRing.clear();

    liftShadow.visible = false;
  };

  const generateTablePose = (
    sample: AnimationTransformSample,
    layout: LayoutState,
    cardScale: number,
    power: number,
  ): TablePose => {
    const powerBias = (power - 1) / 3;
    const spreadX = layout.preview.width * (0.16 + powerBias * 0.08);
    const spreadY = layout.preview.height * (0.1 + powerBias * 0.08);
    const centerYBias = -layout.preview.height * 0.05;

    return {
      x: sample.x + randomBetween(-spreadX, spreadX),
      y:
        sample.y +
        centerYBias +
        randomBetween(-spreadY, spreadY) -
        CARD_HEIGHT * cardScale * 0.05,
      rotation: randomBetween(-0.3, 0.3),
    };
  };

  const render = (input: TheFallAnimationPreviewInput): void => {
    const {
      currentProgress,
      cycle,
      sample,
      animationParams,
      layout,
      subjectBaseScale,
      normalizedScale,
    } = input;

    hide();

    const power = clamp(Math.round(animationParams.power ?? 1), 1, 4);
    const cardScale = subjectBaseScale * normalizedScale;

    const replayRestarted = currentProgress <= 0.001 && lastProgress > 0.98;
    const cycleChanged = cycle !== lastCycle;
    if (!tablePose || cycleChanged || replayRestarted) {
      tablePose = generateTablePose(sample, layout, cardScale, power);
      meteorStartOffsetX = randomBetween(
        -layout.preview.width * 0.14,
        layout.preview.width * 0.14,
      );
      lastCycle = cycle;
    }
    lastProgress = currentProgress;

    const baseFallEnd =
      power === 4 ? POWER_FOUR_FALL_END : FALL_TO_TABLE_PHASE_END;
    let shakeX = 0;
    let shakeY = 0;
    if (power === 4 && currentProgress >= baseFallEnd) {
      const shakeProgress = clamp(
        (currentProgress - baseFallEnd) /
          Math.max(POWER_FOUR_SHAKE_END - baseFallEnd, 0.0001),
        0,
        1,
      );
      const shakeAmplitude = layout.preview.width * 0.028 * (1 - shakeProgress);
      shakeX = Math.sin(shakeProgress * Math.PI * 42) * shakeAmplitude;
      shakeY = Math.cos(shakeProgress * Math.PI * 37) * shakeAmplitude * 0.6;
    }

    const handSeatY = sample.y + layout.preview.height * 0.34;
    const cardSpacing = CARD_WIDTH * cardScale * HAND_SPACING_FACTOR;
    const archDepth = CARD_HEIGHT * cardScale * HAND_ARCH_DEPTH_FACTOR;
    let sourceCardPose: {
      x: number;
      y: number;
      rotation: number;
    } | null = null;
    for (let cardIndex = 0; cardIndex < HAND_CARD_COUNT; cardIndex += 1) {
      const handCard = handCards[cardIndex];
      if (!handCard) {
        continue;
      }

      const spreadOffset = cardIndex - (HAND_CARD_COUNT - 1) / 2;
      const archFactor =
        (1 - Math.abs(spreadOffset)) * HAND_MIDDLE_ARCH_REDUCTION;
      const cardX = sample.x + spreadOffset * cardSpacing;
      const cardY = handSeatY - archDepth * archFactor;
      const cardRotation = spreadOffset * HAND_FAN_RADIANS;

      if (cardIndex === SOURCE_CARD_INDEX) {
        sourceCardPose = {
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
      handCard.position.set(px(cardX + shakeX), px(cardY + shakeY));
      handCard.scale.set(cardScale);
      handCard.rotation = cardRotation;
      handCard.alpha = 0.98;
    }

    if (!tablePose) {
      return;
    }
    tableCard.container.visible = true;
    tableCard.container.position.set(
      px(tablePose.x + shakeX),
      px(tablePose.y + shakeY),
    );
    tableCard.container.scale.set(cardScale, cardScale);
    tableCard.container.rotation = tablePose.rotation;
    tableCard.container.alpha = 0.98;
    setFaceUp(tableCard);

    if (power !== 1 && power !== 2 && power !== 3 && power !== 4) {
      return;
    }

    if (!sourceCardPose || currentProgress <= 0) {
      return;
    }

    const revealRaiseEnd =
      power === 4 ? POWER_FOUR_DISAPPEAR_END : REVEAL_RAISE_PHASE_END;
    const fallEnd = power === 4 ? POWER_FOUR_FALL_END : FALL_TO_TABLE_PHASE_END;
    const lingerEnd =
      power === 3
        ? POWER_THREE_LINGER_END
        : power === 4
          ? POWER_FOUR_LINGER_END
          : fallEnd;
    const liftEnd =
      power === 3
        ? POWER_THREE_LIFT_END
        : power === 4
          ? POWER_FOUR_LIFT_END
          : LIFT_PHASE_END;
    const flipStartProgress =
      lingerEnd + (liftEnd - lingerEnd) * FLIP_DELAY_IN_LIFT_PHASE;
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

    const raiseHeightFactor = power === 3 ? 0.68 : 0.3;
    const raiseTargetX = sample.x;
    const raiseTargetY = handSeatY - layout.preview.height * raiseHeightFactor;
    const raiseTargetRotation = -0.06;
    const raisedScale = cardScale * 1.2;

    const impactX = tablePose.x;
    const impactY = tablePose.y + CARD_HEIGHT * cardScale * 0.03;
    const impactRotation = tablePose.rotation + 0.02;
    const liftOffsetY = CARD_HEIGHT * cardScale * CAPTURE_LIFT_Y_FACTOR;
    const toStackArcHeight =
      CARD_HEIGHT * cardScale * CAPTURE_TO_STACK_ARC_FACTOR;

    const stackX =
      sample.x - CARD_WIDTH * cardScale * CAPTURE_STACK_LEFT_FACTOR;
    const stackY = handSeatY - CARD_HEIGHT * cardScale * CAPTURE_STACK_Y_FACTOR;
    const captureTiltRotation = sample.rotation + CAPTURE_TILT_LEFT_RADIANS;
    const splashWindow =
      power === 4
        ? POWER_FOUR_SPLASH_WINDOW
        : power === 3
          ? POWER_THREE_SPLASH_WINDOW
          : POWER_TWO_SPLASH_WINDOW;
    const splashProgress = clamp(
      (currentProgress - fallEnd) / splashWindow,
      0,
      1,
    );

    if ((power === 2 || power === 3 || power === 4) && splashProgress > 0) {
      const splashStrength = power === 4 ? 3.2 : power === 3 ? 1.55 : 1;
      const splashColor = power === 4 ? 0xef4444 : 0x38bdf8;
      const flashAlpha = 0.34 * splashStrength * (1 - splashProgress) ** 1.6;
      impactFlash.visible = flashAlpha > 0.004;
      impactFlash.tint = splashColor;
      impactFlash.position.set(
        px(impactX + shakeX),
        px(impactY + CARD_HEIGHT * cardScale * 0.24 + shakeY),
      );
      impactFlash.scale.set(
        cardScale * (1 + splashProgress * (1.45 + 0.55 * (splashStrength - 1))),
        cardScale *
          (0.22 + splashProgress * (0.42 + 0.18 * (splashStrength - 1))),
      );
      impactFlash.alpha = flashAlpha;

      const ringAlpha = 0.42 * splashStrength * (1 - splashProgress) ** 1.35;
      const ringRadius =
        CARD_WIDTH *
        cardScale *
        (0.24 + splashProgress * (1.72 + 0.9 * (splashStrength - 1)));
      impactRing.visible = ringAlpha > 0.004;
      impactRing.clear();
      impactRing.circle(0, 0, ringRadius).stroke({
        color: splashColor,
        width: Math.max(
          1,
          cardScale * 3.2 * splashStrength * (1 - splashProgress * 0.7),
        ),
        alpha: ringAlpha,
      });
      impactRing.position.set(
        px(impactX + shakeX),
        px(impactY + CARD_HEIGHT * cardScale * 0.24 + shakeY),
      );
    }

    // TODO: Reintroduce the power-4 crack effect here once the final crack UI asset/animation is ready.

    playedCard.container.visible = true;
    playedCard.container.alpha = 0.98;
    const sourceCard = handCards[SOURCE_CARD_INDEX];
    if (sourceCard && currentProgress < fallEnd) {
      const sourceLayer = world.getChildIndex(sourceCard);
      world.setChildIndex(playedCard.container, sourceLayer);
    } else {
      world.setChildIndex(playedCard.container, world.children.length - 1);
    }

    if (currentProgress < revealRaiseEnd) {
      if (power === 4) {
        const phaseProgress = easeInCubic(
          currentProgress / Math.max(revealRaiseEnd, 0.0001),
        );
        const exitY =
          sample.y + layout.preview.height * 0.62 + CARD_HEIGHT * cardScale;
        const cardX = lerp(sourceCardPose.x, sourceCardPose.x, phaseProgress);
        const cardY = lerp(sourceCardPose.y, exitY, phaseProgress);
        const cardRotation = lerp(
          sourceCardPose.rotation,
          sourceCardPose.rotation + 0.14,
          phaseProgress,
        );

        playedCard.container.visible = true;
        playedCard.container.position.set(
          px(cardX + shakeX),
          px(cardY + shakeY),
        );
        playedCard.container.scale.set(cardScale, cardScale);
        playedCard.container.rotation = cardRotation;
        setFaceDown(playedCard);
        return;
      }

      const phaseProgress = easeOutCubic(
        currentProgress / Math.max(revealRaiseEnd, 0.0001),
      );
      const cardX = lerp(sourceCardPose.x, raiseTargetX, phaseProgress);
      const cardY = lerp(sourceCardPose.y, raiseTargetY, phaseProgress);
      const cardRotation = lerp(
        sourceCardPose.rotation,
        raiseTargetRotation,
        phaseProgress,
      );
      const dynamicScale = lerp(cardScale, raisedScale, phaseProgress);

      playedCard.container.position.set(px(cardX + shakeX), px(cardY + shakeY));
      playedCard.container.scale.set(dynamicScale, dynamicScale);
      playedCard.container.rotation = cardRotation;

      const revealFlipProgress = clamp(phaseProgress / 0.72, 0, 1);
      applyFlipBackToFront(playedCard, revealFlipProgress, dynamicScale);
      return;
    }

    if (currentProgress < fallEnd) {
      if (power === 4) {
        const phaseProgress = easeInCubic(
          (currentProgress - revealRaiseEnd) /
            Math.max(fallEnd - revealRaiseEnd, 0.0001),
        );
        const meteorStartX = impactX + meteorStartOffsetX;
        const meteorStartY = sample.y - layout.preview.height * 0.86;
        const cardX = lerp(meteorStartX, impactX, phaseProgress);
        const cardY = lerp(meteorStartY, impactY, phaseProgress);
        const dynamicScale = lerp(
          cardScale * 1.36,
          cardScale * 1.02,
          phaseProgress,
        );

        fireCardPreview.render({
          currentProgress,
          cycle,
          sample: {
            x: cardX + shakeX,
            y: cardY + shakeY,
            scale: 100,
            alpha: 0.98,
            rotation: 0,
          },
          animationParams,
          layout,
          subjectBaseScale,
          normalizedScale: dynamicScale,
          cardOffsetY: 0,
          fireOffsetY: -8,
          fireScaleMultiplier: 0.719,
          renderFire: true,
        });
        return;
      }

      const phaseProgress = easeInCubic(
        (currentProgress - revealRaiseEnd) /
          Math.max(fallEnd - revealRaiseEnd, 0.0001),
      );
      const cardX = lerp(raiseTargetX, impactX, phaseProgress);
      const cardY = lerp(raiseTargetY, impactY, phaseProgress);
      const cardRotation = lerp(
        raiseTargetRotation,
        impactRotation,
        phaseProgress,
      );
      const dynamicScale = lerp(raisedScale, cardScale, phaseProgress);

      playedCard.container.position.set(px(cardX + shakeX), px(cardY + shakeY));
      playedCard.container.scale.set(dynamicScale, dynamicScale);
      playedCard.container.rotation = cardRotation;
      setFaceUp(playedCard);
      return;
    }

    if ((power === 3 || power === 4) && currentProgress < lingerEnd) {
      const lingerProgress = smoothstep(
        (currentProgress - fallEnd) / Math.max(lingerEnd - fallEnd, 0.0001),
      );
      const settleY = lerp(
        impactY + CARD_HEIGHT * cardScale * 0.015,
        impactY,
        lingerProgress,
      );

      tableCard.container.position.set(
        px(impactX + shakeX),
        px(settleY + shakeY),
      );
      tableCard.container.scale.set(cardScale, cardScale);
      tableCard.container.rotation = impactRotation;
      setFaceUp(tableCard);

      if (power === 4) {
        fireCardPreview.render({
          currentProgress,
          cycle,
          sample: {
            x: impactX + shakeX,
            y: settleY + 2 + shakeY,
            scale: 100,
            alpha: 0.98,
            rotation: 0,
          },
          animationParams,
          layout,
          subjectBaseScale,
          normalizedScale: cardScale,
          cardOffsetY: 0,
          fireOffsetY: -8,
          fireScaleMultiplier: 0.719,
          renderFire: false,
        });
      } else {
        playedCard.container.position.set(
          px(impactX + shakeX),
          px(settleY + 2 + shakeY),
        );
        playedCard.container.scale.set(cardScale, cardScale);
        playedCard.container.rotation = impactRotation;
        setFaceUp(playedCard);
      }
      return;
    }

    if (currentProgress < liftEnd) {
      const phaseProgress = easeOutCubic(
        (currentProgress - lingerEnd) / Math.max(liftEnd - lingerEnd, 0.0001),
      );
      const liftedY = impactY - liftOffsetY * phaseProgress;
      const movingRotation = lerp(
        impactRotation,
        sample.rotation,
        phaseProgress,
      );

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

      tableCard.container.position.set(
        px(impactX + tableFlipShift + shakeX),
        px(liftedY + shakeY),
      );
      tableCard.container.scale.y = cardScale;
      tableCard.container.rotation = movingRotation;

      playedCard.container.position.set(
        px(impactX + playedFlipShift + shakeX),
        px(liftedY + 3 + shakeY),
      );
      playedCard.container.scale.y = cardScale;
      playedCard.container.rotation = movingRotation;

      liftShadow.visible = true;
      liftShadow.position.set(
        px(impactX + shakeX),
        px(liftedY + CARD_HEIGHT * cardScale * 0.72 + shakeY),
      );
      liftShadow.scale.set(
        cardScale * (1.25 - phaseProgress * 0.18),
        cardScale * (0.24 - phaseProgress * 0.05),
      );
      liftShadow.alpha = 0.28 - phaseProgress * 0.09;
      return;
    }

    const phaseProgress = smoothstep(
      clamp((currentProgress - liftEnd) / Math.max(1 - liftEnd, 0.0001), 0, 1),
    );
    const startLiftedY = impactY - liftOffsetY;

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

    tableCard.container.position.set(
      px(lerp(impactX + tableFlipShift, stackX, phaseProgress) + shakeX),
      px(
        lerpArcY(startLiftedY, stackY, phaseProgress, toStackArcHeight) +
          shakeY,
      ),
    );
    tableCard.container.rotation = lerp(
      sample.rotation,
      captureTiltRotation,
      phaseProgress,
    );
    tableCard.container.scale.y = cardScale;

    playedCard.container.position.set(
      px(lerp(impactX + playedFlipShift, stackX + 2, phaseProgress) + shakeX),
      px(
        lerpArcY(
          startLiftedY + 3,
          stackY + 2,
          phaseProgress,
          toStackArcHeight,
        ) + shakeY,
      ),
    );
    playedCard.container.rotation = lerp(
      sample.rotation,
      captureTiltRotation,
      phaseProgress,
    );
    playedCard.container.scale.y = cardScale;

    liftShadow.visible = true;
    liftShadow.position.set(
      px(lerp(impactX, stackX, phaseProgress) + shakeX),
      px(
        lerpArcY(
          startLiftedY + CARD_HEIGHT * cardScale * 0.72,
          stackY + 18,
          phaseProgress,
          toStackArcHeight * 0.7,
        ) + shakeY,
      ),
    );
    liftShadow.scale.set(
      cardScale * (1.07 - phaseProgress * 0.1),
      cardScale * (0.18 - phaseProgress * 0.03),
    );
    liftShadow.alpha = 0.2 - phaseProgress * 0.08;

    if (phaseProgress >= 1) {
      setFaceDown(tableCard);
      setFaceDown(playedCard);
      tableCard.container.scale.set(cardScale, cardScale);
      playedCard.container.scale.set(cardScale, cardScale);
    }
  };

  return {
    hide,
    render,
  };
};
