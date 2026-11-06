import { Howl } from "howler";

import dealCardSound from "@/assets/cards/deal-card.mp3";
import playCardSound from "@/assets/cards/play-card.mp3";

export function createCardAudio() {
  let deal: Howl | undefined;
  let play: Howl | undefined;

  function getDeal() {
    return (deal ??= new Howl({ src: [dealCardSound], volume: 0.48 }));
  }

  return {
    preloadDeal() {
      getDeal();
    },
    playDealCard() {
      getDeal().play();
    },
    playCard() {
      play ??= new Howl({ src: [playCardSound], volume: 0.48 });
      play.play();
    },
    dispose() {
      deal?.unload();
      play?.unload();
      deal = undefined;
      play = undefined;
    },
  };
}
