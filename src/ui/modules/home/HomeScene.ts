import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { toAnimationProfileName } from "@domain/value-types/AnimationProfile";
import { PROJECT_NAME } from "@shared/constants/project";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Container, Sprite, Text, Texture } from "pixi.js";

const createButton = (label: string): { button: Container; label: Text } => {
  const button = new Container();
  button.eventMode = "static";
  button.cursor = "pointer";

  const body = new Sprite(Texture.WHITE);
  body.anchor.set(0.5);
  body.width = 260;
  body.height = 52;
  body.tint = 0x0ea5e9;
  button.addChild(body);

  const text = new Text({
    text: label,
    style: {
      fill: 0xffffff,
      fontSize: 18,
      fontWeight: "700",
    },
  });
  text.anchor.set(0.5);
  text.roundPixels = true;
  button.addChild(text);

  return { button, label: text };
};

export const createHomeScene = (
  checkpoint: ReworkCheckpoint,
  width: number,
  height: number,
  context: SceneContext,
): AppScene => {
  const px = (value: number): number => Math.round(value);
  const root = new Container();
  root.position.set(0, 0);

  const background = new Sprite(Texture.WHITE);
  background.width = px(width);
  background.height = px(height);
  background.tint = 0xf8fafc;
  root.addChild(background);

  const world = new Container();
  world.position.set(px(width / 2), px(height / 2));
  root.addChild(world);

  const halo = new Sprite(Texture.WHITE);
  halo.anchor.set(0.5);
  halo.width = 280;
  halo.height = 280;
  halo.alpha = 0.12;
  halo.tint = 0x94a3b8;
  world.addChild(halo);

  const card = new Sprite(Texture.WHITE);
  card.anchor.set(0.5);
  card.width = 116;
  card.height = 116;
  card.tint = 0x0ea5e9;
  world.addChild(card);

  const title = new Text({
    text: `${PROJECT_NAME} · ${checkpoint.phase}`,
    style: {
      fill: 0x0f172a,
      fontSize: 30,
      fontWeight: "700",
    },
  });
  title.anchor.set(0.5);
  title.roundPixels = true;
  title.position.set(px(0), px(-182));
  world.addChild(title);

  const subtitle = new Text({
    text: `Profile: ${toAnimationProfileName(checkpoint.animationProfile)}`,
    style: {
      fill: 0x334155,
      fontSize: 18,
    },
  });
  subtitle.anchor.set(0.5);
  subtitle.roundPixels = true;
  subtitle.position.set(px(0), px(154));
  world.addChild(subtitle);

  const objective = new Text({
    text: checkpoint.logicObjective,
    style: {
      fill: 0x64748b,
      fontSize: 15,
    },
  });
  objective.anchor.set(0.5);
  objective.roundPixels = true;
  objective.position.set(px(0), px(182));
  world.addChild(objective);

  const startMatchButton = createButton("Open Arena Scene");
  startMatchButton.button.position.set(px(0), px(246));
  startMatchButton.button.on("pointertap", () => {
    context.goTo("arena");
  });
  world.addChild(startMatchButton.button);

  let elapsed = 0;
  const update = (deltaTime: number): void => {
    elapsed += deltaTime;
    card.rotation += 0.018 * deltaTime;
    halo.rotation -= 0.004 * deltaTime;
    halo.scale.set(1 + Math.sin(elapsed / 22) * 0.07);
  };

  const resize = (nextWidth: number, nextHeight: number): void => {
    background.width = px(nextWidth);
    background.height = px(nextHeight);
    world.position.set(px(nextWidth / 2), px(nextHeight / 2));
  };

  return {
    container: root,
    update,
    resize,
  };
};
