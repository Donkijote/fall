import { initialUIState, useUIGameStore } from "@/application/store/uiGameStore";

import { cleanup, renderHook } from "@testing-library/react";

import { useAnimationLayer } from "./useAnimationLayer";

const audio = vi.hoisted(() => ({ playCard: vi.fn(), dispose: vi.fn() }));
vi.mock("@/infrastructure/adapters/audio/cardAudio", () => ({ createCardAudio: () => audio }));

beforeEach(() => {
  vi.clearAllMocks();
  useUIGameStore.setState({ state: initialUIState });
});
afterEach(cleanup);

it("plays once for each played card and stays silent during cascade movement and UI clearing", () => {
  renderHook(useAnimationLayer);
  const service = useUIGameStore.getState().service;
  service.setPlayingCard({ suit: "coins", rank: 1 });
  expect(audio.playCard).toHaveBeenCalledTimes(1);
  service.setCaptureOverride({ fromKey: "coins-1", toKey: "cups-1" });
  service.addCascadeFollower("cups-1");
  service.setCaptureOverride({ fromKey: "coins-1", toKey: "swords-2" });
  service.clearUI();
  expect(audio.playCard).toHaveBeenCalledTimes(1);
  service.setPlayingCard({ suit: "swords", rank: 3 });
  expect(audio.playCard).toHaveBeenCalledTimes(2);
});

it("unsubscribes and releases the audio when the game leaves the screen", () => {
  const { unmount } = renderHook(useAnimationLayer);
  expect(audio.playCard).not.toHaveBeenCalled();
  unmount();
  expect(audio.dispose).toHaveBeenCalledOnce();
  useUIGameStore.getState().service.setPlayingCard({ suit: "cups", rank: 7 });
  expect(audio.playCard).not.toHaveBeenCalled();
});
