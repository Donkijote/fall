export type GamePreferences = {
  volume: number;
  muted: boolean;
  motion: "system" | "reduced";
};

export const defaultGamePreferences: GamePreferences = {
  volume: 0.48,
  muted: false,
  motion: "system",
};

const storageKey = "fall-preferences";
const listeners = new Set<() => void>();
let fallback: string | null = null;
let storageUnavailable = false;

export function getPreferencesSnapshot(): string | null {
  try {
    return storageUnavailable ? fallback : localStorage.getItem(storageKey);
  } catch {
    return fallback;
  }
}

export function readGamePreferences(raw = getPreferencesSnapshot()): GamePreferences {
  try {
    const value = JSON.parse(raw ?? "{}");
    return {
      volume:
        typeof value?.volume === "number" && Number.isFinite(value.volume)
          ? Math.min(1, Math.max(0, value.volume))
          : defaultGamePreferences.volume,
      muted: typeof value?.muted === "boolean" ? value.muted : defaultGamePreferences.muted,
      motion: value?.motion === "reduced" ? "reduced" : "system",
    };
  } catch {
    return { ...defaultGamePreferences };
  }
}

export function updateGamePreferences(patch: Partial<GamePreferences>) {
  fallback = JSON.stringify({ ...readGamePreferences(), ...patch });
  try {
    localStorage.setItem(storageKey, fallback);
    storageUnavailable = false;
  } catch {
    storageUnavailable = true;
  }
  listeners.forEach((listener) => listener());
}

export function resetGamePreferences() {
  updateGamePreferences(defaultGamePreferences);
}

export function subscribeGamePreferences(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
