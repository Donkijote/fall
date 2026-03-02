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
import {
  createCard,
  createRoundedCardGraphic,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import {
  readAnimationLabStore,
  writeAnimationLabStore,
} from "@modules/AnimationLab/AnimationLabStorage";
import type {
  LayoutState,
  PersistedStore,
} from "@modules/AnimationLab/AnimationLabTypes";
import { clamp, px } from "@modules/AnimationLab/AnimationLabUtils";
import {
  createDealerAnimationPreview,
  DEALER_DEFAULT_DURATION_MS,
} from "@modules/AnimationLab/DealerAnimationPreview";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Text } from "pixi.js";

const FIXED_STEP_MS = 1000 / 60;
const CARD_BASE_WIDTH = 120;
const CARD_BASE_HEIGHT = 168;
const CARD_CORNER_RADIUS = 14;

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
  const dealerPreview = createDealerAnimationPreview(world);

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
    if (showDealerDeck) {
      invisibleDealSeatPositions = [
        ...dealerPreview.render({
          currentProgress,
          sample,
          animationParams,
          layout,
          subjectBaseScale,
          normalizedScale,
        }).seatPositions,
      ];
    } else {
      invisibleDealSeatPositions = [];
      dealerPreview.hide();
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
