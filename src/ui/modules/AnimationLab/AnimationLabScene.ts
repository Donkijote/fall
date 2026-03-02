import {
  type AnimationDefinition,
  type AnimationPlaybackSettings,
  applyAnimationEasing,
  coerceAnimationParameters,
  createDefaultAnimationParameters,
  getAnimationDefinitionById,
  getNextAnimationEasing,
  listAnimationDefinitions,
  normalizeAnimationPlaybackSettings,
} from "@application/animations/AnimationRegistry";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Sprite, Text, Texture } from "pixi.js";

interface PanelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutState {
  list: PanelRect;
  preview: PanelRect;
  controls: PanelRect;
}

interface PersistedLabState {
  playback?: Partial<AnimationPlaybackSettings>;
  params?: Record<string, number>;
  fixedStepMode?: boolean;
}

type PersistedStore = Record<string, PersistedLabState>;

const STORAGE_KEY = "fall.animation-lab.v1";
const FIXED_STEP_MS = 1000 / 60;
const TITLE_HEIGHT = 64;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const px = (value: number): number => {
  return Math.round(value);
};

const formatControlValue = (value: number, step: number): string => {
  if (step >= 1) {
    return String(Math.round(value));
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
};

const createCard = (tint: number, alpha = 1): Sprite => {
  const card = new Sprite(Texture.WHITE);
  card.tint = tint;
  card.alpha = alpha;
  return card;
};

const clearContainer = (container: Container): void => {
  const children = container.removeChildren();
  for (const child of children) {
    child.destroy({ children: true });
  }
};

const readPersistedStore = (): PersistedStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as PersistedStore;
  } catch {
    return {};
  }
};

const writePersistedStore = (store: PersistedStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota or private-mode failures in dev tools.
  }
};

const createInteractiveButton = (
  labelText: string,
  onTap: () => void,
  width: number,
  height: number,
): Container => {
  const button = new Container();
  button.eventMode = "static";
  button.cursor = "pointer";

  const body = createCard(0x334155);
  body.width = width;
  body.height = height;
  body.anchor.set(0.5);
  button.addChild(body);

  const label = new Text({
    text: labelText,
    style: {
      fill: 0xf8fafc,
      fontSize: 13,
      fontWeight: "700",
    },
  });
  label.anchor.set(0.5);
  label.roundPixels = true;
  button.addChild(label);

  button.on("pointertap", onTap);

  return button;
};

