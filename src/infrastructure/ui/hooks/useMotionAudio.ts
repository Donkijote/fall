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
