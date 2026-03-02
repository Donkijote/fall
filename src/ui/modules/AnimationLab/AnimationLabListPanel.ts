import {
  clearContainer,
  createCard,
} from "@modules/AnimationLab/AnimationLabPrimitives";
import type { AnimationListPanelProps } from "@modules/AnimationLab/AnimationLabTypes";
import { Container, Text } from "pixi.js";

export const renderAnimationLabListPanel = (
  listContent: Container,
  props: AnimationListPanelProps,
): void => {
  clearContainer(listContent);

  const listPadding = 12;
  const itemWidth = props.layout.list.width - listPadding * 2;
  let cursorY = props.layout.list.y + 42;

  for (const definition of props.animationDefinitions) {
    const item = new Container();
    item.eventMode = "static";
    item.cursor = "pointer";

    const body = createCard(
      definition.id === props.selectedAnimationId ? 0x0284c7 : 0x1e293b,
    );
    body.width = itemWidth;
    body.height = 44;
    body.position.set(props.layout.list.x + listPadding, cursorY);
    item.addChild(body);

    const label = new Text({
      text: definition.displayName,
      style: {
        fill: 0xe2e8f0,
        fontSize: 13,
        fontWeight: "700",
      },
    });
    label.position.set(props.layout.list.x + listPadding + 12, cursorY + 12);
    label.roundPixels = true;
    item.addChild(label);

    item.on("pointertap", () => {
      if (definition.id === props.selectedAnimationId) {
        return;
      }

      props.onSelect(definition.id);
    });

    listContent.addChild(item);
    cursorY += 52;
  }
};
