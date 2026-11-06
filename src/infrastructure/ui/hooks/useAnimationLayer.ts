import { useEffect } from "react";

import {
  AnimationKeys,
  animationService,
  onAnimation,
} from "@/application/services/AnimationService";
import { useUIGameStore } from "@/application/store/uiGameStore";
import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

export const useAnimationLayer = () => {
  useEffect(() => {
    const audio = createCardAudio();
    const offCardSound = useUIGameStore.subscribe((current, previous) => {
      if (current.state.playingCard && current.state.playingCard !== previous.state.playingCard) {
        audio.playCard();
      }
    });
    const offGameCards = onAnimation(AnimationKeys.GAME_CARDS, (payload) => {
      return new Promise<void>((resolve) => {
        const to = setTimeout(() => {
          animationService.dispatch(AnimationKeys.GAME_CARDS, payload);
        }, 1500);

        const wrappedResolve = () => {
          clearTimeout(to);
          resolve();
        };

        animationService._registerWaiter(AnimationKeys.GAME_CARDS, payload, wrappedResolve);
      });
    });

    const offCapture = onAnimation(AnimationKeys.PILE_COLLECT, (payload) => {
      return new Promise<void>((resolve) => {
        const to = setTimeout(() => {
          animationService.dispatch(AnimationKeys.PILE_COLLECT, payload);
        }, 500);

        const wrappedResolve = () => {
          clearTimeout(to);
          resolve();
        };

        animationService._registerWaiter(AnimationKeys.PILE_COLLECT, payload, wrappedResolve);
      });
    });

    return () => {
      offGameCards();
      offCapture();
      offCardSound();
      audio.dispose();
    };
  }, []);
};
