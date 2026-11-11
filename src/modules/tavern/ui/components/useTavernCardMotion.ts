import gsap from "gsap";
import { useRef } from "react";
import type { RefObject } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useTavernCardMotion(button: RefObject<HTMLButtonElement | null>, active: boolean) {
  const attention = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const control = button.current;
      if (!control || reducedMotion) return;

      const frame = control.querySelector("[data-tavern-card-attention]");
      const reflection = control.querySelector("[data-tavern-card-light]");
      const idleFrame = control.querySelector("[data-tavern-card-idle]");
      const border = control.querySelector("[data-card-border-glint]");
      const idle = gsap.timeline({ repeat: -1, repeatDelay: 5 });
      idle
        .fromTo(
          reflection,
          { xPercent: 0, opacity: 0 },
          { xPercent: 115, opacity: 0.34, duration: 1.4, ease: "sine.in" },
        )
        .to(reflection, { xPercent: 310, opacity: 0, duration: 2.2, ease: "sine.out" })
        .to(idleFrame, { scale: 1.025, duration: 1.4, ease: "sine.inOut" }, 0)
        .to(idleFrame, { scale: 1, duration: 2.2, ease: "sine.inOut" }, 1.4);
      const index = Array.from(control.parentElement?.children ?? []).indexOf(control);
      idle.delay(1.7 + Math.max(0, index) * 1.15);

      gsap.to(border, { "--glint-angle": "360deg", duration: 6, ease: "none", repeat: -1 });
      const highlight = gsap.timeline({ paused: true });
      highlight
        .to(frame, { y: -5, scale: 1.025, duration: 0.26, ease: "power2.out" }, 0)
        .to(border, { opacity: 1, duration: 0.24 }, 0);
      attention.current = highlight;

      return () => {
        attention.current = null;
      };
    },
    { scope: button, dependencies: [reducedMotion], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      const highlight = attention.current;
      if (active) highlight?.play();
      else highlight?.reverse();
    },
    { dependencies: [active, reducedMotion] },
  );
}
