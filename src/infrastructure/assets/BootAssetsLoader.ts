import { Assets } from "pixi.js";

const bootAssetSources: Array<{ alias: string; src: string }> = [
  {
    alias: "home-bg-dawn",
    src: "/assets/lobby/background-dawn.png",
  },
  {
    alias: "home-bg-noon",
    src: "/assets/lobby/background-noon.png",
  },
  {
    alias: "home-bg-afternoon",
    src: "/assets/lobby/background-afternoon.png",
  },
  {
    alias: "home-bg-evening",
    src: "/assets/lobby/background-evening.png",
  },
  {
    alias: "home-bg-night",
    src: "/assets/lobby/background-night.png",
  },
];

export const loadBootAssets = async (
  onProgress: (value: number) => void,
): Promise<void> => {
  const totalAssets = bootAssetSources.length;
  if (totalAssets === 0) {
    onProgress(1);
    return;
  }

  let loadedAssets = 0;
  for (const source of bootAssetSources) {
    try {
      await Assets.load(source);
    } catch (error) {
      console.warn(`Failed to load asset alias "${source.alias}"`, error);
    } finally {
      loadedAssets += 1;
      onProgress(loadedAssets / totalAssets);
    }
  }
};
