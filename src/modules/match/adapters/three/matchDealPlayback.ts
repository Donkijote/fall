import { cardFlights } from "@/components/cards/motion/cardFlights";
import { appendDeal, type CardMotionAudio } from "@/components/cards/motion/cardTimelines";
import { toCardKey } from "@/domain/helpers/card";

import type { CardScene, OpeningTablePlayback } from "./matchCardScene";

export type DealFlight = { progress: number; fan: number; landed: boolean };

/** Ordinary hands keep their existing stagger/fan; opening table cards land singly. */
export function appendMatchDeal(
  timeline: gsap.core.Timeline,
  scene: Extract<CardScene, { kind: "deal" }>,
  flights: DealFlight[],
  audio: CardMotionAudio,
  openingTable?: OpeningTablePlayback,
) {
  for (const first of [scene.cards[0]?.center, !scene.cards[0]?.center]) {
    const indices = scene.cards.flatMap((card, index) => (card.center === first ? [index] : []));
    if (first && openingTable) {
      for (const index of indices) {
        const card = scene.cards[index];
        timeline.to(flights[index], {
          progress: 1,
          duration: 0.72,
          ease: "power2.out",
          onStart: audio.playDealCard,
        });
        if (card.art) {
          // Eased progress rounds to 1 before the tween actually ends. Transfer
          // visibility only at the same timeline position that reveals the DOM card.
          timeline.set(flights[index], { landed: true });
          openingTable.land(timeline, toCardKey(card.art));
        }
        timeline.to({}, { duration: 0.18 });
      }
    } else {
      const start = timeline.duration();
      appendDeal(
        timeline,
        indices.map((index) => flights[index]),
        Boolean(first),
        audio,
        "original",
        start,
      );
      indices.forEach((index, order) => {
        if (!scene.cards[index].fan) return;
        timeline.to(
          flights[index],
          { fan: 1, duration: 0.2, ease: "power2.out" },
          start + order * cardFlights.deal.stagger + cardFlights.deal.hand,
        );
      });
    }
  }
  openingTable?.celebrate(timeline);
  return timeline;
}
