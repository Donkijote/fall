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
  const glints = root.querySelectorAll<HTMLElement>("[data-clean-glint]");
  glints.forEach((glint, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    const start = 0.36 + index * 0.05;
    timeline.fromTo(
      glint,
      { opacity: 0, scale: 0.2, x: -direction * 4, y: direction * 4, rotation: 0 },
      {
        opacity: 1,
        scale: 1.8,
        x: direction * 8,
        y: -direction * 7,
        rotation: 45,
        duration: 0.2,
        ease: "back.out(2.4)",
      },
      start,
    );
    timeline.to(glint, { opacity: 0.55, scale: 0.85, duration: 0.09 }, start + 0.2);
    timeline.to(
      glint,
      {
        opacity: 1,
        scale: 1.45,
        x: direction * 14,
        y: -direction * 3,
        rotation: 135,
        duration: 0.12,
        ease: "power2.out",
      },
      start + 0.29,
    );
    timeline.to(
      glint,
      {
        opacity: 0,
        scale: 0.4,
        x: direction * 18,
        y: -direction * 10,
        duration: 0.12,
        ease: "sine.in",
      },
      start + 0.41,
    );
  });
  timeline.to(bonus, { opacity: 0, scale: 1.03, duration: 0.16, ease: "sine.in" }, 0.84);
  return timeline;
}
