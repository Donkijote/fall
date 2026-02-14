import type { ReworkCheckpointRepository } from "@application/ports/ReworkCheckpointRepository";
import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";

export class GetCurrentReworkCheckpoint {
  private readonly repository: ReworkCheckpointRepository;

  constructor(repository: ReworkCheckpointRepository) {
    this.repository = repository;
  }

  execute(): ReworkCheckpoint {
    return this.repository.getCurrent();
  }
}
