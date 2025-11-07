import { useEffect } from "react";

import {
  AnimationKeys,
  animationService,
  onAnimation,
} from "@/application/services/AnimationService";
import type { CapturePlan } from "@/domain/entities/GameState";

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

    const offCapture = onAnimation(
      AnimationKeys.CAPTURE_SEQUENCE,
      (plan: CapturePlan) => {
        return new Promise<void>((resolve) => {
          animationService._registerWaiter(
            AnimationKeys.CAPTURE_SEQUENCE,
            plan,
            resolve,
          );

          setTimeout(() => {
            animationService.dispatch(AnimationKeys.CAPTURE_SEQUENCE, plan);
          }, 1500);
        });
      },
    );

    return () => {
      offGameCards();
      offCapture();
    };
  }, []);
};
