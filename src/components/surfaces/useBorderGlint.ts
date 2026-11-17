import gsap from "gsap";
import { useRef, type RefObject } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

/** Persistent brass highlight, randomly placed once per mounted surface. */
export function useBorderGlint(surface: RefObject<HTMLElement | null>, enabled = true) {
  const reducedMotion = useReducedMotion();
  const position = useRef<{ x: string; y: string }>(null);

  useGSAP(
    () => {
      const element = surface.current;
      if (!element || !enabled) return;
      const random = gsap.utils.random;
      const origin = (position.current ??= {
        x: `${random(20, 80)}%`,
        y: random(0, 1, 1) ? "4%" : "96%",
      });
      gsap.set(element, {
        "--border-glint-x": origin.x,
        "--border-glint-y": origin.y,
        "--border-glint": 0.72,
      });
      if (!reducedMotion) {
        gsap.to(element, {
          "--border-glint": 0.94,
          duration: random(1.8, 2.8),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    },
    { dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
