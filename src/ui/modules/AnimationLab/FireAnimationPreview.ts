import type { AnimationTransformSample } from "@application/animations/AnimationRegistry";
import type { LayoutState } from "@modules/AnimationLab/AnimationLabTypes";
import { Assets, type Container, Sprite, Texture } from "pixi.js";

const FIRE_IMAGE_URL = "/assets/animations/fire.png";
const FIRE_STANDARD_PULSE_SCALE_AMPLITUDE = 0.03;
const FIRE_STANDARD_PULSE_ALPHA_AMPLITUDE = 0.04;
const FIRE_STANDARD_PULSE_GLOW_ALPHA_AMPLITUDE = 0.05;

export interface FirePulseState {
  normalized: number;
  scale: number;
  alpha: number;
  glowAlpha: number;
}

export const getFireStandardPulseState = (t: number): FirePulseState => {
  const phase = Math.sin(t * Math.PI * 2 - Math.PI / 2);
  const normalized = (phase + 1) * 0.5;

  return {
    normalized,
    scale: 1 + phase * FIRE_STANDARD_PULSE_SCALE_AMPLITUDE,
    alpha: 0.94 + phase * FIRE_STANDARD_PULSE_ALPHA_AMPLITUDE,
    glowAlpha: 0.2 + phase * FIRE_STANDARD_PULSE_GLOW_ALPHA_AMPLITUDE,
  };
};

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

      const pulseState = getFireStandardPulseState(t);

      fireSprite.visible = true;
      fireSprite.texture = imageTexture;
      fireSprite.position.set(sample.x, sample.y);
      fireSprite.width = baseWidth * pulseState.scale;
      fireSprite.height = baseHeight * pulseState.scale;
      fireSprite.rotation = 0;
      fireSprite.alpha = pulseState.alpha;

      glowSprite.visible = true;
      glowSprite.texture = imageTexture;
      glowSprite.position.set(sample.x, sample.y + baseHeight * 0.02);
      glowSprite.width = baseWidth * 1.12 * pulseState.scale;
      glowSprite.height = baseHeight * 1.1 * pulseState.scale;
      glowSprite.rotation = 0;
      glowSprite.alpha = pulseState.glowAlpha;
    },
  };
};
