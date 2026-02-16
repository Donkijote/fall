import { createAppRuntime } from "@application/bootstrap/AppBootstrap";
import { bootstrapSceneRouter } from "@routes/SceneRouter";
import { Application } from "pixi.js";

export const mountApp = async (container: HTMLElement): Promise<void> => {
  container.style.width = "100vw";
  container.style.height = "100vh";

  const runtime = createAppRuntime();
  const checkpoint = runtime.checkpointUseCase.execute();

  const app = new Application();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  await app.init({
    antialias: true,
    autoDensity: true,
    background: "#ffffff",
    roundPixels: true,
    resolution: pixelRatio,
    resizeTo: window,
  });
  container.replaceChildren(app.canvas);

  const sceneManager = await bootstrapSceneRouter(app, checkpoint);

  let resizeRaf: number | null = null;
  window.addEventListener("resize", () => {
    if (resizeRaf !== null) {
      cancelAnimationFrame(resizeRaf);
    }

    resizeRaf = requestAnimationFrame(() => {
      sceneManager.resize(app.screen.width, app.screen.height);
      resizeRaf = null;
    });
  });

  app.ticker.add((ticker) => {
    sceneManager.update(ticker.deltaTime);
  });
};
