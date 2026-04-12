import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { clamp } from "@modules/AnimationLab/AnimationLabUtils";

const TITLE_HEIGHT = 64;

export const getAnimationLabLayout = (
  width: number,
  height: number,
): LayoutState => {
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
