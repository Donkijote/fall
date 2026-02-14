import { GetCurrentReworkCheckpointUseCase } from "@application/use-cases/GetCurrentReworkCheckpointUseCase";
import { InMemoryReworkCheckpointRepository } from "@infrastructure/repositories/InMemoryReworkCheckpointRepository";

export interface AppRuntime {
  checkpointUseCase: GetCurrentReworkCheckpointUseCase;
}

export const createAppRuntime = (): AppRuntime => {
  const reworkCheckpointRepository = new InMemoryReworkCheckpointRepository();

  return {
    checkpointUseCase: new GetCurrentReworkCheckpointUseCase(
      reworkCheckpointRepository,
    ),
  };
};
