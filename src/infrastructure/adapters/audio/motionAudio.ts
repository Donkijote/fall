import type { CaptureCue } from "@/domain/audio/captureCue";
import { createCaptureAudio } from "@/infrastructure/adapters/audio/captureAudio";
import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

/** Shared playback for the match and its approved animation studies. */
export function createMotionAudio() {
  let session:
    | {
        cards: ReturnType<typeof createCardAudio>;
        captures: ReturnType<typeof createCaptureAudio>;
      }
    | undefined;
  function getSession() {
    if (!session) {
      session = { cards: createCardAudio(), captures: createCaptureAudio() };
      session.cards.preloadDeal();
      session.cards.preloadPlay();
      session.captures.preload();
    }
    return session;
  }
  return {
    playCard: () => session?.cards.playCard(),
    playDealCard: () => session?.cards.playDealCard(),
    playCapture: (cue: CaptureCue) => session?.captures.playCapture(cue),
    preload() {
      getSession();
    },
    prepare() {
      const current = getSession();
      current.cards.unlock();
      current.captures.unlock();
    },
    stop() {
      session?.cards.stop();
      session?.captures.stop();
    },
    dispose() {
      session?.cards.dispose();
      session?.captures.dispose();
      session = undefined;
    },
  };
}
