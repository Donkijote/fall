import { useUIGameStoreState } from "@/application/hooks/useUIGameStoreState";

import { renderHook } from "@testing-library/react";

const { uiStore } = vi.hoisted(() => ({
  uiStore: {
    state: {
      playingCard: null as null | { suit: string; rank: number },
      captureOverride: null as null | { fromKey: string; toKey: string },
      cascadeFollowers: [] as string[],
    },
  },
}));

vi.mock("@/application/store/uiGameStore", () => ({
  useUIGameStore: (selector: (s: typeof uiStore) => void) => selector(uiStore),
}));

describe("useUIGameStoreState", () => {
  beforeEach(() => {
    uiStore.state = {
      playingCard: null,
      captureOverride: null,
      cascadeFollowers: [],
    };
  });

  it("returns current UI state from the store", () => {
    const { result } = renderHook(() => useUIGameStoreState());
    expect(result.current).toEqual({
      playingCard: null,
      captureOverride: null,
      cascadeFollowers: [],
    });
  });

  it("keeps referential equality when the store state object does not change", () => {
    const { result, rerender } = renderHook(() => useUIGameStoreState());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("updates when the store state object changes", () => {
    const { result, rerender } = renderHook(() => useUIGameStoreState());
    expect(result.current.playingCard).toBeNull();

    uiStore.state = {
      playingCard: { suit: "coins", rank: 7 },
      captureOverride: { fromKey: "coins-1", toKey: "coins-2" },
      cascadeFollowers: ["coins-3"],
    };

    rerender();

    expect(result.current).toEqual({
      playingCard: { suit: "coins", rank: 7 },
      captureOverride: { fromKey: "coins-1", toKey: "coins-2" },
      cascadeFollowers: ["coins-3"],
    });
  });
});
