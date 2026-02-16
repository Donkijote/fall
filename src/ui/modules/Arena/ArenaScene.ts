import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Sprite, Text, Texture } from "pixi.js";

const createButton = (label: string): Container => {
  const button = new Container();
  button.eventMode = "static";
  button.cursor = "pointer";

  const body = new Sprite(Texture.WHITE);
  body.anchor.set(0.5);
  body.width = 220;
  body.height = 48;
  body.tint = 0x334155;
  button.addChild(body);

  const text = new Text({
    text: label,
    style: {
      fill: 0xffffff,
      fontSize: 16,
      fontWeight: "700",
    },
  });
  text.anchor.set(0.5);
  text.roundPixels = true;
  button.addChild(text);

  return button;
};

export const createArenaScene = (
  width: number,
  height: number,
  context: SceneContext,
): AppScene => {
  const px = (value: number): number => Math.round(value);
  const root = new Container();

  const bg = new Sprite(Texture.WHITE);
  bg.width = px(width);
  bg.height = px(height);
  bg.tint = 0x0f172a;
  root.addChild(bg);

  const board = new Sprite(Texture.WHITE);
  board.anchor.set(0.5);
  board.width = 520;
  board.height = 220;
  board.position.set(px(width / 2), px(height / 2));
  board.tint = 0x14532d;
  root.addChild(board);

  const title = new Text({
    text: "Arena Scene Mock",
    style: {
      fill: 0xe2e8f0,
      fontSize: 28,
      fontWeight: "700",
    },
  });
  title.anchor.set(0.5);
  title.roundPixels = true;
  title.position.set(px(width / 2), px(80));
  root.addChild(title);

  const hint = new Text({
    text: "Scene manager only: reload always returns Home",
    style: {
      fill: 0x94a3b8,
      fontSize: 16,
    },
  });
  hint.anchor.set(0.5);
  hint.roundPixels = true;
  hint.position.set(px(width / 2), px(112));
  root.addChild(hint);

  const backButton = createButton("Back to Home");
  backButton.position.set(px(width / 2), px(height - 72));
  backButton.on("pointertap", () => {
    context.goTo("home");
  });
  root.addChild(backButton);

  let elapsed = 0;
  const update = (deltaTime: number): void => {
    elapsed += deltaTime;
    board.rotation = Math.sin(elapsed / 60) * 0.01;
  };

  const resize = (nextWidth: number, nextHeight: number): void => {
    bg.width = px(nextWidth);
    bg.height = px(nextHeight);
    board.position.set(px(nextWidth / 2), px(nextHeight / 2));
    title.position.set(px(nextWidth / 2), px(80));
    hint.position.set(px(nextWidth / 2), px(112));
    backButton.position.set(px(nextWidth / 2), px(nextHeight - 72));
  };

  return {
    container: root,
    update,
    resize,
  };
};
