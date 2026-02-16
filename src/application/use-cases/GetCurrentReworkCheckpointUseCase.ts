import type { ReworkCheckpointRepository } from "@application/repositories/ReworkCheckpointRepository";
import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";

export class GetCurrentReworkCheckpointUseCase {
  private readonly repository: ReworkCheckpointRepository;

  constructor(repository: ReworkCheckpointRepository) {
    this.repository = repository;
  }

  execute(): ReworkCheckpoint {
    return this.repository.getCurrent();
  }
}
