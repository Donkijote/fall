import { create } from "zustand";

import { createUIGameStoreService } from "@/application/services/UIGameStoreService";
import type { UIGameStore, UIState } from "@/domain/entities/UI";

export const initialUIState: UIState = {
  playingCard: null,
  captureOverride: null,
  cascadeFollowers: [],
};

export const useUIGameStore = create<UIGameStore>((set, get) => {
  const setState = (next: UIState) => set({ state: next });
  const service = createUIGameStoreService(() => get().state, setState);

  return {
    state: initialUIState,
    service,
  };
});
