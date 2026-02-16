import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { loadBootAssets } from "@infrastructure/assets/BootAssetsLoader";
import { createArenaScene } from "@modules/Arena/ArenaScene";
import { createHomeScene } from "@modules/home/HomeScene";
import { createLoadingOverlay } from "@modules/Loading/LoadingOverlay";
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

  const sceneManager = createSceneManager(app.stage);
  sceneManager.register("home", (context) => {
    return createHomeScene(
      checkpoint,
      app.screen.width,
      app.screen.height,
      context,
    );
  });
  sceneManager.register("arena", (context) => {
    return createArenaScene(app.screen.width, app.screen.height, context);
  });
  sceneManager.goTo("home");

  return sceneManager;
};
