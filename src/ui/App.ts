import { GetCurrentReworkCheckpointUseCase } from "@application/use-cases/GetCurrentReworkCheckpointUseCase";
import { InMemoryReworkCheckpointRepository } from "@infrastructure/repositories/InMemoryReworkCheckpointRepository";
import { renderHomeScreen } from "@modules/Home/HomeScreen";

export const mountApp = (container: HTMLElement): void => {
  const repository = new InMemoryReworkCheckpointRepository();
  const useCase = new GetCurrentReworkCheckpointUseCase(repository);
  const checkpoint = useCase.execute();

  container.innerHTML = renderHomeScreen(checkpoint);
};
