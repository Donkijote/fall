import type { ReworkCheckpointRepository } from "@application/repositories/ReworkCheckpointRepository";
import { createAnimationProfile } from "@domain/value-types/AnimationProfile";

import { GetCurrentReworkCheckpointUseCase } from "./GetCurrentReworkCheckpointUseCase";

describe("GetCurrentReworkCheckpointUseCase", () => {
  it("returns data from the repository", () => {
    const repository: ReworkCheckpointRepository = {
      getCurrent: () => ({
        phase: "v1-alpha",
        animationProfile: createAnimationProfile("minimal"),
        logicObjective: "Rebuild game loop with deterministic flow",
      }),
    };

    const useCase = new GetCurrentReworkCheckpointUseCase(repository);
    const result = useCase.execute();

    expect(result.phase).toBe("v1-alpha");
  });
});
