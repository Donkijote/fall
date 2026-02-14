import type { ReworkCheckpointRepository } from "@application/repositories/ReworkCheckpointRepository";
import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { createAnimationProfile } from "@domain/value-types/AnimationProfile";

export class InMemoryReworkCheckpointRepository
  implements ReworkCheckpointRepository
{
  getCurrent(): ReworkCheckpoint {
    return {
      phase: "v1-alpha",
      animationProfile: createAnimationProfile("balanced"),
      logicObjective:
        "Rebuild logic and animation orchestration from a clean baseline",
    };
  }
}
