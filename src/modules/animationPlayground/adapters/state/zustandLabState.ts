import { createStore } from "zustand/vanilla";

import { initialLabState } from "../../application/lab";
import type { LabState, LabStatePort } from "../../application/lab";

export function createZustandLabState(): LabStatePort {
  const store = createStore<LabState>(() => initialLabState);
  return {
    getState: store.getState,
    subscribe: store.subscribe,
    update: (transition) => store.setState(transition, true),
  };
}
