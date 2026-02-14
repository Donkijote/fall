import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { loadBootAssets } from "@infrastructure/assets/BootAssetsLoader";
import { createArenaScene } from "@modules/Arena/ArenaScene";
import { createHomeScene } from "@modules/Home/HomeScene";
import { createLoadingOverlay } from "@modules/Loading/LoadingOverlay";
import { SceneManager } from "@ui/state/SceneManager";
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

  const sceneManager = new SceneManager(app.stage);
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
