import type { CaptureCue } from "@/domain/audio/captureCue";

import { cardCaptureDuration } from "./cardCapture";
import type { CardDropEffect } from "./cardFlights";
import { cardFlights } from "./cardFlights";
import { flameCooldownDuration } from "./cardImpactMotion";
import {
  cascadeFirstPickupDuration,
  getCascadeSteps,
  cascadeReturnTime,
  getCascadeDuration,
} from "./cascadeCapture";
import {
  captureDuration,
  captureElementStart,
  collectAt,
  fallRiseAt,
  impactAt,
} from "./tableCapture";

export type CardMotionAudio = {
  playDealCard: () => void;
  playCard: () => void;
  playCapture?: (cue: CaptureCue) => void;
};
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
      .call(() => {
        if (!audio.playCapture) audio.playCard();
      })
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
      onStart: () => {
        if (!audio.playCapture || fall || kind === "card") audio.playCard();
      },
    });
    if (fall && !audio.playCapture) timeline.call(audio.playCard, [], duration * fallRiseAt);
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
  const cue = audio.playCapture;
  if (cue) {
    const fallImpact = targetAlreadyOnTable ? 0.42 : duration * impactAt;
    if (fall) {
      const release = fall && !targetAlreadyOnTable ? duration * fallRiseAt : 0;
      timeline.call(() => cue(effect === "flame" ? "flame-rise" : "flight"), [], release);
    }
    if (fall && effect === "ice") {
      const freezeAt = targetAlreadyOnTable
        ? 0.42 * ((captureElementStart(effect) - fallRiseAt) / (impactAt - fallRiseAt))
        : duration * captureElementStart(effect);
      timeline.call(() => cue("freeze"), [], freezeAt);
      timeline.call(() => cue("shatter"), [], fallImpact);
    } else if (fall && effect === "heat") {
      const heatAt = targetAlreadyOnTable
        ? 0.42 * ((captureElementStart(effect) - fallRiseAt) / (impactAt - fallRiseAt))
        : duration * captureElementStart(effect);
      timeline.call(() => cue("heat"), [], heatAt);
      timeline.call(() => cue("soft-contact"), [], fallImpact);
    } else if (fall && effect === "flame") {
      const buildup = targetAlreadyOnTable
        ? 0.42 * ((captureElementStart(effect) - fallRiseAt) / (impactAt - fallRiseAt))
        : duration * captureElementStart(effect);
      timeline.call(() => cue("heat"), [], buildup);
      timeline.call(() => cue("flame"), [], fallImpact);
    } else if (fall) {
      timeline.call(() => cue("capture"), [], fallImpact);
    }
    if (kind === "cascade" || fallCascade) {
      const steps = getCascadeSteps(targets);
      for (const [index, step] of steps.entries()) {
        if (fallCascade && index === 0) continue;
        const at = fallCascade
          ? fallImpact +
            duration * (collectAt - impactAt) +
            step.start -
            cascadeFirstPickupDuration +
            step.travel
          : step.start + step.travel;
        timeline.call(audio.playCard, [], at - step.travel);
      }
    }
    // A sweep has no new impact: it silently returns the remaining cards to the pile.
  }
  return timeline;
}
