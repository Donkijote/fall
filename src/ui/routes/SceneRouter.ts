import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { loadBootAssets } from "@infrastructure/assets/BootAssetsLoader";
import { createAnimationLabScene } from "@modules/AnimationLab/AnimationLabScene";
import { createArenaScene } from "@modules/Arena/ArenaScene";
import { createHomeScene } from "@modules/home/HomeScene";
import { createLoadingOverlay } from "@modules/Loading/LoadingOverlay";
import { createDevLastScenePersistence } from "@routes/DevLastScenePersistence";
import type { SceneManager } from "@ui/state/SceneManager";
import { createSceneManager } from "@ui/state/SceneManager";
import type { Application } from "pixi.js";

export const bootstrapSceneRouter = async (
  app: Application,
  checkpoint: ReworkCheckpoint,
): Promise<SceneManager> => {
  const loadingOverlay = createLoadingOverlay(
    app.screen.width,
    app.screen.height,
  );
  app.stage.addChild(loadingOverlay.container);

  await loadBootAssets((progress) => {
    loadingOverlay.setProgress(progress);
  });

  app.stage.removeChild(loadingOverlay.container);
  loadingOverlay.container.destroy({ children: true });

  const isDevMode = import.meta.env.DEV;
  const devLastScenePersistence = createDevLastScenePersistence();
  const sceneManager = createSceneManager(app.stage, {
    onSceneChange: isDevMode
      ? devLastScenePersistence.onSceneChange
      : undefined,
  });
  const registeredSceneIds = new Set<string>();
  const registerScene = (
    sceneId: string,
    factory: Parameters<SceneManager["register"]>[1],
  ): void => {
    registeredSceneIds.add(sceneId);
    sceneManager.register(sceneId, factory);
  };

  registerScene("home", (context) => {
    return createHomeScene(
      checkpoint,
      app.screen.width,
      app.screen.height,
      context,
      isDevMode,
    );
  });
  registerScene("arena", (context) => {
    return createArenaScene(app.screen.width, app.screen.height, context);
  });
  if (isDevMode) {
    registerScene("animation-lab", (context) => {
      return createAnimationLabScene(
        app.screen.width,
        app.screen.height,
        context,
      );
    });
  }

  const initialSceneId = isDevMode
    ? devLastScenePersistence.readInitialSceneId(registeredSceneIds, "home")
    : "home";
  sceneManager.goTo(initialSceneId);

  return sceneManager;
};
