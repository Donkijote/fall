import type { CaptureCue } from "@/domain/audio/captureCue";
import { createCaptureAudio } from "@/infrastructure/adapters/audio/captureAudio";
import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

/** Lazily own one audition session, created within the Play user gesture. */
export function createHowlerAudio() {
  let session:
    | {
        cards: ReturnType<typeof createCardAudio>;
        captures: ReturnType<typeof createCaptureAudio>;
      }
    | undefined;
  return {
    playCard: () => session?.cards.playCard(),
    playDealCard: () => session?.cards.playDealCard(),
    playCapture: (cue: CaptureCue) => session?.captures.playCapture(cue),
    prepare() {
      session ??= { cards: createCardAudio(), captures: createCaptureAudio() };
      session.cards.unlock();
      session.captures.unlock();
      session.captures.preload();
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
