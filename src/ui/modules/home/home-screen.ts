import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { PROJECT_NAME } from "@shared/constants/project";

export const renderHomeScreen = (checkpoint: ReworkCheckpoint): string => {
  return `
    <main>
      <h1>${PROJECT_NAME} - Rewrite ${checkpoint.phase}</h1>
      <p><strong>Animation profile:</strong> ${checkpoint.animationProfile.value}</p>
      <p><strong>Logic objective:</strong> ${checkpoint.logicObjective}</p>
    </main>
  `;
};
