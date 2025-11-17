import { useNavigate } from "react-router";
import type { Mock } from "vitest";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";

import { act, renderHook } from "@testing-library/react";

import { useMatchEnd } from "./useMatchEnd";

vi.mock("react-router", () => {
  const navigate = vi.fn();
  return {
    useNavigate: () => navigate,
  };
});

const resetGameState = vi.fn();
const setupGame = vi.fn().mockResolvedValue({});

vi.mock("@/application/hooks/useGameStoreService", () => {
  return {
    useGameStoreService: vi.fn(() => ({
      resetGameState,
      setupGame,
    })),
  };
});

vi.mock("@/application/hooks/useGameStoreState", () => {
  return {
    useGameStoreState: vi.fn(() => ({
      phase: "gameOver",
      players: [
        { id: "p1", team: 1 },
        { id: "p2", team: 2 },
      ],
      mainPlayer: "p1",
      scores: { values: { "1": 24, "2": 10 } },
    })),
  };
});

vi.mock("@/routes/Routes", () => {
  return { HOME_PATH: "/home" };
});

const getNavigate = () =>
  (useNavigate as unknown as () => ReturnType<typeof vi.fn>)();

const setStateMock = (state: Partial<ReturnType<typeof useGameStoreState>>) => {
  (useGameStoreState as Mock).mockReturnValue({
    phase: "gameOver",
    players: [
      { id: "p1", team: 1 },
      { id: "p2", team: 2 },
    ],
    mainPlayer: "p1",
    scores: { values: { "1": 24, "2": 10 } },
    ...state,
  });
};

