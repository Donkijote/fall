import { useEffect, useState, useSyncExternalStore } from "react";

import {
  getPreferencesSnapshot,
  readGamePreferences,
  subscribeGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";

export function useGamePreferences() {
  const raw = useSyncExternalStore(subscribeGamePreferences, getPreferencesSnapshot, () => null);
  return readGamePreferences(raw);
}

export function useReducedMotion() {
  const { motion } = useGamePreferences();
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return motion === "reduced" || systemReduced;
}
