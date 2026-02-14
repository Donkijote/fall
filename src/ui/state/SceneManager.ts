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

export class SceneManager {
  private readonly stage: Container;
  private readonly sceneFactories = new Map<string, SceneFactory>();
  private activeScene: AppScene | null = null;

  constructor(stage: Container) {
    this.stage = stage;
  }

  register(sceneId: string, factory: SceneFactory): void {
    this.sceneFactories.set(sceneId, factory);
  }

  goTo(sceneId: string): void {
    const factory = this.sceneFactories.get(sceneId);
    if (!factory) {
      throw new Error(`Scene not registered: ${sceneId}`);
    }

    if (this.activeScene) {
      this.stage.removeChild(this.activeScene.container);
      this.activeScene.destroy?.();
      this.activeScene = null;
    }

    const nextScene = factory({
      goTo: (nextSceneId) => this.goTo(nextSceneId),
    });

    this.activeScene = nextScene;
    this.stage.addChild(nextScene.container);
  }

  update(deltaTime: number): void {
    this.activeScene?.update(deltaTime);
  }

  resize(width: number, height: number): void {
    this.activeScene?.resize(width, height);
  }
}
