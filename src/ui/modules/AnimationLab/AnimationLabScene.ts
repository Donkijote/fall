import {
  type AnimationDefinition,
  type AnimationPlaybackSettings,
  applyAnimationEasing,
  coerceAnimationParameters,
  createDefaultAnimationParameters,
  getAnimationDefinitionById,
  listAnimationDefinitions,
  normalizeAnimationPlaybackSettings,
} from "@application/animations/AnimationRegistry";
import { renderAnimationLabControlsPanel } from "@modules/AnimationLab/AnimationLabControlsPanel";
import { getAnimationLabLayout } from "@modules/AnimationLab/AnimationLabLayout";
import { renderAnimationLabListPanel } from "@modules/AnimationLab/AnimationLabListPanel";
import { createCard } from "@modules/AnimationLab/AnimationLabPrimitives";
import {
  readAnimationLabStore,
  writeAnimationLabStore,
} from "@modules/AnimationLab/AnimationLabStorage";
import type {
  LayoutState,
  PersistedStore,
} from "@modules/AnimationLab/AnimationLabTypes";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Graphics, Text } from "pixi.js";

const FIXED_STEP_MS = 1000 / 60;
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
const DEALER_DEFAULT_DURATION_MS = 2600;
const DEALER_LIFT_Y_OFFSET = 22;

const lerp = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

const smoothstep = (value: number): number => {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
};

const createRoundedCardGraphic = (
  width: number,
  height: number,
  radius: number,
  fillColor: number,
  strokeColor: number,
  strokeAlpha: number,
): Graphics => {
  const graphic = new Graphics();
  graphic
    .roundRect(-width / 2, -height / 2, width, height, radius)
    .fill(fillColor);
  graphic.roundRect(-width / 2, -height / 2, width, height, radius).stroke({
    color: strokeColor,
    width: 3,
    alpha: strokeAlpha,
  });
  return graphic;
};

