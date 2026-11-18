import gsap from "gsap";
import { useRef } from "react";
import type { RefObject } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const origin = "--portrait-turn-origin";
const sweep = "--portrait-turn-sweep";
const head = "--portrait-glint-angle";
const light = "--portrait-glint";

/** One owner for the drawn rim, moving head, release and quiet brass reflection. */
export function usePortraitTurnMotion(
  portrait: RefObject<HTMLElement | null>,
  highlighted: boolean,
) {
  const reducedMotion = useReducedMotion();
  const animation = useRef<gsap.core.Timeline | null>(null);
  const release = useRef<{ kind: "wipe" | "undraw"; start: number } | null>(null);

  useGSAP(
    () => {
      const element = portrait.current;
      if (!element) return;
      animation.current?.kill();
      if (reducedMotion) {
        gsap.set(element, {
          [origin]: "0deg",
          [sweep]: highlighted ? "360deg" : "0deg",
          [head]: "0deg",
          [light]: highlighted ? 0.95 : 0,
        });
        release.current = null;
        return;
      }

      const read = (property: string) =>
        Number.parseFloat(String(gsap.getProperty(element, property))) || 0;
      const currentSweep = read(sweep);
      const currentOrigin = read(origin);
      const currentHead = read(head);
      const timeline = gsap.timeline();
      animation.current = timeline;

      if (highlighted) {
        // Reactivation during a wipe retraces that same edge, without jumping the head.
        const reversingWipe = currentSweep > 0 && release.current?.kind === "wipe";
        const start = reversingWipe
          ? release.current!.start
          : currentSweep === 0
            ? currentHead
            : currentOrigin;
        if (currentSweep === 0) gsap.set(element, { [origin]: `${start}deg` });
        const end = reversingWipe ? start : start + 360;
        const duration = 0.65 * (1 - currentSweep / 360);
        timeline
          .to(element, { [light]: 0.95, duration: 0.1 }, 0)
          .to(
            element,
            {
              [origin]: `${start}deg`,
              [sweep]: "360deg",
              [head]: `${end}deg`,
              duration,
              ease: "none",
            },
            0,
          )
          .to(
            element,
            {
              [head]: `${end + 360}deg`,
              duration: 1.9,
              ease: "none",
              repeat: -1,
            },
            Math.max(duration, 0.1),
          );
        release.current = null;
        return;
      }

      let releaseDuration = 0;
      if (currentSweep > 0) {
        if (currentSweep >= 359.9 || release.current?.kind === "wipe") {
          // A full ring can move its mask origin to the orbit's current head invisibly.
          const start = release.current?.kind === "wipe" ? release.current.start : currentHead;
          if (currentSweep >= 359.9) gsap.set(element, { [origin]: `${start}deg` });
          release.current = { kind: "wipe", start };
          releaseDuration = (0.65 * currentSweep) / 360;
          timeline.to(
            element,
            {
              [origin]: `${start + 360}deg`,
              [sweep]: "0deg",
              [head]: `${start + 360}deg`,
              duration: releaseDuration,
              ease: "none",
            },
            0,
          );
        } else {
          // A turn interrupted before its first lap retraces only the lit arc.
          release.current = { kind: "undraw", start: currentOrigin };
          releaseDuration = (0.65 * currentSweep) / 360;
          timeline.to(
            element,
            {
              [sweep]: "0deg",
              [head]: `${currentOrigin}deg`,
              duration: releaseDuration,
              ease: "none",
            },
            0,
          );
        }
        timeline.to(
          element,
          { [light]: 0, duration: Math.min(0.12, releaseDuration) },
          Math.max(0, releaseDuration - 0.12),
        );
      }

      const angle = gsap.utils.random(0, 360);
      const idle = gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 1.4 });
      idle
        .fromTo(
          element,
          { [head]: `${angle}deg` },
          {
            [head]: `${angle + 110}deg`,
            duration: 1.8,
            ease: "none",
            immediateRender: false,
          },
          0,
        )
        .fromTo(
          element,
          { [light]: 0 },
          { [light]: 0.72, duration: 0.65, ease: "sine.out", immediateRender: false },
          0,
        )
        .to(element, { [light]: 0, duration: 1.15, ease: "sine.in" }, 0.65);
      timeline.add(idle, releaseDuration);
    },
    { dependencies: [highlighted, reducedMotion], scope: portrait },
  );
}
