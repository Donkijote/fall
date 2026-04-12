import type { PersistedStore } from "@modules/AnimationLab/AnimationLabTypes";

const STORAGE_KEY = "fall.animation-lab.v1";

export const readAnimationLabStore = (): PersistedStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as PersistedStore;
  } catch {
    return {};
  }
};

export const writeAnimationLabStore = (store: PersistedStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore quota or private-mode failures in dev tools.
  }
};
