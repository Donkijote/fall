import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { toAnimationProfileName } from "@domain/value-types/AnimationProfile";
import { PROJECT_NAME } from "@shared/constants/project";

export const renderHomeScreen = (checkpoint: ReworkCheckpoint): string => {
  return `
    <main>
      <h1>${PROJECT_NAME} - Rewrite ${checkpoint.phase}</h1>
      <p><strong>Animation profile:</strong> ${toAnimationProfileName(checkpoint.animationProfile)}</p>
      <p><strong>Logic objective:</strong> ${checkpoint.logicObjective}</p>
    </main>
  `;
};
