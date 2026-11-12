import { Howl, Howler } from "howler";

import dealCardSound from "@/assets/cards/deal-card.mp3";
import playCardSound from "@/assets/cards/play-card.mp3";
import {
  readGamePreferences,
  subscribeGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";

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
      if (Howler.ctx?.state === "suspended") void Howler.ctx.resume().catch(() => {});
    },
    playDealCard() {
      getDeal().play();
    },
    playCard() {
      getPlay().play();
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
