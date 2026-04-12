import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { Assets, type Container, Sprite, Texture } from "pixi.js";

const FIRE_IMAGE_URL = "/assets/animations/fire.png";

export interface FireAnimationPreviewInput {
  currentProgress: number;
  cycle: number;
  sample: AnimationTransformSample;
  animationParams: Readonly<Record<string, number>>;
  layout: LayoutState;
  subjectBaseScale: number;
  normalizedScale: number;
}

export interface FireAnimationPreviewController {
  hide: () => void;
  render: (input: FireAnimationPreviewInput) => void;
}

export const createFireAnimationPreview = (
  world: Container,
): FireAnimationPreviewController => {
  const glowSprite = new Sprite(Texture.EMPTY);
  glowSprite.anchor.set(0.5);
  glowSprite.visible = false;
  glowSprite.tint = 0xff7a00;
  world.addChild(glowSprite);

  const fireSprite = new Sprite(Texture.EMPTY);
  fireSprite.anchor.set(0.5);
  fireSprite.visible = false;
  world.addChild(fireSprite);

  let imageTexture: Texture | null = null;
  let loadRequested = false;
  let loadFailed = false;

  const ensureFireImageLoaded = (): void => {
    if (loadRequested || loadFailed) {
      return;
    }

    loadRequested = true;
    void Assets.load(FIRE_IMAGE_URL)
      .then((loadedAsset) => {
        if (!(loadedAsset instanceof Texture)) {
          loadFailed = true;
          return;
        }

        imageTexture = loadedAsset;
      })
      .catch(() => {
        loadFailed = true;
      });
  };

  return {
    hide: () => {
      fireSprite.visible = false;
      glowSprite.visible = false;
    },
    render: (input) => {
      const { currentProgress, cycle, sample, layout, normalizedScale } = input;
      ensureFireImageLoaded();
      if (loadFailed || !imageTexture) {
        fireSprite.visible = false;
        glowSprite.visible = false;
        return;
      }

      const t = currentProgress + cycle;
      const baseSize =
        Math.min(layout.preview.width, layout.preview.height) * 0.46;
      const size = baseSize * normalizedScale;
      const aspectRatio = imageTexture.width / Math.max(imageTexture.height, 1);
      const baseHeight = size;
      const baseWidth = baseHeight * aspectRatio;

      const swayX = Math.sin(t * Math.PI * 2.2) * baseWidth * 0.018;
      const pulse = 1 + Math.sin(t * Math.PI * 5.5 + 0.9) * 0.035;
      const squash = 1 + Math.sin(t * Math.PI * 4.1 + 1.8) * 0.03;
      const stretch = 1 - Math.sin(t * Math.PI * 4.1 + 1.8) * 0.04;
      const tilt = Math.sin(t * Math.PI * 2.6) * 0.035;

      fireSprite.visible = true;
      fireSprite.texture = imageTexture;
      fireSprite.position.set(sample.x + swayX, sample.y);
      fireSprite.width = baseWidth * pulse * squash;
      fireSprite.height = baseHeight * pulse * stretch;
      fireSprite.rotation = tilt;
      fireSprite.alpha = 0.94 + Math.sin(t * Math.PI * 7.2) * 0.05;

      glowSprite.visible = true;
      glowSprite.texture = imageTexture;
      glowSprite.position.set(
        sample.x + swayX * 0.7,
        sample.y + baseHeight * 0.02,
      );
      glowSprite.width = baseWidth * 1.12 * pulse;
      glowSprite.height = baseHeight * 1.1 * pulse;
      glowSprite.rotation = tilt * 0.6;
      glowSprite.alpha = 0.2 + Math.sin(t * Math.PI * 6.4) * 0.06;
    },
  };
};
