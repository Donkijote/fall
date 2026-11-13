import { cardCaptureDuration } from "./cardCapture";
import type { CardDropEffect } from "./cardFlights";
import { cardFlights } from "./cardFlights";
import { flameCooldownDuration } from "./cardImpactMotion";
import {
  cascadeFirstPickupDuration,
  cascadeReturnTime,
  getCascadeDuration,
} from "./cascadeCapture";
import { captureDuration, collectAt, fallRiseAt, impactAt } from "./tableCapture";

export type CardMotionAudio = { playDealCard: () => void; playCard: () => void };
export type CaptureKind = "fall" | "card" | "cascade" | "sweep";
export type FlightProgress = { progress: number };

export function appendDeal(
  timeline: gsap.core.Timeline,
  batch: readonly FlightProgress[],
  center: boolean,
  audio: CardMotionAudio,
  ease = "original",
  start = 0,
) {
  batch.forEach((flight, index) => {
    timeline.to(
      flight,
      {
        progress: 1,
        duration: center ? cardFlights.deal.table : cardFlights.deal.hand,
        ease: ease === "original" ? cardFlights.deal.ease : ease,
        onStart: audio.playDealCard,
      },
      start + index * cardFlights.deal.stagger,
    );
  });
  return timeline;
}

export function appendPlay(
  timeline: gsap.core.Timeline,
  motion: FlightProgress,
  audio: CardMotionAudio,
  ease = "original",
) {
  return timeline.to(motion, {
    progress: 1,
    duration: cardFlights.play.duration,
    ease: ease === "original" ? cardFlights.play.ease : ease,
    onStart: audio.playCard,
  });
}

export function appendCapture(
  timeline: gsap.core.Timeline,
  motion: FlightProgress & { cooldown: number; followThrough?: number },
  kind: CaptureKind,
  targets: number,
  audio: CardMotionAudio,
  effect: CardDropEffect = "plain",
  targetAlreadyOnTable = false,
) {
  const duration =
    kind === "cascade"
      ? getCascadeDuration(targets)
      : kind === "card"
        ? cardCaptureDuration
        : kind === "sweep"
          ? cascadeReturnTime
          : captureDuration(effect);
  const fall = kind === "fall";
  const fallCascade = fall && targets > 1;
  if (fall && targetAlreadyOnTable) {
    // The previous turn already landed the target and played its sound.
    timeline
      .set(motion, { progress: fallRiseAt })
      .to(motion, { progress: impactAt, duration: 0.42, ease: "none" })
      .call(audio.playCard)
      .to(motion, {
        progress: collectAt,
        duration: duration * (collectAt - impactAt),
        ease: "none",
      });
  } else {
    timeline.to(motion, {
      progress: fall ? collectAt : 1,
      duration: fall ? duration * collectAt : duration,
      ease: "none",
      onStart: audio.playCard,
    });
    if (fall) timeline.call(audio.playCard, [], duration * fallRiseAt);
  }
  if (fall) {
    if (fallCascade) {
      timeline.to(motion, {
        followThrough: 1,
        duration: getCascadeDuration(targets) - cascadeFirstPickupDuration,
        ease: "none",
      });
    } else {
      timeline.to(motion, {
        progress: 1,
        duration: cardFlights.collect.duration,
        ease: "none",
      });
      if (!targetAlreadyOnTable || effect === "flame")
        timeline.to(motion, {
          cooldown: flameCooldownDuration,
          duration: flameCooldownDuration,
          ease: "none",
        });
    }
  }
  return timeline;
}
