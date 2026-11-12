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
    return () => {
      audio.current = null;
      session.dispose();
    };
  }, [enabled]);

  return audio;
}
