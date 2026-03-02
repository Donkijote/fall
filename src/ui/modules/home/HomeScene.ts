import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Sprite, Text, Texture } from "pixi.js";

const createSceneNavButton = (label: string): Container => {
  const button = new Container();
  button.eventMode = "static";
  button.cursor = "pointer";

  const body = new Sprite(Texture.WHITE);
  body.anchor.set(0.5);
  body.width = 160;
  body.height = 34;
  body.tint = 0x0f172a;
  button.addChild(body);

  const text = new Text({
    text: label,
    style: {
      fill: 0xf8fafc,
      fontSize: 12,
      fontWeight: "700",
    },
  });
  text.anchor.set(0.5);
  text.roundPixels = true;
  button.addChild(text);

  return button;
};

export const createHomeScene = (
  _checkpoint: ReworkCheckpoint,
  width: number,
  height: number,
  context: SceneContext,
  showAnimationLabEntry: boolean,
): AppScene => {
  const px = (value: number): number => Math.round(value);
  const root = new Container();
  root.position.set(0, 0);

  const background = new Sprite(Texture.WHITE);
  background.width = px(width);
  background.height = px(height);
  background.tint = 0xf8fafc;
  root.addChild(background);

  const animationLabButton = showAnimationLabEntry
    ? createSceneNavButton("Animation Lab (DEV)")
    : null;
  if (animationLabButton) {
    animationLabButton.on("pointertap", () => {
      context.goTo("animation-lab");
    });
    root.addChild(animationLabButton);
  }

  const update = (): void => {};

  const resize = (nextWidth: number, nextHeight: number): void => {
    background.width = px(nextWidth);
    background.height = px(nextHeight);

    if (animationLabButton) {
      animationLabButton.position.set(px(nextWidth / 2), px(nextHeight - 36));
    }
  };

  resize(width, height);

  return {
    container: root,
    update,
    resize,
  };
};
