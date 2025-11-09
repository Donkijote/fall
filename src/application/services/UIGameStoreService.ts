import { initialUIState } from "@/application/store/uiGameStore";
import type { UIGameStoreService, UIState } from "@/domain/entities/UI";

export const createUIGameStoreService = (
  getState: () => UIState,
  setState: (next: UIState) => void,
): UIGameStoreService => ({
  setPlayingCard(card) {
    const state = getState();
    setState({ ...state, playingCard: card });
  },
  setCaptureOverride(override) {
    const state = getState();
    setState({ ...state, captureOverride: override });
  },
  clearUI() {
    setState({ ...initialUIState });
  },
});
