import type { TableBonusEffects } from "./tableBonusEffects";

export const tableBonusFrameOpacity = (streak: number) => (streak >= 2 ? 0.8 + streak * 0.05 : 0);
export const tableBonusFrameFilter = (streak: number) => `brightness(${1 + streak * 0.08})`;

/** Shared choreography for each resolved source; the caller owns the timeline. */
export function appendTableBonusHighlight(
  timeline: gsap.core.Timeline,
  card: HTMLElement,
  streak: number,
  index: number,
  effect?: TableBonusEffects[number],
) {
  const frame = card.querySelector<HTMLElement>("[data-bonus-frame]");
  const sheen = card.querySelector<HTMLElement>(
    streak === 1 ? "[data-bonus-card-shine]" : "[data-bonus-sheen]",
  );
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

  if (frame && streak >= 2) {
    timeline.fromTo(
      frame,
      {
        opacity: 0,
        y: 8,
        scale: 0.94,
        clipPath: "inset(100% 0% 0% 0%)",
        filter: "brightness(0.9)",
      },
      {
        opacity: tableBonusFrameOpacity(streak),
        filter: tableBonusFrameFilter(streak),
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.5,
        ease: "power2.out",
      },
      label,
    );
    if (streak === 2) {
      timeline.to(
        frame,
        { opacity: 1, filter: "brightness(1.5)", duration: 0.1 },
        `${label}+=0.34`,
      );
      timeline.to(
        frame,
        {
          opacity: tableBonusFrameOpacity(streak),
          filter: tableBonusFrameFilter(streak),
          duration: 0.22,
        },
        `${label}+=0.46`,
      );
    }
  }
  // Each matching card keeps its own illustrated-frame intensity.
  if (streak >= 2) {
    timeline.to(
      card,
      {
        y: -3 - streak * 2,
        scale: 1.025 + streak * 0.02,
        duration: 0.22,
        ease: "power2.out",
      },
      label,
    );
    timeline.to(card, { y: 0, scale: 1, duration: 0.34, ease: "back.out(1.8)" }, `${label}+=0.22`);
  }
  if (sheen) {
    const shineStart = streak === 1 ? 0.04 : 0.18;
    const shineDuration = streak === 1 ? 0.62 : 0.48;
    timeline.fromTo(
      sheen,
      { xPercent: -200, opacity: 0 },
      { xPercent: 200, duration: shineDuration, ease: "power1.inOut" },
      `${label}+=${shineStart}`,
    );
    timeline.to(
      sheen,
      { opacity: streak === 1 ? 1 : 0.55 + streak * 0.1, duration: 0.08 },
      `${label}+=${shineStart}`,
    );
    timeline.to(
      sheen,
      { opacity: 0, duration: 0.12 },
      `${label}+=${shineStart + shineDuration - 0.12}`,
    );
  }
  timeline.addLabel(`match-settled-${index}`);
}

export function appendPerfectTableAward(
  timeline: gsap.core.Timeline,
  perfect: HTMLElement | null,
  matches: number,
) {
  if (perfect && matches === 4) {
    const start = timeline.duration();
    timeline.addLabel("perfect-table", start);
    timeline.fromTo(
      perfect,
      { opacity: 0, scale: 0.84, y: 22, clipPath: "inset(12% 6% 8% 6%)" },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.55,
        ease: "power3.out",
      },
      start,
    );
    const shine = perfect.querySelector<HTMLElement>("[data-perfect-artwork-shine]");
    const coin = perfect.querySelector<HTMLElement>("[data-award-coin]");
    if (shine) {
      timeline.fromTo(
        shine,
        { xPercent: -200, opacity: 0 },
        { xPercent: 200, duration: 0.85, ease: "sine.inOut" },
        start + 0.25,
      );
      timeline.to(shine, { opacity: 0.8, duration: 0.12 }, start + 0.25);
      timeline.to(shine, { opacity: 0, duration: 0.18 }, start + 0.92);
    }
    const particles = perfect.querySelectorAll<HTMLElement>("[data-perfect-particle]");
    particles.forEach((particle, index) => {
      const angle = (index / particles.length) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      const at = start + 0.24 + (index % 4) * 0.045;
      // Percent-of-plaque positions keep the motes outside the live text and coin.
      timeline.fromTo(
        particle,
        {
          left: `${50 + x * 39}%`,
          top: `${51 + y * 34}%`,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.25,
        },
        {
          left: `${50 + x * 48}%`,
          top: `${51 + y * 43}%`,
          scale: index % 3 === 0 ? 1.3 : 0.85,
          duration: 0.76,
          ease: "power2.out",
        },
        at,
      );
      timeline.to(particle, { opacity: 1, duration: 0.12 }, at);
      timeline.to(particle, { opacity: 0, scale: 0.2, duration: 0.3 }, at + 0.46);
    });
    if (coin) {
      timeline.fromTo(
        coin,
        { scale: 0.88 },
        { scale: 1.08, duration: 0.24, ease: "back.out(1.8)" },
        start + 0.32,
      );
      timeline.to(coin, { scale: 1, duration: 0.2, ease: "sine.out" }, start + 0.56);
    }
    timeline.to({}, { duration: 0.85 }, start + 0.45);
    timeline.to(perfect, { opacity: 0, scale: 1.12, duration: 0.25 }, start + 1.3);
  } else {
    timeline.to({}, { duration: 0.4 });
  }
}
