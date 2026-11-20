import { StrictMode } from "react";
import { createMemoryRouter } from "react-router";

import {
  hasNativeOrientation,
  setNativeOrientation,
} from "@/infrastructure/adapters/platform/nativeOrientation";

import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { useNativeOrientation } from "./useNativeOrientation";

vi.mock("@/infrastructure/adapters/platform/nativeOrientation", () => ({
  hasNativeOrientation: vi.fn(() => true),
  setNativeOrientation: vi.fn(async () => {}),
}));

function makeRouter(path: string) {
  return createMemoryRouter([{ path: "*", element: null }], { initialEntries: [path] });
}

describe("useNativeOrientation", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it.each([
    ["/login", true],
    ["/login/?from=home", true],
    ["/", false],
    ["/game/tavern-7f3a", false],
    ["/credits", false],
  ])("applies the policy for a direct link to %s", async (path, allowPortrait) => {
    const router = makeRouter(path);
    renderHook(() => useNativeOrientation(router));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledWith(allowPortrait));
    router.dispose();
  });

  it("locks after leaving Login and unlocks when returning", async () => {
    const router = makeRouter("/login");
    renderHook(() => useNativeOrientation(router));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenLastCalledWith(true));
    await act(() => router.navigate("/"));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenLastCalledWith(false));
    await act(() => router.navigate("/login"));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenLastCalledWith(true));
    router.dispose();
  });

  it("reapplies on foreground and removes its listeners on unmount", async () => {
    const router = makeRouter("/game/tavern-7f3a");
    const { unmount } = renderHook(() => useNativeOrientation(router));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(1));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(setNativeOrientation).toHaveBeenCalledTimes(1);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(2));
    unmount();
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await act(() => router.navigate("/login"));
    expect(setNativeOrientation).toHaveBeenCalledTimes(2);
    router.dispose();
  });

  it("keeps the final route when navigation races an in-flight native request", async () => {
    let finish!: () => void;
    vi.mocked(setNativeOrientation).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const router = makeRouter("/login");
    renderHook(() => useNativeOrientation(router));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(1));
    await act(() => router.navigate("/"));
    await act(() => router.navigate("/login"));
    await act(async () => finish());
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(2));
    expect(setNativeOrientation).toHaveBeenLastCalledWith(true);
    router.dispose();
  });

  it("survives StrictMode effect replay without duplicate native requests", async () => {
    const router = makeRouter("/");
    renderHook(() => useNativeOrientation(router), { wrapper: StrictMode });
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(1));
    router.dispose();
  });

  it("reports failure and retries on the next foreground event", async () => {
    vi.mocked(setNativeOrientation).mockRejectedValueOnce(new Error("scene not ready"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const router = makeRouter("/");
    renderHook(() => useNativeOrientation(router));
    await waitFor(() =>
      expect(error).toHaveBeenCalledWith("Native orientation update failed", expect.any(Error)),
    );
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await waitFor(() => expect(setNativeOrientation).toHaveBeenCalledTimes(2));
    router.dispose();
  });

  it("leaves browser orientation alone", async () => {
    vi.mocked(hasNativeOrientation).mockReturnValueOnce(false);
    const router = makeRouter("/");
    renderHook(() => useNativeOrientation(router));
    await act(() => router.navigate("/login"));
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(setNativeOrientation).not.toHaveBeenCalled();
    router.dispose();
  });
});
