import type { Mock } from "vitest";

import { renderHook } from "@testing-library/react";

import { useGameStore } from "../store/gameStore";
import { useGameStoreService } from "./useGameStoreService";

vi.mock("../store/gameStore", () => ({
  useGameStore: vi.fn(),
}));

const typedUseGameStore = useGameStore as unknown as Mock;

describe("useGameStoreService", () => {
  beforeEach(() => {
    typedUseGameStore.mockReset();
  });

  it("returns the service selected by the selector", () => {
    const mockService = { startGame: vi.fn(), playCard: vi.fn() };
    typedUseGameStore.mockImplementation(
      (selector: (s: { service: typeof mockService }) => typeof mockService) =>
        selector({ service: mockService }),
    );

    const { result } = renderHook(() => useGameStoreService());

    expect(result.current).toBe(mockService);
    expect(typeof typedUseGameStore.mock.calls[0][0]).toBe("function");
  });

  it("updates when the underlying store service changes", () => {
    const firstService = { playCard: vi.fn() };
    const updatedService = { resetGameState: vi.fn() };

    typedUseGameStore
      .mockImplementationOnce(
        (
          selector: (s: {
            service: typeof firstService;
          }) => typeof firstService,
        ) => selector({ service: firstService }),
      )
      .mockImplementationOnce(
        (
          selector: (s: {
            service: typeof updatedService;
          }) => typeof updatedService,
        ) => selector({ service: updatedService }),
      );

    const { result, rerender } = renderHook(() => useGameStoreService());

    expect(result.current).toBe(firstService);

    rerender();

    expect(result.current).toBe(updatedService);
    expect(typedUseGameStore).toHaveBeenCalledTimes(2);
  });
});
