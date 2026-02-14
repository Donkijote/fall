import type { ReworkCheckpointRepository } from "@application/ports/ReworkCheckpointRepository";
import { GetCurrentReworkCheckpoint } from "@application/use-cases/GetCurrentReworkCheckpoint";
import { AnimationProfile } from "@domain/value-objects/AnimationProfile";

describe("GetCurrentReworkCheckpoint", () => {
  it("returns data from the repository", () => {
    const repository: ReworkCheckpointRepository = {
      getCurrent: () => ({
        phase: "v1-alpha",
        animationProfile: AnimationProfile.create("minimal"),
        logicObjective: "Rebuild game loop with deterministic flow",
      }),
    };

    const useCase = new GetCurrentReworkCheckpoint(repository);
    const result = useCase.execute();

    expect(result.phase).toBe("v1-alpha");
    expect(result.animationProfile.value).toBe("minimal");
  });
});
