import gsap from "gsap";

import type { ScoreAward } from "@/domain/entities/GameState";

/** Capture has already emptied the table. This owner only celebrates its award. */
export function cleanTablePlayback(
  root: HTMLElement,
  award: ScoreAward | undefined,
  reducedMotion: boolean,
  complete: () => void,
) {
  if (!award || award.reason !== "clear" || reducedMotion) {
    complete();
    return;
  }
  const sweep = root.querySelector<HTMLElement>("[data-clean-sweep]");
  const bonus = root.querySelector<HTMLElement>("[data-clean-award]");
  if (!sweep || !bonus) {
    complete();
    return;
  }
  const timeline = gsap.timeline({ onComplete: complete });
  timeline.fromTo(
    sweep,
    { xPercent: -150, opacity: 0 },
    {
      xPercent: 650,
      opacity: 0.8,
      duration: 0.55,
      ease: "power2.inOut",
    },
    0,
  );
  timeline.to(sweep, { opacity: 0, duration: 0.18 }, 0.42);
  timeline.fromTo(
    bonus,
    { opacity: 0, scale: 0.75, y: 6, rotation: -4 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotation: 0,
      duration: 0.24,
      ease: "back.out(1.7)",
    },
    0.3,
  );
  const glints = root.querySelectorAll("[data-clean-glint]");
  if (glints.length) {
    timeline.fromTo(
      glints,
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.12,
        stagger: 0.04,
      },
      0.36,
    );
    timeline.to(glints, { opacity: 0, scale: 1.4, duration: 0.18 }, 0.54);
  }
  timeline.to(bonus, { opacity: 0, scale: 1.03, duration: 0.16, ease: "sine.in" }, 0.84);
  return timeline;
}
