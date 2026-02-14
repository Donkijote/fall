import type { ReworkCheckpoint } from "@domain/entities/ReworkCheckpoint";

export interface ReworkCheckpointRepository {
  getCurrent(): ReworkCheckpoint;
}