describe("useMatchEnd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setStateMock({});
  });

  it('exposes isFinished based on phase === "gameOver"', () => {
    setStateMock({ phase: "gameOver" });
    const { result, unmount } = renderHook(() => useMatchEnd());
    expect(result.current.isFinished).toBe(true);
    unmount();

    setStateMock({ phase: "playing" as never });
    const { result: result2 } = renderHook(() => useMatchEnd());
    expect(result2.current.isFinished).toBe(false);
  });

  it("computes currentGameMode via players.length (1v1, 1v2, 2v2) through onReplay()", () => {
    // 1v1 -> length 2
    let { result, unmount } = renderHook(() => useMatchEnd());

    act(() => result.current.onReplay());
    expect(resetGameState).toHaveBeenCalled();
    expect(setupGame).toHaveBeenCalledWith("p1", "1vs1");
    unmount();

    // 1v2 -> length 3
    setStateMock({
      players: [
        { id: "p1", team: 1, hand: [], collected: [], score: 0 },
        { id: "p2", team: 1, hand: [], collected: [], score: 0 },
        { id: "3", team: 1, hand: [], collected: [], score: 0 },
      ],
      mainPlayer: "p1",
    });
    ({ result, unmount } = renderHook(() => useMatchEnd()));

    act(() => result.current.onReplay());
    expect(setupGame).toHaveBeenCalledWith("p1", "1vs2");
    unmount();

    // 2v2 -> length 4
    setStateMock({
      players: [
        { id: "p1", team: 1, hand: [], collected: [], score: 0 },
        { id: "p2", team: 1, hand: [], collected: [], score: 0 },
        { id: "p3", team: 1, hand: [], collected: [], score: 0 },
        { id: "p4", team: 1, hand: [], collected: [], score: 0 },
      ],
      mainPlayer: "p1",
    });
    ({ result, unmount } = renderHook(() => useMatchEnd()));

    act(() => result.current.onReplay());
    expect(setupGame).toHaveBeenCalledWith("p1", "2vs2");
    unmount();
  });

  it("returns gameResult=null when not finished; win if mainPlayer >= 24; else lose", () => {
    // not finished -> null
    setStateMock({ phase: "playing" as never });
    let { result, unmount } = renderHook(() => useMatchEnd());
    expect(result.current.gameResult).toBeNull();
    unmount();

    // finished + win
    setStateMock({
      phase: "gameOver",
      mainPlayer: "p1",
      scores: { type: "individual", values: { "1": 24, "2": 0 } },
    });
    ({ result, unmount } = renderHook(() => useMatchEnd()));
    expect(result.current.gameResult).toBe("win");
    unmount();

    // finished + lose
    setStateMock({
      phase: "gameOver",
      mainPlayer: "p1",
      scores: { type: "individual", values: { p1: 23, p2: 24 } },
    });
    ({ result } = renderHook(() => useMatchEnd()));
    expect(result.current.gameResult).toBe("lose");
  });

  it('builds stats.teamScore as joined " - " of score values', () => {
    setStateMock({
      scores: { values: { p1: 11, p2: 22, p3: 5 }, type: "individual" },
    });
    const { result } = renderHook(() => useMatchEnd());
    expect(result.current.stats.teamScore).toBe("11 - 22 - 5");
  });

  it("onExit navigates to HOME_PATH and resets game state", () => {
    const { result } = renderHook(() => useMatchEnd());
    const navigate = getNavigate();

    act(() => result.current.onExit());
    expect(navigate).toHaveBeenCalledWith("/home");
    expect(resetGameState).toHaveBeenCalledTimes(1);
  });

  it("onNewGame navigates to HOME_PATH with bottomSidebar=true and resets", () => {
    const { result } = renderHook(() => useMatchEnd());
    const navigate = getNavigate();

    act(() => result.current.onNewGame());
    expect(navigate).toHaveBeenCalledWith("/home?bottomSidebar=true");
    expect(resetGameState).toHaveBeenCalledTimes(1);
  });

  it("onReplay resets then setupGame(mainPlayer, currentGameMode)", () => {
    setStateMock({
      mainPlayer: "a",
      players: [
        { id: "a", team: 1, hand: [], collected: [], score: 0 },
        { id: "b", team: 1, hand: [], collected: [], score: 0 },
        { id: "c", team: 1, hand: [], collected: [], score: 0 },
        { id: "d", team: 1, hand: [], collected: [], score: 0 },
      ], // 2vs2
      phase: "gameOver",
    });
    const { result } = renderHook(() => useMatchEnd());

    act(() => result.current.onReplay());
    expect(resetGameState).toHaveBeenCalledTimes(1);
    expect(setupGame).toHaveBeenCalledWith("a", "2vs2");
  });

  it("adds keydown listener only when finished; cleans up on unmount", () => {
    // finished: listener added
    setStateMock({ phase: "gameOver" });
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useMatchEnd());
    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("keyboard: Escape -> onExit, r/R -> onReplay, n/N -> onNewGame (when finished)", () => {
    setStateMock({ phase: "gameOver" });
    renderHook(() => useMatchEnd());
    const navigate = getNavigate();

    const fire = (key: string) =>
      window.dispatchEvent(new KeyboardEvent("keydown", { key }));

    act(() => fire("Escape"));
    expect(navigate).toHaveBeenCalledWith("/home"); // onExit
    (navigate as Mock).mockClear();

    act(() => fire("r"));
    expect(resetGameState).toHaveBeenCalledTimes(2); // Exit + Replay
    expect(setupGame).toHaveBeenCalledTimes(1);

    act(() => fire("R"));
    expect(setupGame).toHaveBeenCalledTimes(2);

    act(() => fire("n"));
    expect(navigate).toHaveBeenCalledWith("/home?bottomSidebar=true");

    act(() => fire("N"));
    expect(navigate).toHaveBeenCalledWith("/home?bottomSidebar=true");
  });

  it("does NOT add keydown listener when not finished", () => {
    setStateMock({ phase: "playing" as never });
    const addSpy = vi.spyOn(window, "addEventListener");

    const { rerender } = renderHook(() => useMatchEnd());
    expect(addSpy).not.toHaveBeenCalledWith("keydown", expect.any(Function));

    setStateMock({ phase: "gameOver" as never });

    rerender();

    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
