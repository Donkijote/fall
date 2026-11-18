import gsap from "gsap";
import { useRef } from "react";

import turnPointer from "@/assets/lobby/tavern-match/turn-pointer.webp";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function TurnPointer({ active }: { active: boolean }) {
  // Live matches suppress seat arrivals separately; turn cues use the actual preference.
  const reducedMotion = useReducedMotion();
  const pointer = useRef<HTMLSpanElement>(null);
  const motion = useRef<gsap.core.Tween | null>(null);
  useGSAP(
    () => {
      if (!pointer.current) return;
      motion.current?.kill();
      if (reducedMotion) {
        gsap.set(pointer.current, { autoAlpha: active ? 1 : 0, scale: 1 });
        return;
      }
      motion.current = gsap.to(pointer.current, {
        autoAlpha: active ? 1 : 0,
        scale: active ? 1 : 0.65,
        duration: active ? 0.38 : 0.2,
        ease: active ? "back.out(1.6)" : "power2.in",
      });
    },
    { scope: pointer, dependencies: [active, reducedMotion] },
  );

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-full mr-1 w-[clamp(0.5rem,calc(var(--seat-size)*0.25),1rem)] -translate-y-1/2 group-data-[side=right]:right-auto group-data-[side=right]:left-full group-data-[side=right]:mr-0 group-data-[side=right]:ml-1 group-data-[side=right]:rotate-180"
    >
      <span ref={pointer} className="invisible block scale-65 opacity-0">
        <img src={turnPointer} alt="" className="block w-full" />
      </span>
    </span>
  );
}
