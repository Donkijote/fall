import { Container, Sprite, Text, Texture } from "pixi.js";

export const createCard = (tint: number, alpha = 1): Sprite => {
  const card = new Sprite(Texture.WHITE);
  card.tint = tint;
  card.alpha = alpha;
  return card;
};

export const clearContainer = (container: Container): void => {
  const children = container.removeChildren();
  for (const child of children) {
    child.destroy({ children: true });
  }
};

export const createInteractiveButton = (
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
