import { initialUIState } from "@/application/store/uiGameStore";
import type { CardKey } from "@/domain/entities/Card";
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
  addCascadeFollower(key: CardKey) {
    const state = getState();
    if (state.cascadeFollowers.includes(key)) return;
    setState({ ...state, cascadeFollowers: [...state.cascadeFollowers, key] });
  },
  clearUI() {
    setState({ ...initialUIState });
  },
});
