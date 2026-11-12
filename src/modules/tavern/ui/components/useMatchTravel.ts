import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

export function useMatchTravel(popup: HTMLDivElement | null) {
  const reducedMotion = useReducedMotion();
  const [departing, setDeparting] = useState(false);
  const destination = useRef<(() => void) | null>(null);
  const { contextSafe } = useGSAP({ scope: popup ?? undefined });

  useEffect(() => {
    if (!reducedMotion) return;
    const finish = destination.current;
    destination.current = null;
    finish?.();
  }, [reducedMotion]);

  const depart = contextSafe((navigate: () => void) => {
    if (destination.current) return;
    if (!popup || reducedMotion) {
      navigate();
      return;
    }
    destination.current = navigate;
    setDeparting(true);
    gsap.to("[data-tavern-picker-content]", {
      opacity: 0,
      duration: 0.16,
      ease: "sine.inOut",
      onComplete: () => {
        const finish = destination.current;
        destination.current = null;
        finish?.();
      },
    });
  });

  return { departing, depart };
}
