import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import type { AppScene, SceneContext } from "@ui/state/SceneManager";
import { Assets, Container, Sprite, Text, Texture } from "pixi.js";

export interface HomeBackgroundOption {
  alias: string;
  label: string;
}

const MAX_BACKGROUND_RENDER_WIDTH = 2770;
const defaultBackgroundOptions: HomeBackgroundOption[] = [
  { alias: "home-bg-dawn", label: "Dawn" },
  { alias: "home-bg-noon", label: "Noon" },
  { alias: "home-bg-afternoon", label: "Afternoon" },
  { alias: "home-bg-night", label: "Night" },
];

const sideFadeColorByAlias: Record<string, number> = {
  "home-bg-dawn": 0x7a5f63,
  "home-bg-noon": 0x86a8cf,
  "home-bg-afternoon": 0x88624f,
  "home-bg-night": 0x1a2340,
};

const sideFadeTextureCache = new Map<string, Texture>();
const atmosphereTextureCache = new Map<string, Texture>();
const atmosphereColorByAlias: Record<string, number> = {
  "home-bg-dawn": 0xf2d8ca,
  "home-bg-noon": 0xbfd7ef,
  "home-bg-afternoon": 0xe2b89a,
  "home-bg-night": 0x6b7ca8,
};

const toRgb = (value: number): [number, number, number] => {
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

const createSideFadeTexture = (
  color: number,
  direction: "left" | "right",
): Texture => {
  const cacheKey = `${direction}-${color.toString(16)}`;
  const cached = sideFadeTextureCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 2;

  const context = canvas.getContext("2d");
  if (!context) {
    return Texture.WHITE;
  }

  const [r, g, b] = toRgb(color);
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);

  if (direction === "left") {
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.94)`);
  } else {
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.94)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = Texture.from(canvas);
  sideFadeTextureCache.set(cacheKey, texture);
  return texture;
};

const createAtmosphereTexture = (color: number): Texture => {
  const cacheKey = color.toString(16);
  const cached = atmosphereTextureCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    return Texture.WHITE;
  }

  const [r, g, b] = toRgb(color);
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.22)`);
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.03)`);

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = Texture.from(canvas);
  atmosphereTextureCache.set(cacheKey, texture);
  return texture;
};

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

const createSmallButton = (
  label: string,
): { button: Container; label: Text } => {
  const button = new Container();
  button.eventMode = "static";
  button.cursor = "pointer";

  const body = new Sprite(Texture.WHITE);
  body.anchor.set(0.5);
  body.width = 92;
  body.height = 38;
  body.tint = 0x334155;
  body.alpha = 0.88;
  button.addChild(body);

  const text = new Text({
    text: label,
    style: {
      fill: 0xffffff,
      fontSize: 14,
      fontWeight: "700",
    },
  });
  text.anchor.set(0.5);
  text.roundPixels = true;
  button.addChild(text);

  return { button, label: text };
};

const layoutBackground = (
  background: Sprite,
  width: number,
  height: number,
): number => {
  const px = (value: number): number => Math.round(value);

  const textureWidth = background.texture.width || width;
  const textureHeight = background.texture.height || height;

  const coverScale = Math.max(width / textureWidth, height / textureHeight);
  const maxScale = MAX_BACKGROUND_RENDER_WIDTH / textureWidth;
  const finalScale = Math.min(coverScale, maxScale);

  background.position.set(px(width / 2), px(height / 2));
  background.scale.set(finalScale);

  return textureWidth * finalScale;
};

const layoutForeground = (
  foreground: Sprite,
  width: number,
  height: number,
): void => {
  const px = (value: number): number => Math.round(value);
  const textureWidth = foreground.texture.width || width;
  const textureHeight = foreground.texture.height || height;
  const targetWidth = Math.min(width * 1.02, MAX_BACKGROUND_RENDER_WIDTH);
  const scale = targetWidth / textureWidth;
  const scaledHeight = textureHeight * scale;

  foreground.position.set(px(width / 2), px(height + scaledHeight * 0.26));
  foreground.scale.set(scale);
};

const getHomeBackgroundAliasForLocalHour = (hour: number): string => {
  if (hour >= 5 && hour < 10) {
    return "home-bg-dawn";
  }

  if (hour >= 10 && hour < 15) {
    return "home-bg-noon";
  }

  if (hour >= 15 && hour < 20) {
    return "home-bg-afternoon";
  }

  return "home-bg-night";
};

export const createHomeScene = (
  _checkpoint: ReworkCheckpoint,
  width: number,
  height: number,
  context: SceneContext,
): AppScene => {
  const px = (value: number): number => Math.round(value);

  const root = new Container();
  const backgroundAlias = getHomeBackgroundAliasForLocalHour(
    new Date().getHours(),
  );

  let selectedBackgroundIndex = Math.max(
    0,
    defaultBackgroundOptions.findIndex(
      (option) => option.alias === backgroundAlias,
    ),
  );

  const background = new Sprite(Texture.WHITE);
  background.anchor.set(0.5);
  root.addChild(background);

  const sideFadeLayer = new Container();
  root.addChild(sideFadeLayer);

  const leftSideFade = new Sprite(Texture.WHITE);
  leftSideFade.anchor.set(0, 0.5);
  sideFadeLayer.addChild(leftSideFade);

  const rightSideFade = new Sprite(Texture.WHITE);
  rightSideFade.anchor.set(1, 0.5);
  sideFadeLayer.addChild(rightSideFade);

  const atmosphereLayer = new Sprite(Texture.WHITE);
  atmosphereLayer.anchor.set(0);
  root.addChild(atmosphereLayer);

  const foreground = new Sprite(Texture.WHITE);
  foreground.anchor.set(0.5, 1);
  root.addChild(foreground);

  const startMatchButton = createButton("Open Arena Scene");
  startMatchButton.button.on("pointertap", () => {
    context.goTo("arena");
  });
  const controlPanel = new Container();
  root.addChild(controlPanel);
  controlPanel.addChild(startMatchButton.button);

  const switcher = new Container();
  controlPanel.addChild(switcher);

  const switcherPanel = new Sprite(Texture.WHITE);
  switcherPanel.anchor.set(1, 0);
  switcherPanel.height = 54;
  switcherPanel.tint = 0x0f172a;
  switcherPanel.alpha = 0.55;
  switcher.addChild(switcherPanel);

  const previousButton = createSmallButton("Prev");
  previousButton.button.position.set(px(-236), px(27));
  switcher.addChild(previousButton.button);

  const nextButton = createSmallButton("Next");
  nextButton.button.position.set(px(-84), px(27));
  switcher.addChild(nextButton.button);

  const currentBackgroundLabel = new Text({
    text: "",
    style: {
      fill: 0xffffff,
      fontSize: 14,
      fontWeight: "700",
    },
  });
  currentBackgroundLabel.anchor.set(1, 0.5);
  currentBackgroundLabel.roundPixels = true;
  currentBackgroundLabel.position.set(px(-160), px(27));
  switcher.addChild(currentBackgroundLabel);

  const applyBackgroundAtIndex = (index: number): void => {
    const nextIndex =
      ((index % defaultBackgroundOptions.length) +
        defaultBackgroundOptions.length) %
      defaultBackgroundOptions.length;
    selectedBackgroundIndex = nextIndex;
    const option = defaultBackgroundOptions[nextIndex];

    const resolvedTexture = Assets.get(option.alias);
    const texture =
      resolvedTexture instanceof Texture ? resolvedTexture : Texture.WHITE;
    background.texture = texture;
    if (texture === Texture.WHITE) {
      background.tint = 0x0f172a;
    } else {
      background.tint = 0xffffff;
    }

    const sideFadeColor = sideFadeColorByAlias[option.alias] ?? 0x1e293b;
    leftSideFade.texture = createSideFadeTexture(sideFadeColor, "left");
    rightSideFade.texture = createSideFadeTexture(sideFadeColor, "right");
    const atmosphereColor = atmosphereColorByAlias[option.alias] ?? 0xb8c2d4;
    atmosphereLayer.texture = createAtmosphereTexture(atmosphereColor);

    currentBackgroundLabel.text = option.label;

    const foregroundTextureCandidate = Assets.get("home-overlay-platform");
    const foregroundTexture =
      foregroundTextureCandidate instanceof Texture
        ? foregroundTextureCandidate
        : Texture.EMPTY;
    foreground.texture = foregroundTexture;
  };

  previousButton.button.on("pointertap", () => {
    applyBackgroundAtIndex(selectedBackgroundIndex - 1);
  });
  nextButton.button.on("pointertap", () => {
    applyBackgroundAtIndex(selectedBackgroundIndex + 1);
  });

  applyBackgroundAtIndex(selectedBackgroundIndex);
  layoutBackground(background, width, height);

  const update = (): void => {};

  const resize = (nextWidth: number, nextHeight: number): void => {
    const renderedWidth = layoutBackground(background, nextWidth, nextHeight);
    const sideGap = Math.max(0, nextWidth - renderedWidth);
    const sideWidth = Math.ceil(sideGap / 2);

    leftSideFade.position.set(0, px(nextHeight / 2));
    leftSideFade.width = sideWidth;
    leftSideFade.height = nextHeight;
    leftSideFade.visible = sideWidth > 0;

    rightSideFade.position.set(px(nextWidth), px(nextHeight / 2));
    rightSideFade.width = sideWidth;
    rightSideFade.height = nextHeight;
    rightSideFade.visible = sideWidth > 0;

    atmosphereLayer.position.set(0, 0);
    atmosphereLayer.width = nextWidth;
    atmosphereLayer.height = nextHeight;

    layoutForeground(foreground, nextWidth, nextHeight);

    controlPanel.position.set(px(nextWidth - 28), px(24));
    startMatchButton.button.position.set(px(-130), px(26));
    switcher.position.set(0, 66);
    switcherPanel.width = 320;
  };

  resize(width, height);

  return {
    container: root,
    update,
    resize,
  };
};
