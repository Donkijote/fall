import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import { createRoundedCardGraphic } from "@modules/AnimationLab/AnimationLabPrimitives";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import {
  createFireAnimationPreview,
  getFireStandardPulseState,
} from "@modules/AnimationLab/FireAnimationPreview";
import { Container, Graphics } from "pixi.js";

const CARD_WIDTH = 96;
const CARD_HEIGHT = 132;
const CARD_RADIUS = 12;
const FIRE_EMBER_COLOR = 0xff4d00;
const FIRE_ORANGE_COLOR = 0xff7a00;
const FIRE_AMBER_COLOR = 0xffb020;
const FIRE_GOLD_COLOR = 0xffd86b;

export interface FireCardAnimationPreviewInput {
  currentProgress: number;
  cycle: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
  cardOffsetY?: number;
  fireOffsetY?: number;
  fireScaleMultiplier?: number;
  renderFire?: boolean;
}

export interface FireCardAnimationPreviewController {
  hide: () => void;
  render: (input: FireCardAnimationPreviewInput) => void;
}

export const createFireCardAnimationPreview = (
  world: Container,
): FireCardAnimationPreviewController => {
  const root = new Container();
  root.visible = false;
  world.addChild(root);

  const fireLayer = new Container();
  root.addChild(fireLayer);

  const cardRoot = new Container();
  root.addChild(cardRoot);

  const cardAura = new Graphics();
  const cardBody = createRoundedCardGraphic(
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_RADIUS,
    0xf8fafc,
    0x0f172a,
    0.42,
  );
  const cardHeatWash = new Graphics();
  const cardReflection = new Graphics();
  const cardHeatEdge = new Graphics();
  const cardHeatEdgeCore = new Graphics();
  cardRoot.addChild(cardAura);
  cardRoot.addChild(cardBody);
  cardRoot.addChild(cardHeatWash);
  cardRoot.addChild(cardReflection);
  cardRoot.addChild(cardHeatEdge);
  cardRoot.addChild(cardHeatEdgeCore);

  const firePreview = createFireAnimationPreview(fireLayer);

  return {
    hide: () => {
      root.visible = false;
      firePreview.hide();
    },
    render: (input) => {
      const { currentProgress, cycle, sample, animationParams, layout } = input;
      const t = currentProgress + cycle;
      const pulseState = getFireStandardPulseState(t);
      const cardScale = input.normalizedScale * pulseState.scale;
      const cardHeight = CARD_HEIGHT * cardScale;
      const pulse = pulseState.normalized;
      const heat = 0.06 + pulse * 0.03;
      const fireScale =
        input.normalizedScale * (input.fireScaleMultiplier ?? 0.719);
      const cardOffsetY = input.cardOffsetY ?? -cardHeight * 0.06 + 50;
      const fireOffsetY = input.fireOffsetY ?? -10;
      const renderFire = input.renderFire ?? true;

      root.visible = true;
      root.position.set(sample.x, sample.y);
      root.rotation = 0;
      root.alpha = sample.alpha;
      cardRoot.scale.set(cardScale);
      cardRoot.position.set(0, cardOffsetY);

      if (renderFire) {
        firePreview.render({
          currentProgress,
          cycle,
          sample: {
            ...sample,
            x: 0,
            y: fireOffsetY,
          },
          animationParams,
          layout,
          subjectBaseScale: input.subjectBaseScale,
          normalizedScale: fireScale,
        });
      } else {
        firePreview.hide();
      }

      cardAura.clear();
      cardAura
        .roundRect(
          -CARD_WIDTH / 2 - 18,
          -CARD_HEIGHT / 2 - 18,
          CARD_WIDTH + 36,
          CARD_HEIGHT + 36,
          CARD_RADIUS + 12,
        )
        .fill({
          color: FIRE_ORANGE_COLOR,
          alpha: 0.05 + pulse * 0.04,
        });
      cardAura
        .roundRect(
          -CARD_WIDTH / 2 - 10,
          -CARD_HEIGHT / 2 - 10,
          CARD_WIDTH + 20,
          CARD_HEIGHT + 20,
          CARD_RADIUS + 8,
        )
        .fill({
          color: FIRE_GOLD_COLOR,
          alpha: 0.03 + pulse * 0.03,
        });

      cardBody.alpha = 0.98;

      cardHeatWash.clear();
      cardHeatWash
        .roundRect(
          -CARD_WIDTH / 2,
          -CARD_HEIGHT / 2,
          CARD_WIDTH,
          CARD_HEIGHT,
          CARD_RADIUS,
        )
        .fill({
          color: FIRE_GOLD_COLOR,
          alpha: heat,
        });

      cardReflection.clear();
      cardReflection
        .roundRect(
          -CARD_WIDTH * 0.28,
          -CARD_HEIGHT * 0.37,
          CARD_WIDTH * 0.18,
          CARD_HEIGHT * 0.5,
          14,
        )
        .fill({
          color: 0xffffff,
          alpha: 0.05 + pulse * 0.01,
        });
      cardReflection.rotation = -0.22;

      cardHeatEdge.clear();
      cardHeatEdge
        .roundRect(
          -CARD_WIDTH / 2,
          -CARD_HEIGHT / 2,
          CARD_WIDTH,
          CARD_HEIGHT,
          CARD_RADIUS,
        )
        .stroke({
          color: FIRE_EMBER_COLOR,
          width: 4,
          alpha: 0.15 + pulse * 0.06,
        });
      cardHeatEdge
        .roundRect(
          -CARD_WIDTH / 2 + 2,
          -CARD_HEIGHT / 2 + 2,
          CARD_WIDTH - 4,
          CARD_HEIGHT - 4,
          CARD_RADIUS - 1,
        )
        .stroke({
          color: FIRE_ORANGE_COLOR,
          width: 2,
          alpha: 0.18 + pulse * 0.07,
        });

      cardHeatEdgeCore.clear();
      cardHeatEdgeCore
        .roundRect(
          -CARD_WIDTH / 2 + 5,
          -CARD_HEIGHT / 2 + 5,
          CARD_WIDTH - 10,
          CARD_HEIGHT - 10,
          CARD_RADIUS - 4,
        )
        .stroke({
          color: FIRE_AMBER_COLOR,
          width: 1.5,
          alpha: 0.12 + pulse * 0.05,
        });
    },
  };
};
