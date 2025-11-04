import type { Mock } from "vitest";

import type { GameState } from "@/domain/entities/GameState";

import { renderHook } from "@testing-library/react";

import { useGameStore } from "../store/gameStore";
import { useGameStoreState } from "./useGameStoreState";

vi.mock("../store/gameStore", () => ({
  useGameStore: vi.fn(),
}));

const typedUseGameStore = useGameStore as unknown as Mock;

describe("useGameStoreState", () => {
  beforeEach(() => {
    typedUseGameStore.mockReset();
  });

  it("returns the state selected by the selector", () => {
    const firstSelectedState = { phase: "init" } as GameState;
    typedUseGameStore.mockImplementation(
      (selector: (s: { state: Partial<GameState> }) => Partial<GameState>) =>
        selector({ state: firstSelectedState }),
    );

    const { result } = renderHook(() => useGameStoreState());

    expect(result.current).toEqual(firstSelectedState);
    expect(typeof typedUseGameStore.mock.calls[0][0]).toBe("function");
  });

  it("updates when the underlying store state changes", () => {
    const initialSelectedState = { phase: "deal" } as GameState;
    const nextSelectedState = { phase: "chooseDealer" } as GameState;

    typedUseGameStore
      .mockImplementationOnce(
        (selector: (s: { state: Partial<GameState> }) => Partial<GameState>) =>
          selector({ state: initialSelectedState }),
      )
      .mockImplementationOnce(
        (selector: (s: { state: Partial<GameState> }) => Partial<GameState>) =>
          selector({ state: nextSelectedState }),
      );

    const { result, rerender } = renderHook(() => useGameStoreState());

    expect(result.current).toEqual(initialSelectedState);

    rerender();

    expect(result.current).toEqual(nextSelectedState);
    expect(typedUseGameStore).toHaveBeenCalledTimes(2);
  });
});
