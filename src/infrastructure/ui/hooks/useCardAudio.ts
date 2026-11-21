import { useEffect, useRef } from "react";

import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

export function useCardAudio(enabled = true) {
  const audio = useRef<ReturnType<typeof createCardAudio> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const session = createCardAudio();
    audio.current = session;
    session.preloadDeal();
    session.preloadPlay();
    const unlock = () => session.unlock();
    const onVisibility = () => {
      if (document.visibilityState === "visible") unlock();
      else session.stop();
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", onVisibility);
      audio.current = null;
      session.dispose();
    };
  }, [enabled]);

  return audio;
}
