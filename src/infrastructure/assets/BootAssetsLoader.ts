import { Assets } from "pixi.js";

const bootAssetSources: string[] = [];

export const loadBootAssets = async (
  onProgress: (value: number) => void,
): Promise<void> => {
  if (bootAssetSources.length === 0) {
    onProgress(1);
    return;
  }

  await Assets.load(bootAssetSources, (progress) => {
    onProgress(progress);
  });
};
