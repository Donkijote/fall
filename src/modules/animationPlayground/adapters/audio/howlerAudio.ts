import { Howl } from "howler";

import emberSound from "@/assets/audio/ember.wav";
import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

import type { AudioPort } from "../../application/lab";

export function createHowlerAudio(): AudioPort & { preloadDeal: () => void; dispose: () => void } {
  const cards = createCardAudio();
  let sound: Howl | undefined;

  return {
    ...cards,
    play() {
      sound ??= new Howl({ src: [emberSound], volume: 0.42 });
      sound.stop();
      sound.play();
    },
    dispose() {
      sound?.unload();
      sound = undefined;
      cards.dispose();
    },
  };
}
