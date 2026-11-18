import { useLayoutEffect, useRef } from "react";

import { createMotionAudio } from "@/infrastructure/adapters/audio/motionAudio";

/** Prepare before motion layout effects, and unlock inside the next user gesture. */
export function useMotionAudio(enabled = true) {
  const audio = useRef<ReturnType<typeof createMotionAudio> | null>(null);
  useLayoutEffect(() => {
    if (!enabled) return;
    const session = createMotionAudio();
    audio.current = session;
    session.preload();
    const unlock = () => session.prepare();
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      audio.current = null;
      session.dispose();
    };
  }, [enabled]);
  return audio;
}
