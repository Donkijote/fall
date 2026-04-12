import type { Container } from "pixi.js";

export interface SceneContext {
  goTo: (sceneId: string) => void;
}

export interface AppScene {
  container: Container;
  update: (deltaTime: number) => void;
  resize: (width: number, height: number) => void;
  destroy?: () => void;
}

export type SceneFactory = (context: SceneContext) => AppScene;

interface SceneManagerOptions {
  onSceneChange?: (sceneId: string) => void;
}

export interface SceneManager {
  register: (sceneId: string, factory: SceneFactory) => void;
  goTo: (sceneId: string) => void;
  update: (deltaTime: number) => void;
  resize: (width: number, height: number) => void;
}

export const createSceneManager = (
  stage: Container,
  options: SceneManagerOptions = {},
): SceneManager => {
  const sceneFactories = new Map<string, SceneFactory>();
  let activeScene: AppScene | null = null;

  const goTo = (sceneId: string): void => {
    const factory = sceneFactories.get(sceneId);
    if (!factory) {
      throw new Error(`Scene not registered: ${sceneId}`);
    }

    if (activeScene) {
      stage.removeChild(activeScene.container);
      activeScene.destroy?.();
      activeScene = null;
    }

    activeScene = factory({
      goTo: (nextSceneId) => goTo(nextSceneId),
    });
    stage.addChild(activeScene.container);
    options.onSceneChange?.(sceneId);
  };

  return {
    register: (sceneId, factory) => {
      sceneFactories.set(sceneId, factory);
    },
    goTo,
    update: (deltaTime) => {
      activeScene?.update(deltaTime);
    },
    resize: (width, height) => {
      activeScene?.resize(width, height);
    },
  };
};
