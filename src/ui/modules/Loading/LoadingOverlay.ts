import { Container, Graphics, Text } from "pixi.js";

export interface LoadingOverlay {
  container: Container;
  setProgress: (value: number) => void;
}

export const createLoadingOverlay = (
  width: number,
  height: number,
): LoadingOverlay => {
  const px = (value: number): number => Math.round(value);

  const container = new Container();

  const background = new Graphics()
    .roundRect(
      px(width * 0.15),
      px(height * 0.42),
      px(width * 0.7),
      px(140),
      18,
    )
    .fill(0xf1f5f9)
    .stroke({ color: 0xcbd5e1, width: 1 });
  container.addChild(background);

  const title = new Text({
    text: "Loading Assets",
    style: {
      fill: 0x0f172a,
      fontSize: 26,
      fontWeight: "700",
    },
  });
  title.anchor.set(0.5);
  title.roundPixels = true;
  title.position.set(px(width / 2), px(height * 0.46));
  container.addChild(title);

  const progressTrack = new Graphics()
    .roundRect(px(width * 0.2), px(height * 0.52), px(width * 0.6), px(24), 12)
    .fill(0xe2e8f0);
  container.addChild(progressTrack);

  const progressFill = new Graphics();
  container.addChild(progressFill);

  const percentageLabel = new Text({
    text: "0%",
    style: {
      fill: 0x334155,
      fontSize: 16,
      fontWeight: "600",
    },
  });
  percentageLabel.anchor.set(0.5);
  percentageLabel.roundPixels = true;
  percentageLabel.position.set(px(width / 2), px(height * 0.58));
  container.addChild(percentageLabel);

  const setProgress = (value: number): void => {
    const progress = Math.max(0, Math.min(1, value));
    const trackX = px(width * 0.2);
    const trackY = px(height * 0.52);
    const trackWidth = px(width * 0.6);
    const fillWidth = px(trackWidth * progress);

    progressFill.clear();
    if (fillWidth > 0) {
      progressFill
        .roundRect(trackX, trackY, fillWidth, px(24), 12)
        .fill(0x0ea5e9);
    }

    percentageLabel.text = `${Math.round(progress * 100)}%`;
  };

  return {
    container,
    setProgress,
  };
};
