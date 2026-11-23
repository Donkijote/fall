import type { TableBonusEffects } from "./tableBonusEffects";

/** Shared choreography for each resolved source; the caller owns the timeline. */
export function appendTableBonusHighlight(
  timeline: gsap.core.Timeline,
  card: HTMLElement,
  streak: number,
  index: number,
  effect?: TableBonusEffects[number],
) {
  const glow = card.querySelector<HTMLElement>("[data-bonus-glow]")!;
  const burst = card.querySelector<HTMLElement>("[data-bonus-burst]");
  const sheen = card.querySelector<HTMLElement>("[data-bonus-sheen]");
  const label = `match-${index}`;
  timeline.addLabel(label);
  if (effect) {
    effect.stage = streak;
    if (streak === 3) {
      timeline.fromTo(
        effect.heat.current.strength,
        { value: 0 },
        {
          value: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        label,
      );
    } else if (streak === 4) {
      timeline.fromTo(
        effect.flame.current,
        { value: 0 },
        {
          value: 1,
          duration: 0.18,
        },
        label,
      );
      timeline.fromTo(
        effect.ignition.current,
        { value: 0 },
        {
          value: 1,
          duration: 0.34,
          ease: "power2.out",
        },
        label,
      );
    }
  }

  // Each card keeps its own strength: the next success visibly outshines it.
  timeline.fromTo(
    glow,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 0.25 + streak * 0.17,
      scale: 1 + streak * 0.045,
      duration: 0.32,
      ease: "power2.out",
    },
    label,
  );
  timeline.to(
    card,
    {
      y: streak === 1 ? -2 : -3 - streak * 2,
      scale: streak === 1 ? 1.015 : 1.025 + streak * 0.02,
      duration: 0.22,
      ease: "power2.out",
    },
    label,
  );
  timeline.to(card, { y: 0, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, `${label}+=0.22`);
  if (streak === 2) {
    timeline.to(glow, { opacity: 0.95, scale: 1.18, duration: 0.12 }, `${label}+=0.34`);
    timeline.to(glow, { opacity: 0.59, scale: 1.09, duration: 0.22 }, `${label}+=0.46`);
  }
  if (burst && streak >= 2) {
    timeline.fromTo(
      burst,
      { opacity: 0.3 + streak * 0.15, scale: 1 },
      {
        opacity: 0,
        scale: 1.08 + streak * 0.07,
        duration: 0.48,
        ease: "power2.out",
        immediateRender: false,
      },
      label,
    );
  }
  if (sheen) {
    timeline.fromTo(
      sheen,
      { xPercent: -200, opacity: 0 },
      {
        xPercent: 200,
        opacity: 0.35 + streak * 0.15,
        duration: 0.42,
        ease: "power2.inOut",
      },
      `${label}+=0.06`,
    );
    timeline.to(sheen, { opacity: 0, duration: 0.12 }, `${label}+=0.48`);
  }
  timeline.addLabel(`match-settled-${index}`);
}

export function appendPerfectTableAward(
  timeline: gsap.core.Timeline,
  perfect: HTMLElement | null,
  matches: number,
) {
  if (perfect && matches === 4) {
    timeline.fromTo(
      perfect,
      { opacity: 0, scale: 0.55 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
    );
    timeline.to({}, { duration: 0.85 });
    timeline.to(perfect, { opacity: 0, scale: 1.12, duration: 0.25 });
  } else {
    timeline.to({}, { duration: 0.4 });
  }
}
