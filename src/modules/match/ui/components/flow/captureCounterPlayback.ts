import gsap from "gsap";

import type { CountingSnapshot } from "@/components/cards/motion/cardCounting";

import type { MatchMotion } from "../../../application/localMatch";

export function createCaptureCounterPlayback(
  root: HTMLElement,
  groups: Extract<MatchMotion, { kind: "count" }>["groups"],
) {
  const counters = new Map(
    groups.map(({ side }) => {
      const element = root.querySelector(`[data-capture-counter="${side}"]`);
      return [
        side,
        {
          cards: element?.querySelector("[data-capture-cards]"),
          points: element?.querySelector("[data-capture-points]"),
          burst: element?.querySelector("[data-capture-burst]"),
          counted: 0,
          bonus: 0,
          effect: undefined as gsap.core.Timeline | undefined,
        },
      ] satisfies [number, object];
    }),
  );
  const context = gsap.context(() => {}, root);

  return {
    update(side: number, snapshot: Pick<CountingSnapshot, "counted" | "points">, animate = true) {
      const counter = counters.get(side);
      if (!counter) return;
      if (counter.cards && snapshot.counted !== counter.counted) {
        counter.cards.textContent = String(snapshot.counted);
        counter.counted = snapshot.counted;
      }
      if (!counter.points || snapshot.points === counter.bonus) return;
      counter.points.textContent = String(snapshot.points);
      const awarded = snapshot.points > counter.bonus;
      counter.bonus = snapshot.points;
      if (!animate || !awarded || !counter.burst) return;

      const { points, burst } = counter;
      counter.effect?.kill();
      context.add(() => {
        counter.effect = gsap
          .timeline()
          .fromTo(points, { scale: 1.45 }, { scale: 1, duration: 0.32, ease: "back.out(2)" }, 0)
          .fromTo(
            burst,
            { autoAlpha: 0, y: 8, scale: 0.72 },
            { autoAlpha: 1, y: -6, scale: 1, duration: 0.2, ease: "back.out(2)" },
            0,
          )
          .to(burst, { autoAlpha: 0, y: -19, duration: 0.24, ease: "power1.in" }, 0.27);
      });
    },
    dispose() {
      context.revert();
    },
  };
}
