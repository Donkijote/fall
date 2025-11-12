import { useUIGameStoreService } from "@/application/hooks/useUIGameStoreService";

import { act, renderHook } from "@testing-library/react";

const { uiStore, fns } = vi.hoisted(() => {
  const fns = {
    clearUI: vi.fn(),
    setPlayingCard: vi.fn(),
    setCaptureOverride: vi.fn(),
    addCascadeFollower: vi.fn(),
  };
  return {
    fns,
    uiStore: {
      service: { ...fns },
    },
  };
});

vi.mock("@/application/store/uiGameStore", () => ({
  useUIGameStore: (selector: (s: typeof uiStore) => void) => selector(uiStore),
}));

describe("useUIGameStoreService", () => {
  beforeEach(() => {
    Object.values(fns).forEach((fn) => fn.mockClear());
    uiStore.service = { ...fns };
  });

  it("returns current service from the store", () => {
    const { result } = renderHook(() => useUIGameStoreService());
    expect(Object.keys(result.current)).toEqual([
      "clearUI",
      "setPlayingCard",
      "setCaptureOverride",
      "addCascadeFollower",
    ]);
  });

  it("keeps referential equality when the service object does not change", () => {
    const { result, rerender } = renderHook(() => useUIGameStoreService());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("updates when the service object changes", () => {
    const { result, rerender } = renderHook(() => useUIGameStoreService());
    const firstRef = result.current;

    uiStore.service = {
      clearUI: vi.fn(),
      setPlayingCard: vi.fn(),
      setCaptureOverride: vi.fn(),
      addCascadeFollower: vi.fn(),
    };

    rerender();
    expect(result.current).not.toBe(firstRef);
  });

  it("proxies calls to underlying service functions", () => {
    const { result } = renderHook(() => useUIGameStoreService());

    act(() => {
      result.current.clearUI();
      result.current.setPlayingCard({ suit: "coins", rank: 3 });
      result.current.setCaptureOverride({
        fromKey: "coins-1",
        toKey: "coins-2",
      });
      result.current.addCascadeFollower("coins-3");
    });

    expect(fns.clearUI).toHaveBeenCalledTimes(1);
    expect(fns.setPlayingCard).toHaveBeenCalledWith({ suit: "coins", rank: 3 });
    expect(fns.setCaptureOverride).toHaveBeenCalledWith({
      fromKey: "coins-1",
      toKey: "coins-2",
    });
    expect(fns.addCascadeFollower).toHaveBeenCalledWith("coins-3");
  });
});
