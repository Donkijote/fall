import { cardCaptureDuration } from "./cardCapture";
import { cardFlights } from "./cardFlights";
import { flameCooldownDuration } from "./cardImpactMotion";
import { cascadeReturnTime, getCascadeDuration } from "./cascadeCapture";
import { captureDuration } from "./tableCapture";

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
  motion: FlightProgress & { cooldown: number },
  kind: CaptureKind,
  targets: number,
  audio: CardMotionAudio,
) {
  const duration =
    kind === "cascade"
      ? getCascadeDuration(targets)
      : kind === "card"
        ? cardCaptureDuration
        : kind === "sweep"
          ? cascadeReturnTime
          : captureDuration("plain");
  timeline.to(motion, { progress: 1, duration, ease: "none", onStart: audio.playCard });
  if (kind === "fall") {
    timeline.call(audio.playCard, [], duration * 0.27);
    timeline.to(motion, {
      cooldown: flameCooldownDuration,
      duration: flameCooldownDuration,
      ease: "none",
    });
  }
  return timeline;
}
