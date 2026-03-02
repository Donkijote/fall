import {
  type AnimationPlaybackSettings,
  getNextAnimationEasing,
} from "@application/animations/AnimationRegistry";
import {
  clearContainer,
  createInteractiveButton,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import type { AnimationControlsPanelProps } from "@modules/AnimationLab/AnimationLabTypes";
import { formatControlValue } from "@modules/AnimationLab/AnimationLabUtils";
import { Container, Text } from "pixi.js";

export const renderAnimationLabControlsPanel = (
  controlsContent: Container,
  props: AnimationControlsPanelProps,
): void => {
  clearContainer(controlsContent);

  const controlX = props.layout.controls.x + 12;
  const contentWidth = props.layout.controls.width - 24;
  let cursorY = props.layout.controls.y + 42;

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

  const updatePlayback = (next: Partial<AnimationPlaybackSettings>): void => {
    props.onPlaybackChange(next);
  };

  placeSection("Playback");
  placeValueRow(
    "Duration (ms)",
    `${Math.round(props.playback.durationMs)}`,
    () => {
      updatePlayback({ durationMs: props.playback.durationMs - 100 });
    },
    () => {
      updatePlayback({ durationMs: props.playback.durationMs + 100 });
    },
  );
  placeValueRow(
    "Delay (ms)",
    `${Math.round(props.playback.delayMs)}`,
    () => {
      updatePlayback({ delayMs: props.playback.delayMs - 50 });
    },
    () => {
      updatePlayback({ delayMs: props.playback.delayMs + 50 });
    },
  );
  placeToggleRow("Easing", props.playback.easing, () => {
    props.onPlaybackChange({
      easing: getNextAnimationEasing(props.playback.easing),
    });
  });
  placeToggleRow("Loop", props.playback.loop ? "ON" : "OFF", () => {
    updatePlayback({ loop: !props.playback.loop });
  });
  placeToggleRow("Fixed timestep", props.fixedStepMode ? "ON" : "OFF", () => {
    props.onFixedStepToggle();
  });

  cursorY += 6;
  placeSection("Animation Params");

  for (const parameter of props.selectedDefinition.parameters) {
    placeValueRow(
      parameter.label,
      formatControlValue(props.animationParams[parameter.key], parameter.step),
      () => {
        props.onParameterAdjust(parameter.key, -parameter.step);
      },
      () => {
        props.onParameterAdjust(parameter.key, parameter.step);
      },
    );
  }

  cursorY += 8;
  const actionRow = new Container();
  const playPause = createInteractiveButton(
    props.isPlaying ? "Pause" : "Play",
    props.onPlayPause,
    96,
    30,
  );
  const replay = createInteractiveButton("Replay", props.onReplay, 96, 30);
  const defaults = createInteractiveButton(
    "Defaults",
    props.onDefaults,
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
      props.isPlaying ? "Pause" : "Play",
      props.onPlayPause,
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
      props.onReplay,
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
      props.onDefaults,
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
    props.onBackHome,
    Math.min(contentWidth, 320),
    34,
  );
  back.position.set(controlX + Math.min(contentWidth, 320) / 2, cursorY + 17);
  controlsContent.addChild(back);

  const description = new Text({
    text: props.selectedDefinition.description,
    style: {
      fill: 0x94a3b8,
      fontSize: 12,
      wordWrap: true,
      wordWrapWidth: contentWidth,
    },
  });
  description.position.set(
    controlX,
    props.layout.controls.y + props.layout.controls.height - 44,
  );
  description.roundPixels = true;
  controlsContent.addChild(description);
};
