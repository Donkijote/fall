import { Howl } from "howler";

import dealCardSound from "@/assets/cards/deal-card.mp3";
import playCardSound from "@/assets/cards/play-card.mp3";
import {
  readGamePreferences,
  subscribeGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";

import { resumeAudioContext } from "./resumeAudioContext";

export function createCardAudio() {
  let deal: Howl | undefined;
  let play: Howl | undefined;

  function options() {
    const { volume, muted } = readGamePreferences();
    return { volume, mute: muted };
  }

  const unsubscribe = subscribeGamePreferences(() => {
    const { volume, muted } = readGamePreferences();
    for (const sound of [deal, play]) {
      sound?.volume(volume);
      sound?.mute(muted);
    }
  });

  function getDeal() {
    return (deal ??= new Howl({ src: [dealCardSound], ...options() }));
  }

  function getPlay() {
    return (play ??= new Howl({ src: [playCardSound], ...options() }));
  }

  return {
    preloadPlay() {
      getPlay();
    },
    preloadDeal() {
      getDeal();
    },
    unlock() {
      getDeal();
      resumeAudioContext();
    },
    playDealCard() {
      getDeal().play();
    },
    playCard() {
      getPlay().play();
    },
    stop() {
      deal?.stop();
      play?.stop();
    },
    dispose() {
      unsubscribe();
      deal?.unload();
      play?.unload();
      deal = undefined;
      play = undefined;
    },
  };
}