export const createAnimationLabScene = (
  width: number,
  height: number,
  context: SceneContext,
): AppScene => {
  const animationDefinitions = listAnimationDefinitions();
  const fallbackDefinition = animationDefinitions[0];
  if (!fallbackDefinition) {
    throw new Error("Animation registry is empty");
  }

  const root = new Container();

  const canPersist = import.meta.env.DEV;
  const persistedStore: PersistedStore = canPersist
    ? readAnimationLabStore()
    : {};

  const background = createCard(0x020617);
  root.addChild(background);

  const title = new Text({
    text: "Animation Lab (DEV)",
    style: {
      fill: 0xe2e8f0,
      fontSize: 24,
      fontWeight: "700",
    },
  });
  title.roundPixels = true;
  root.addChild(title);

  const subtitle = new Text({
    text: "Internal playground for deterministic animation tuning.",
    style: {
      fill: 0x94a3b8,
      fontSize: 13,
    },
  });
  subtitle.roundPixels = true;
  root.addChild(subtitle);

  const listPanel = createCard(0x0f172a, 0.94);
  root.addChild(listPanel);
  const previewPanel = createCard(0x111827, 0.98);
  root.addChild(previewPanel);
  const controlsPanel = createCard(0x0f172a, 0.94);
  root.addChild(controlsPanel);

  const listTitle = new Text({
    text: "Animations",
    style: {
      fill: 0xe2e8f0,
      fontSize: 15,
      fontWeight: "700",
    },
  });
  listTitle.roundPixels = true;
  root.addChild(listTitle);

  const controlsTitle = new Text({
    text: "Controls",
    style: {
      fill: 0xe2e8f0,
      fontSize: 15,
      fontWeight: "700",
    },
  });
  controlsTitle.roundPixels = true;
  root.addChild(controlsTitle);

  const listContent = new Container();
  root.addChild(listContent);
  const controlsContent = new Container();
  root.addChild(controlsContent);

  const world = new Container();
  root.addChild(world);

  const axisX = createCard(0x475569, 0.7);
  axisX.anchor.set(0.5);
  world.addChild(axisX);

  const axisY = createCard(0x475569, 0.7);
  axisY.anchor.set(0.5);
  world.addChild(axisY);

  const subjectShadow = createCard(0x020617, 0.3);
  subjectShadow.anchor.set(0.5);
  world.addChild(subjectShadow);

  const subject = createRoundedCardGraphic(
    CARD_BASE_WIDTH,
    CARD_BASE_HEIGHT,
    CARD_CORNER_RADIUS,
    0xf8fafc,
    0x1e293b,
    0.42,
  );
  world.addChild(subject);

  const dealerDeckStack = new Container();
  dealerDeckStack.visible = false;
  world.addChild(dealerDeckStack);
  const dealerDeckCards: Graphics[] = [];
  for (let index = 0; index < DECK_STACK_COUNT; index += 1) {
    const deckCard = createRoundedCardGraphic(
      DECK_BASE_WIDTH,
      DECK_BASE_HEIGHT,
      DECK_CORNER_RADIUS,
      0x1d4ed8,
      0x0f172a,
      0.48,
    );
    dealerDeckCards.push(deckCard);
    dealerDeckStack.addChild(deckCard);
  }
  const dealerLiftShadow = createCard(0x020617, 0.26);
  dealerLiftShadow.anchor.set(0.5);
  dealerLiftShadow.visible = false;
  world.addChild(dealerLiftShadow);
  const dealerDealCard = createRoundedCardGraphic(
    CARD_BASE_WIDTH,
    CARD_BASE_HEIGHT,
    CARD_CORNER_RADIUS,
    0xf8fafc,
    0x0f172a,
    0.4,
  );
  dealerDealCard.visible = false;
  world.addChild(dealerDealCard);

  const debugOverlay = new Text({
    text: "",
    style: {
      fill: 0xcbd5e1,
      fontSize: 12,
      lineHeight: 16,
      fontFamily: "Menlo, Monaco, monospace",
    },
  });
  root.addChild(debugOverlay);

  let layout: LayoutState = getAnimationLabLayout(width, height);
  let selectedDefinition: AnimationDefinition = fallbackDefinition;
  let playback: AnimationPlaybackSettings =
    normalizeAnimationPlaybackSettings(null);
  let animationParams = createDefaultAnimationParameters(fallbackDefinition);
  let fixedStepMode = true;
  let isPlaying = selectedDefinition.id !== "dealer";
  let elapsedMs = 0;
  let cycleCount = 0;
  let frameCount = 0;
  let fixedStepAccumulator = 0;
  let currentProgress = 0;
  let currentScalePercent = 100;
  let subjectBaseScale = 1;
  let subjectShadowBaseScaleX = 1;
  let subjectShadowBaseScaleY = 1;
  let invisibleDealSeatPositions: Array<{ x: number; y: number }> = [];

  const shouldAutoplayDefinition = (
    definition: AnimationDefinition,
  ): boolean => {
    return definition.id !== "dealer";
  };

  const getDealerSideIndex = (
    dealerPositionRaw: number | undefined,
  ): number => {
    return clamp(Math.round(dealerPositionRaw ?? 2), 0, 3);
  };

  const getSideUnitVector = (sideIndex: number): { x: number; y: number } => {
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
  ): { x: number; y: number } => {
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

  const getSideIndexFromUnitVector = (vector: {
    x: number;
    y: number;
  }): number => {
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

  const resetClock = (autoplay: boolean): void => {
    elapsedMs = 0;
    cycleCount = 0;
    frameCount = 0;
    fixedStepAccumulator = 0;
    currentProgress = 0;
    isPlaying = autoplay;
  };

  const persistSelection = (): void => {
    if (!canPersist) {
      return;
    }

    persistedStore[selectedDefinition.id] = {
      playback,
      params: animationParams,
      fixedStepMode,
    };
    writeAnimationLabStore(persistedStore);
  };

  const hydrateSelection = (definition: AnimationDefinition): void => {
    const persisted = persistedStore[definition.id];
    playback = normalizeAnimationPlaybackSettings(persisted?.playback);
    if (definition.id === "dealer" && !persisted?.playback) {
      playback = {
        ...playback,
        durationMs: DEALER_DEFAULT_DURATION_MS,
        loop: false,
      };
    }
    animationParams = coerceAnimationParameters(definition, persisted?.params);
    fixedStepMode =
      typeof persisted?.fixedStepMode === "boolean"
        ? persisted.fixedStepMode
        : true;
  };

  const resolveLinearProgress = (): number => {
    if (elapsedMs <= playback.delayMs) {
      return 0;
    }

    const relativeMs = elapsedMs - playback.delayMs;
    return clamp(relativeMs / playback.durationMs, 0, 1);
  };

  const applyCurrentSample = (): void => {
    currentProgress = resolveLinearProgress();
    const easedProgress = applyAnimationEasing(
      playback.easing,
      currentProgress,
    );
    const sample = selectedDefinition.sample({
      linearProgress: currentProgress,
      easedProgress,
      cycle: cycleCount,
      previewWidth: layout.preview.width,
      previewHeight: layout.preview.height,
      params: animationParams,
    });
    const normalizedScale = clamp(sample.scale / 100, 0.05, 2.5);
    currentScalePercent = sample.scale;

    subject.position.set(px(sample.x), px(sample.y));
    subject.scale.set(subjectBaseScale * normalizedScale);
    subject.alpha = clamp(sample.alpha, 0.05, 1);
    subject.rotation = sample.rotation;

    subjectShadow.position.set(px(sample.x), px(sample.y + 18));
    subjectShadow.scale.set(
      subjectShadowBaseScaleX * normalizedScale,
      subjectShadowBaseScaleY * normalizedScale,
    );
    subjectShadow.alpha = clamp(sample.alpha * 0.3, 0.08, 0.36);
    subjectShadow.rotation = sample.rotation * 0.15;

    const showDealerDeck = selectedDefinition.id === "dealer";
    subject.visible = !showDealerDeck;
    subjectShadow.visible = !showDealerDeck;
    dealerDeckStack.visible = showDealerDeck;
    dealerLiftShadow.visible = showDealerDeck;
    dealerDealCard.visible = false;
    if (showDealerDeck) {
      const dealerSideIndex = getDealerSideIndex(
        animationParams.dealerPosition,
      );
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

      const dealTargets: Array<{ x: number; y: number }> = [];
      for (const opponentSide of opponentSides) {
        const sideVector = getSideUnitVector(opponentSide);
        dealTargets.push({
          x: sideVector.x * seatOffset,
          y: sideVector.y * seatOffset,
        });
      }
      dealTargets.push({
        x:
          sample.x + leftDirection.x * gap * DEALER_OWN_CARD_LEFT_OFFSET_FACTOR,
        y:
          sample.y + leftDirection.y * gap * DEALER_OWN_CARD_LEFT_OFFSET_FACTOR,
      });

      const fullDealTargets: Array<{ x: number; y: number }> = [];
      for (let round = 0; round < DEALER_DEAL_ROUNDS; round += 1) {
        for (const target of dealTargets) {
          fullDealTargets.push(target);
        }
      }

      invisibleDealSeatPositions = [];
      for (const target of dealTargets) {
        invisibleDealSeatPositions.push(target);
      }

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

      dealerDeckStack.position.set(px(deckCenterX), px(deckCenterY));
      dealerDeckStack.scale.set(
        subjectBaseScale * normalizedScale * DECK_RELATIVE_SCALE,
      );
      dealerDeckStack.alpha = 0.98;
      dealerDeckStack.rotation = sample.rotation;

      for (let index = 0; index < dealerDeckCards.length; index += 1) {
        const stackOffset = index * DECK_STACK_STEP;
        dealerDeckCards[index].position.set(
          px(-rightDirection.x * stackOffset),
          px(-rightDirection.y * stackOffset),
        );
      }

      const shadowBaseScale =
        subjectBaseScale * normalizedScale * DECK_RELATIVE_SCALE;
      dealerLiftShadow.position.set(px(deckCenterX), px(deckGroundY + 24));
      dealerLiftShadow.scale.set(
        shadowBaseScale * (1.08 - liftProgress * 0.28),
        shadowBaseScale * (0.2 - liftProgress * 0.06),
      );
      dealerLiftShadow.alpha = 0.3 - liftProgress * 0.12;

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
        dealerDealCard.visible = true;
        dealerDealCard.position.set(
          px(lerp(deckCenterX, activeTarget.x, easedDealProgress)),
          px(lerp(deckCenterY, activeTarget.y, easedDealProgress)),
        );
        dealerDealCard.scale.set(subjectBaseScale * normalizedScale);
        dealerDealCard.rotation =
          sample.rotation +
          ((activeDealIndex % dealTargets.length) - 1.5) * 0.03;
        dealerDealCard.alpha = 0.96;
      }
    } else {
      invisibleDealSeatPositions = [];
      dealerLiftShadow.visible = false;
    }
  };

  const updateOverlay = (): void => {
    debugOverlay.text = [
      `Animation: ${selectedDefinition.displayName}`,
      `Frame: ${Math.floor(frameCount)}`,
      `Time: ${Math.round(elapsedMs)}ms`,
      `Progress: ${(currentProgress * 100).toFixed(1)}%`,
      `Scale: ${currentScalePercent.toFixed(1)}%`,
      `Deal targets: ${invisibleDealSeatPositions.length}`,
      `Mode: ${fixedStepMode ? "fixed-step (16.7ms)" : "real-time"}`,
      `Easing: ${playback.easing}`,
    ].join("\n");
  };

  const renderAnimationList = (): void => {
    renderAnimationLabListPanel(listContent, {
      animationDefinitions,
      selectedAnimationId: selectedDefinition.id,
      layout,
      onSelect: (animationId) => {
        setDefinitionById(animationId);
      },
    });
  };

  const renderControls = (): void => {
    renderAnimationLabControlsPanel(controlsContent, {
      layout,
      selectedDefinition,
      playback,
      fixedStepMode,
      isPlaying,
      animationParams,
      onPlaybackChange: (next) => {
        updatePlayback(next);
      },
      onFixedStepToggle: () => {
        fixedStepMode = !fixedStepMode;
        fixedStepAccumulator = 0;
        updateOverlay();
        renderControls();
        persistSelection();
      },
      onParameterAdjust: (key, delta) => {
        animationParams = coerceAnimationParameters(selectedDefinition, {
          ...animationParams,
          [key]: animationParams[key] + delta,
        });
        applyCurrentSample();
        updateOverlay();
        renderControls();
        persistSelection();
      },
      onPlayPause: () => {
        isPlaying = !isPlaying;
        renderControls();
      },
      onReplay: () => {
        resetClock(shouldAutoplayDefinition(selectedDefinition));
        applyCurrentSample();
        updateOverlay();
        renderControls();
      },
      onDefaults: () => {
        playback = normalizeAnimationPlaybackSettings(null);
        if (selectedDefinition.id === "dealer") {
          playback = {
            ...playback,
            durationMs: DEALER_DEFAULT_DURATION_MS,
            loop: false,
          };
        }
        animationParams = createDefaultAnimationParameters(selectedDefinition);
        fixedStepMode = true;
        resetClock(shouldAutoplayDefinition(selectedDefinition));
        applyCurrentSample();
        updateOverlay();
        renderControls();
        persistSelection();
      },
      onBackHome: () => {
        context.goTo("home");
      },
    });
  };

  const updatePlayback = (
    next: Partial<AnimationPlaybackSettings>,
    autoplay = isPlaying,
  ): void => {
    playback = normalizeAnimationPlaybackSettings({
      ...playback,
      ...next,
    });

    if (!playback.loop && elapsedMs >= playback.delayMs + playback.durationMs) {
      isPlaying = false;
    } else {
      isPlaying = autoplay;
    }

    applyCurrentSample();
    updateOverlay();
    renderControls();
    persistSelection();
  };

  const advanceClock = (stepMs: number): void => {
    const totalWindow = playback.delayMs + playback.durationMs;
    if (totalWindow <= 0) {
      return;
    }

    elapsedMs += stepMs;
    if (playback.loop) {
      while (elapsedMs >= totalWindow) {
        elapsedMs -= totalWindow;
        cycleCount += 1;
      }
      return;
    }

    if (elapsedMs >= totalWindow) {
      elapsedMs = totalWindow;
      isPlaying = false;
    }
  };

  const setDefinitionById = (definitionId: string): void => {
    const nextDefinition = getAnimationDefinitionById(definitionId);
    if (!nextDefinition) {
      return;
    }

    selectedDefinition = nextDefinition;
    hydrateSelection(nextDefinition);
    resetClock(shouldAutoplayDefinition(nextDefinition));
    applyCurrentSample();
    updateOverlay();
    renderAnimationList();
    renderControls();
    persistSelection();
  };

  const resize = (nextWidth: number, nextHeight: number): void => {
    layout = getAnimationLabLayout(nextWidth, nextHeight);

    background.width = px(nextWidth);
    background.height = px(nextHeight);

    title.position.set(16, 16);
    subtitle.position.set(16, 42);

    listPanel.position.set(layout.list.x, layout.list.y);
    listPanel.width = px(layout.list.width);
    listPanel.height = px(layout.list.height);

    previewPanel.position.set(layout.preview.x, layout.preview.y);
    previewPanel.width = px(layout.preview.width);
    previewPanel.height = px(layout.preview.height);

    controlsPanel.position.set(layout.controls.x, layout.controls.y);
    controlsPanel.width = px(layout.controls.width);
    controlsPanel.height = px(layout.controls.height);

    listTitle.position.set(layout.list.x + 12, layout.list.y + 14);
    controlsTitle.position.set(layout.controls.x + 12, layout.controls.y + 14);

    world.position.set(
      px(layout.preview.x + layout.preview.width / 2),
      px(layout.preview.y + layout.preview.height / 2),
    );
    axisX.width = Math.max(40, px(layout.preview.width - 40));
    axisX.height = 1;
    axisY.width = 1;
    axisY.height = Math.max(40, px(layout.preview.height - 40));

    const subjectSize = clamp(
      Math.min(layout.preview.width, layout.preview.height) * 0.3,
      82,
      168,
    );
    const subjectShadowTextureWidth = subjectShadow.texture.width || 1;
    const subjectShadowTextureHeight = subjectShadow.texture.height || 1;
    subjectBaseScale = subjectSize / CARD_BASE_HEIGHT;
    subjectShadowBaseScaleX = (subjectSize * 0.9) / subjectShadowTextureWidth;
    subjectShadowBaseScaleY = (subjectSize * 0.24) / subjectShadowTextureHeight;

    debugOverlay.position.set(layout.preview.x + 10, layout.preview.y + 10);

    renderAnimationList();
    renderControls();
    applyCurrentSample();
    updateOverlay();
  };

  hydrateSelection(selectedDefinition);
  resetClock(shouldAutoplayDefinition(selectedDefinition));
  resize(width, height);

  const update = (deltaTime: number): void => {
    if (!isPlaying) {
      updateOverlay();
      return;
    }

    const deltaMs = Math.max(0, (deltaTime * 1000) / 60);
    if (fixedStepMode) {
      fixedStepAccumulator += deltaMs;
      while (fixedStepAccumulator >= FIXED_STEP_MS) {
        fixedStepAccumulator -= FIXED_STEP_MS;
        advanceClock(FIXED_STEP_MS);
        frameCount += 1;
        if (!isPlaying) {
          break;
        }
      }
    } else {
      advanceClock(deltaMs);
      frameCount += deltaMs / FIXED_STEP_MS;
    }

    applyCurrentSample();
    updateOverlay();
  };

  return {
    container: root,
    update,
    resize,
    destroy: () => {
      root.destroy({ children: true });
    },
  };
};
