import type { ReworkCheckpointRepository } from "@application/ports/ReworkCheckpointRepository";
import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";
import { AnimationProfile } from "@domain/value-objects/AnimationProfile";

export class InMemoryReworkCheckpointRepository
  implements ReworkCheckpointRepository
{
  getCurrent(): ReworkCheckpoint {
    return {
      phase: "v1-alpha",
      animationProfile: AnimationProfile.create("balanced"),
      logicObjective:
        "Rebuild logic and animation orchestration from a clean baseline",
    };
  }
}
