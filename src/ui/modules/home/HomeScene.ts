import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Assets, Container, Rectangle, Sprite, Text, Texture } from "pixi.js";

const ARENA_MIN_WIDTH = 320;
const ARENA_MAX_WIDTH = 520;
const DOORS_MIN_WIDTH = 250;
const DOORS_MAX_WIDTH = 420;
const TAVERN_MIN_WIDTH = 300;
const TAVERN_MAX_WIDTH = 480;
const TOWER_MIN_WIDTH = 180;
const TOWER_MAX_WIDTH = 340;

const layoutAnchoredSprite = (
  sprite: Sprite,
  width: number,
  height: number,
  widthRatio: number,
  minWidth: number,
  maxWidth: number,
  anchorX: number,
  anchorY: number,
  offsetX: number,
  offsetY: number,
): void => {
  const px = (value: number): number => Math.round(value);
  const textureWidth = sprite.texture.width || 1;
  const targetWidth = Math.max(
    minWidth,
    Math.min(maxWidth, width * widthRatio),
  );
  const scale = targetWidth / textureWidth;

  sprite.scale.set(scale);
  sprite.position.set(
    px(width * anchorX + offsetX),
    px(height * anchorY + offsetY),
  );
};

const setupInteractiveElement = (sprite: Sprite): void => {
  sprite.eventMode = "static";
  sprite.cursor = "pointer";
};

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

const setTrimmedHitArea = (
  sprite: Sprite,
  sideTrim: number,
  topTrim: number,
  bottomTrim: number,
): void => {
  const textureWidth = sprite.texture.width || 1;
  const textureHeight = sprite.texture.height || 1;

  const x = -textureWidth * 0.5 + textureWidth * sideTrim;
  const y = -textureHeight + textureHeight * topTrim;
  const width = textureWidth * (1 - sideTrim * 2);
  const height = textureHeight * (1 - topTrim - bottomTrim);

  sprite.hitArea = new Rectangle(x, y, width, height);
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

  const tavernSprite = new Sprite(Texture.EMPTY);
  tavernSprite.anchor.set(0.5, 1);
  setupInteractiveElement(tavernSprite);
  root.addChild(tavernSprite);

  const doorsSprite = new Sprite(Texture.EMPTY);
  doorsSprite.anchor.set(0.5, 1);
  setupInteractiveElement(doorsSprite);
  root.addChild(doorsSprite);

  const arenaSprite = new Sprite(Texture.EMPTY);
  arenaSprite.anchor.set(0.5, 1);
  setupInteractiveElement(arenaSprite);
  root.addChild(arenaSprite);

  const towerSprite = new Sprite(Texture.EMPTY);
  towerSprite.anchor.set(0.5, 1);
  setupInteractiveElement(towerSprite);
  root.addChild(towerSprite);

  const tavernAsset = Assets.get("home-decor-tavern");
  const doorsAsset = Assets.get("home-decor-doors");
  const arenaAsset = Assets.get("home-decor-arena");
  const towerAsset = Assets.get("home-decor-tower");
  tavernSprite.texture =
    tavernAsset instanceof Texture ? tavernAsset : Texture.EMPTY;
  doorsSprite.texture =
    doorsAsset instanceof Texture ? doorsAsset : Texture.EMPTY;
  arenaSprite.texture =
    arenaAsset instanceof Texture ? arenaAsset : Texture.EMPTY;
  towerSprite.texture =
    towerAsset instanceof Texture ? towerAsset : Texture.EMPTY;

  setTrimmedHitArea(tavernSprite, 0.3, 0.2, 0.1);
  setTrimmedHitArea(doorsSprite, 0.28, 0.27, 0.08);
  setTrimmedHitArea(arenaSprite, 0.27, 0.25, 0.09);
  setTrimmedHitArea(towerSprite, 0.33, 0.2, 0.12);

  arenaSprite.on("pointertap", () => {
    context.goTo("arena");
  });

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

    layoutAnchoredSprite(
      tavernSprite,
      nextWidth,
      nextHeight,
      0.26,
      TAVERN_MIN_WIDTH,
      TAVERN_MAX_WIDTH,
      0.22,
      0.9,
      0,
      0,
    );

    layoutAnchoredSprite(
      doorsSprite,
      nextWidth,
      nextHeight,
      0.2,
      DOORS_MIN_WIDTH,
      DOORS_MAX_WIDTH,
      0.52,
      0.84,
      0,
      0,
    );

    layoutAnchoredSprite(
      arenaSprite,
      nextWidth,
      nextHeight,
      0.3,
      ARENA_MIN_WIDTH,
      ARENA_MAX_WIDTH,
      0.78,
      0.92,
      0,
      0,
    );

    layoutAnchoredSprite(
      towerSprite,
      nextWidth,
      nextHeight,
      0.15,
      TOWER_MIN_WIDTH,
      TOWER_MAX_WIDTH,
      0.88,
      0.76,
      0,
      0,
    );

    if (animationLabButton) {
      animationLabButton.position.set(px(nextWidth - 108), px(32));
    }
  };

  resize(width, height);

  return {
    container: root,
    update,
    resize,
  };
};
