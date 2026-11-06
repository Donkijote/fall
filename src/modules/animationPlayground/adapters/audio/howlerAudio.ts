import { Howl } from "howler";

import type { AudioPort } from "../../application/lab";
import dealCardSound from "../../assets/deal-card.mp3";
import emberSound from "../../assets/ember.wav";

export function createHowlerAudio(): AudioPort & { preloadDeal: () => void; dispose: () => void } {
  let sound: Howl | undefined;
  let dealSound: Howl | undefined;
  function getDealSound() {
    return (dealSound ??= new Howl({ src: [dealCardSound], volume: 0.48 }));
  }

  return {
    preloadDeal() {
      getDealSound();
    },
    playDealCard() {
      getDealSound().play();
    },
    play() {
      sound ??= new Howl({ src: [emberSound], volume: 0.42 });
      sound.stop();
      sound.play();
    },
    dispose() {
      sound?.unload();
      sound = undefined;
      dealSound?.unload();
      dealSound = undefined;
    },
  };
}
