import { useEffect } from "react";

import {
  AnimationKeys,
  animationService,
  onAnimation,
} from "@/application/services/AnimationService";

export const useAnimationLayer = () => {
  useEffect(() => {
    const offGameCards = onAnimation(AnimationKeys.GAME_CARDS, (payload) => {
      return new Promise<void>((resolve) => {
        const to = setTimeout(() => {
          animationService.dispatch(AnimationKeys.GAME_CARDS, payload);
        }, 1500);

        const wrappedResolve = () => {
          clearTimeout(to);
          resolve();
        };

        animationService._registerWaiter(
          AnimationKeys.GAME_CARDS,
          payload,
          wrappedResolve,
        );
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

        animationService._registerWaiter(
          AnimationKeys.PILE_COLLECT,
          payload,
          wrappedResolve,
        );
      });
    });

    return () => {
      offGameCards();
      offCapture();
    };
  }, []);
};
