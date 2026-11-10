import { useEffect, useState } from "react";

import { useReducedMotion } from "./useGamePreferences";

type DataConnection = EventTarget & { saveData?: boolean };

export function useAtmospherePreferences() {
  const reducedMotion = useReducedMotion();
  const [preferences, setPreferences] = useState({ animate: false, compact: true, visible: true });

  useEffect(() => {
    if (!window.matchMedia) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    const update = () => {
      setPreferences({
        animate:
          !motion.matches &&
          !connection?.saveData &&
          typeof window.WebGL2RenderingContext !== "undefined",
        compact: compact.matches,
        visible: !document.hidden,
      });
    };
    update();
    motion.addEventListener("change", update);
    compact.addEventListener("change", update);
    connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      motion.removeEventListener("change", update);
      compact.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return { ...preferences, animate: preferences.animate && !reducedMotion };
}
