import { Assets } from "pixi.js";

const bootAssetSources: Array<{ alias: string; src: string }> = [
  {
    alias: "home-decor-arena",
    src: "/assets/home/Arena.webp",
  },
  {
    alias: "home-decor-doors",
    src: "/assets/home/Doors.webp",
  },
  {
    alias: "home-decor-tavern",
    src: "/assets/home/Tavern.webp",
  },
  {
    alias: "home-decor-tower",
    src: "/assets/home/Tower.webp",
  },
];

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