const getLayout = (width: number, height: number): LayoutState => {
  const padding = 16;
  const top = TITLE_HEIGHT;
  const desktopListWidth = clamp(width * 0.22, 220, 300);
  const desktopControlsWidth = clamp(width * 0.3, 280, 380);
  const desktopPreviewWidth =
    width - desktopListWidth - desktopControlsWidth - padding * 4;

  if (desktopPreviewWidth >= 260 && height >= 560) {
    const panelHeight = height - top - padding;
    return {
      list: {
        x: padding,
        y: top,
        width: desktopListWidth,
        height: panelHeight,
      },
      preview: {
        x: padding * 2 + desktopListWidth,
        y: top,
        width: desktopPreviewWidth,
        height: panelHeight,
      },
      controls: {
        x: width - desktopControlsWidth - padding,
        y: top,
        width: desktopControlsWidth,
        height: panelHeight,
      },
    };
  }

  const compactWidth = width - padding * 2;
  const availableHeight = height - top - padding * 2;
  const listHeight = clamp(availableHeight * 0.22, 120, 170);
  let controlsHeight = clamp(availableHeight * 0.4, 250, 340);
  let previewHeight =
    availableHeight - listHeight - controlsHeight - padding * 2;

  if (previewHeight < 170) {
    const required = 170 - previewHeight;
    controlsHeight = Math.max(220, controlsHeight - required);
    previewHeight = availableHeight - listHeight - controlsHeight - padding * 2;
  }

  return {
    list: {
      x: padding,
      y: top,
      width: compactWidth,
      height: listHeight,
    },
    preview: {
      x: padding,
      y: top + listHeight + padding,
      width: compactWidth,
      height: Math.max(170, previewHeight),
    },
    controls: {
      x: padding,
      y: top + listHeight + padding + Math.max(170, previewHeight) + padding,
      width: compactWidth,
      height: Math.max(
        200,
        height -
          (top +
            listHeight +
            padding +
            Math.max(170, previewHeight) +
            padding) -
          padding,
      ),
    },
  };
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
  const persistedStore = canPersist ? readPersistedStore() : {};

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

  const subject = createCard(0x22d3ee, 1);
  subject.anchor.set(0.5);
  world.addChild(subject);

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

  let layout = getLayout(width, height);
  let selectedDefinition: AnimationDefinition = fallbackDefinition;
  let playback = normalizeAnimationPlaybackSettings(null);
  let animationParams = createDefaultAnimationParameters(fallbackDefinition);
  let fixedStepMode = true;
  let isPlaying = true;
  let elapsedMs = 0;
  let cycleCount = 0;
  let frameCount = 0;
  let fixedStepAccumulator = 0;
  let currentProgress = 0;

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
    writePersistedStore(persistedStore);
  };

  const hydrateSelection = (definition: AnimationDefinition): void => {
    const persisted = persistedStore[definition.id];
    playback = normalizeAnimationPlaybackSettings(persisted?.playback);
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
      params: animationParams,
    });

    subject.position.set(px(sample.x), px(sample.y));
    subject.scale.set(sample.scale);
    subject.alpha = clamp(sample.alpha, 0.05, 1);
    subject.rotation = sample.rotation;

    subjectShadow.position.set(px(sample.x), px(sample.y + 18));
    subjectShadow.scale.set(sample.scale * 0.88, sample.scale * 0.22);
    subjectShadow.alpha = clamp(sample.alpha * 0.3, 0.08, 0.36);
    subjectShadow.rotation = sample.rotation * 0.15;
  };

  const updateOverlay = (): void => {
    debugOverlay.text = [
      `Animation: ${selectedDefinition.displayName}`,
      `Frame: ${Math.floor(frameCount)}`,
      `Time: ${Math.round(elapsedMs)}ms`,
      `Progress: ${(currentProgress * 100).toFixed(1)}%`,
      `Mode: ${fixedStepMode ? "fixed-step (16.7ms)" : "real-time"}`,
      `Easing: ${playback.easing}`,
    ].join("\n");
  };

  const renderAnimationList = (): void => {
    clearContainer(listContent);

    const listPadding = 12;
    const itemWidth = layout.list.width - listPadding * 2;
    let cursorY = layout.list.y + 42;

    for (const definition of animationDefinitions) {
      const item = new Container();
      item.eventMode = "static";
      item.cursor = "pointer";

      const body = createCard(
        definition.id === selectedDefinition.id ? 0x0284c7 : 0x1e293b,
      );
      body.width = itemWidth;
      body.height = 44;
      body.position.set(layout.list.x + listPadding, cursorY);
      item.addChild(body);

      const label = new Text({
        text: definition.displayName,
        style: {
          fill: 0xe2e8f0,
          fontSize: 13,
          fontWeight: "700",
        },
      });
      label.position.set(layout.list.x + listPadding + 12, cursorY + 12);
      label.roundPixels = true;
      item.addChild(label);

      item.on("pointertap", () => {
        if (definition.id === selectedDefinition.id) {
          return;
        }

        selectedDefinition = definition;
        hydrateSelection(definition);
        resetClock(true);
        applyCurrentSample();
        updateOverlay();
        renderAnimationList();
        renderControls();
        persistSelection();
      });

      listContent.addChild(item);
      cursorY += 52;
    }
  };

  const renderControls = (): void => {
    clearContainer(controlsContent);

    const controlX = layout.controls.x + 12;
    const contentWidth = layout.controls.width - 24;
    let cursorY = layout.controls.y + 42;

    const placeSection = (text: string): void => {
      const heading = new Text({
        text,
        style: {
          fill: 0x94a3b8,
          fontSize: 12,
          fontWeight: "700",
        },
      });
      heading.roundPixels = true;
      heading.position.set(controlX, cursorY);
      controlsContent.addChild(heading);
      cursorY += 24;
    };

    const placeValueRow = (
      label: string,
      value: string,
      onDecrease: () => void,
      onIncrease: () => void,
    ): void => {
      const row = new Container();

      const rowLabel = new Text({
        text: label,
        style: {
          fill: 0xe2e8f0,
          fontSize: 12,
        },
      });
      rowLabel.position.set(controlX, cursorY + 7);
      rowLabel.roundPixels = true;
      row.addChild(rowLabel);

      const minusButton = createInteractiveButton("-", onDecrease, 24, 24);
      minusButton.position.set(controlX + contentWidth - 116, cursorY + 16);
      row.addChild(minusButton);

      const valueLabel = new Text({
        text: value,
        style: {
          fill: 0xf8fafc,
          fontSize: 12,
          fontWeight: "700",
          align: "center",
        },
      });
      valueLabel.anchor.set(0.5);
      valueLabel.roundPixels = true;
      valueLabel.position.set(controlX + contentWidth - 68, cursorY + 16);
      row.addChild(valueLabel);

      const plusButton = createInteractiveButton("+", onIncrease, 24, 24);
      plusButton.position.set(controlX + contentWidth - 20, cursorY + 16);
      row.addChild(plusButton);

      controlsContent.addChild(row);
      cursorY += 34;
    };

    const placeToggleRow = (
      label: string,
      value: string,
      onToggle: () => void,
    ): void => {
      const rowLabel = new Text({
        text: label,
        style: {
          fill: 0xe2e8f0,
          fontSize: 12,
        },
      });
      rowLabel.position.set(controlX, cursorY + 6);
      rowLabel.roundPixels = true;
      controlsContent.addChild(rowLabel);

      const toggleButton = createInteractiveButton(value, onToggle, 120, 24);
      toggleButton.position.set(controlX + contentWidth - 62, cursorY + 16);
      controlsContent.addChild(toggleButton);
      cursorY += 34;
    };

    const updatePlayback = (
      next: Partial<AnimationPlaybackSettings>,
      autoplay = isPlaying,
    ): void => {
      playback = normalizeAnimationPlaybackSettings({
        ...playback,
        ...next,
      });
      if (
        !playback.loop &&
        elapsedMs >= playback.delayMs + playback.durationMs
      ) {
        isPlaying = false;
      } else {
        isPlaying = autoplay;
      }
      applyCurrentSample();
      updateOverlay();
      renderControls();
      persistSelection();
    };

    placeSection("Playback");
    placeValueRow(
      "Duration (ms)",
      `${Math.round(playback.durationMs)}`,
      () => {
        updatePlayback({ durationMs: playback.durationMs - 100 });
      },
      () => {
        updatePlayback({ durationMs: playback.durationMs + 100 });
      },
    );
    placeValueRow(
      "Delay (ms)",
      `${Math.round(playback.delayMs)}`,
      () => {
        updatePlayback({ delayMs: playback.delayMs - 50 });
      },
      () => {
        updatePlayback({ delayMs: playback.delayMs + 50 });
      },
    );
    placeToggleRow("Easing", playback.easing, () => {
      updatePlayback({ easing: getNextAnimationEasing(playback.easing) });
    });
    placeToggleRow("Loop", playback.loop ? "ON" : "OFF", () => {
      updatePlayback({ loop: !playback.loop });
    });
    placeToggleRow("Fixed timestep", fixedStepMode ? "ON" : "OFF", () => {
      fixedStepMode = !fixedStepMode;
      fixedStepAccumulator = 0;
      updateOverlay();
      renderControls();
      persistSelection();
    });

    cursorY += 6;
    placeSection("Animation Params");

    for (const parameter of selectedDefinition.parameters) {
      placeValueRow(
        parameter.label,
        formatControlValue(animationParams[parameter.key], parameter.step),
        () => {
          animationParams = coerceAnimationParameters(selectedDefinition, {
            ...animationParams,
            [parameter.key]: animationParams[parameter.key] - parameter.step,
          });
          applyCurrentSample();
          updateOverlay();
          renderControls();
          persistSelection();
        },
        () => {
          animationParams = coerceAnimationParameters(selectedDefinition, {
            ...animationParams,
            [parameter.key]: animationParams[parameter.key] + parameter.step,
          });
          applyCurrentSample();
          updateOverlay();
          renderControls();
          persistSelection();
        },
      );
    }

    cursorY += 8;
    const actionRow = new Container();
    const playPause = createInteractiveButton(
      isPlaying ? "Pause" : "Play",
      () => {
        isPlaying = !isPlaying;
        renderControls();
      },
      96,
      30,
    );
    const replay = createInteractiveButton(
      "Replay",
      () => {
        resetClock(true);
        applyCurrentSample();
        updateOverlay();
        renderControls();
      },
      96,
      30,
    );
    const defaults = createInteractiveButton(
      "Defaults",
      () => {
        playback = normalizeAnimationPlaybackSettings(null);
        animationParams = createDefaultAnimationParameters(selectedDefinition);
        fixedStepMode = true;
        resetClock(true);
        applyCurrentSample();
        updateOverlay();
        renderControls();
        persistSelection();
      },
      96,
      30,
    );

    if (contentWidth >= 340) {
      playPause.position.set(controlX + 48, cursorY + 15);
      replay.position.set(controlX + 152, cursorY + 15);
      defaults.position.set(controlX + 256, cursorY + 15);
      actionRow.addChild(playPause, replay, defaults);
      cursorY += 44;
    } else {
      const compactButtonWidth = Math.max(
        72,
        Math.floor((contentWidth - 12) / 2),
      );
      const compactPlayPause = createInteractiveButton(
        isPlaying ? "Pause" : "Play",
        () => {
          isPlaying = !isPlaying;
          renderControls();
        },
        compactButtonWidth,
        30,
      );
      compactPlayPause.position.set(
        controlX + compactButtonWidth / 2,
        cursorY + 15,
      );
      actionRow.addChild(compactPlayPause);

      const compactReplay = createInteractiveButton(
        "Replay",
        () => {
          resetClock(true);
          applyCurrentSample();
          updateOverlay();
          renderControls();
        },
        compactButtonWidth,
        30,
      );
      compactReplay.position.set(
        controlX + compactButtonWidth + 12 + compactButtonWidth / 2,
        cursorY + 15,
      );
      actionRow.addChild(compactReplay);

      const compactDefaults = createInteractiveButton(
        "Defaults",
        () => {
          playback = normalizeAnimationPlaybackSettings(null);
          animationParams =
            createDefaultAnimationParameters(selectedDefinition);
          fixedStepMode = true;
          resetClock(true);
          applyCurrentSample();
          updateOverlay();
          renderControls();
          persistSelection();
        },
        compactButtonWidth * 2 + 12,
        30,
      );
      compactDefaults.position.set(
        controlX + compactButtonWidth + 6,
        cursorY + 52,
      );
      actionRow.addChild(compactDefaults);

      cursorY += 82;
    }

    controlsContent.addChild(actionRow);

    const back = createInteractiveButton(
      "Back to Home",
      () => {
        context.goTo("home");
      },
      Math.min(contentWidth, 320),
      34,
    );
    back.position.set(controlX + Math.min(contentWidth, 320) / 2, cursorY + 17);
    controlsContent.addChild(back);

    const description = new Text({
      text: selectedDefinition.description,
      style: {
        fill: 0x94a3b8,
        fontSize: 12,
        wordWrap: true,
        wordWrapWidth: contentWidth,
      },
    });
    description.position.set(
      controlX,
      layout.controls.y + layout.controls.height - 44,
    );
    description.roundPixels = true;
    controlsContent.addChild(description);
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
    resetClock(true);
    applyCurrentSample();
    updateOverlay();
    renderAnimationList();
    renderControls();
    persistSelection();
  };

  const resize = (nextWidth: number, nextHeight: number): void => {
    layout = getLayout(nextWidth, nextHeight);

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
    subject.width = px(subjectSize);
    subject.height = px(subjectSize);
    subjectShadow.width = px(subjectSize * 0.9);
    subjectShadow.height = px(subjectSize * 0.24);

    debugOverlay.position.set(layout.preview.x + 10, layout.preview.y + 10);

    renderAnimationList();
    renderControls();
    applyCurrentSample();
    updateOverlay();
  };

  hydrateSelection(selectedDefinition);
  setDefinitionById(selectedDefinition.id);
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
