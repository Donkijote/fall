import gsap from "gsap";
import { useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

/** The accessible value is immediate; only the decorative fill and sparks interpolate. */
export function ExperienceMeter({
  value,
  maximum,
  level,
}: {
  value?: number;
  maximum?: number;
  level?: number;
}) {
  const valid =
    value !== undefined &&
    maximum !== undefined &&
    Number.isFinite(value) &&
    Number.isFinite(maximum) &&
    maximum > 0 &&
    value >= 0 &&
    value <= maximum;
  const percent = valid ? (value / maximum) * 100 : undefined;
  const root = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const particles = useRef<HTMLSpanElement>(null);
  const progress = useRef({ value: percent ?? 0 });
  const previous = useRef({ percent, level });
  const motion = useRef<gsap.core.Timeline | null>(null);
  const initialized = useRef(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      motion.current?.kill();
      const sparks = particles.current ? [...particles.current.children] : [];
      gsap.set(sparks, { opacity: 0 });
      const old = previous.current;
      previous.current = { percent, level };
      const initial = !initialized.current;
      initialized.current = true;
      const paint = () => {
        if (fill.current) fill.current.style.width = `${progress.current.value}%`;
      };
      if (percent === undefined || initial || old.percent === undefined || reduced) {
        progress.current.value = percent ?? 0;
        paint();
        return;
      }
      const levelUp = level !== undefined && old.level !== undefined && level > old.level;
      const advancing = levelUp || percent > progress.current.value;
      const timeline = (motion.current = gsap.timeline());
      if (levelUp) {
        timeline.to(progress.current, {
          value: 100,
          duration: 0.45,
          ease: "none",
          onUpdate: paint,
        });
        timeline.set(progress.current, { value: 0, onUpdate: paint });
      }
      const duration = advancing ? 0.75 : 0.35;
      timeline.to(progress.current, {
        value: percent,
        duration,
        ease: "power1.out",
        onUpdate: paint,
      });
      if (advancing) {
        const travelDuration = duration + (levelUp ? 0.45 : 0);
        sparks.forEach((spark, index) => {
          timeline.fromTo(
            spark,
            {
              left: () => `${progress.current.value}%`,
              x: 0,
              y: 0,
              opacity: 0.95,
              scale: 1,
            },
            {
              x: 3 + (index % 4) * 2,
              y: (index % 2 ? -1 : 1) * (5 + (index % 5) * 2),
              opacity: 0,
              scale: 0.2,
              duration: 0.3,
              ease: "power2.out",
              immediateRender: false,
            },
            (index / sparks.length) * travelDuration,
          );
        });
      }
      return () => {
        timeline.kill();
      };
    },
    { dependencies: [percent, level, reduced] },
  );

  return (
    <span
      ref={root}
      className="relative block h-1.5 w-full"
      role={valid ? "meter" : "img"}
      aria-label={valid ? "Experience" : "Experience unavailable"}
      aria-valuemin={valid ? 0 : undefined}
      aria-valuemax={valid ? maximum : undefined}
      aria-valuenow={valid ? value : undefined}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-full border border-gold/50 bg-artwork-shadow/75"
      >
        <span
          ref={fill}
          data-xp-fill=""
          className="relative block h-full rounded-full bg-linear-to-r from-gold to-artwork-foreground"
        >
          <span className="absolute inset-y-0 right-0 w-1 rounded-full bg-artwork-foreground shadow-[0_0_5px_var(--gold)]" />
        </span>
      </span>
      <span ref={particles} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {Array.from({ length: 16 }, (_, index) => (
          <span
            key={index}
            data-xp-particle=""
            className="absolute top-1/2 size-0.5 rounded-full bg-gold opacity-0 shadow-[0_0_3px_var(--gold)]"
          />
        ))}
      </span>
    </span>
  );
}
