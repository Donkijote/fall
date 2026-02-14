import { GetCurrentReworkCheckpoint } from "@application/use-cases/GetCurrentReworkCheckpoint";
import { InMemoryReworkCheckpointRepository } from "@infrastructure/repositories/InMemoryReworkCheckpointRepository";
import { renderHomeScreen } from "@ui/modules/home/home-screen";

export const mountApp = (container: HTMLElement): void => {
  const repository = new InMemoryReworkCheckpointRepository();
  const useCase = new GetCurrentReworkCheckpoint(repository);
  const checkpoint = useCase.execute();

  container.innerHTML = renderHomeScreen(checkpoint);
};
