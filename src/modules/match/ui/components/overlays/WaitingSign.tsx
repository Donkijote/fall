import { cn } from "cn";
import gsap from "gsap";
import { useRef } from "react";

import occupiedSeat from "@/assets/lobby/tavern-match/occupied-seat-token.webp";
import sign from "@/assets/lobby/tavern-match/waiting-sign.webp";
import chair from "@/assets/lobby/tavern-match/wooden-chair.svg";
import { Icon } from "@/components/icons/Icon";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { TavernOverlayAction } from "./TavernOverlayAction";

export function WaitingSign({
  title,
  filled,
  total,
  returning,
  cancel,
}: {
  title: string;
  filled: number;
  total: number;
  returning: boolean;
  cancel: () => void;
}) {
  const seats = useRef<HTMLDivElement>(null);
  const previousFilled = useRef(filled);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const before = previousFilled.current;
      previousFilled.current = filled;
      if (reducedMotion || filled <= before) return;

      const arrivals = Array.from(
        seats.current?.querySelectorAll<HTMLElement>("[data-filled=true]") ?? [],
      ).slice(before, filled);
      if (!arrivals.length) return;
      gsap.fromTo(
        arrivals,
        { scale: 0.65, rotation: -8, y: 3 },
        { scale: 1, rotation: 0, y: 0, duration: 0.38, stagger: 0.08, ease: "back.out(1.6)" },
      );
    },
    { scope: seats, dependencies: [filled, total, reducedMotion], revertOnUpdate: true },
  );

  return (
    <section className="relative grid w-[min(100%,21rem)] justify-items-center gap-2 px-6 pt-12 pb-6 text-center text-artwork-foreground compact-landscape:gap-1 compact-landscape:pt-10 compact-landscape:pb-4">
      <img src={sign} alt="" className="pointer-events-none absolute inset-0 size-full" />
      <h1 className="relative artwork-title text-[clamp(1.25rem,5vmin,2rem)]">{title}</h1>
      <div className="relative grid justify-items-center gap-2 text-sm" role="status">
        <div ref={seats} aria-hidden="true" className="flex gap-2">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full text-gold compact-landscape:size-8",
                index >= filled && "border border-gold/70 bg-artwork-shadow",
              )}
              data-filled={index < filled}
            >
              {index < filled ? (
                <img src={occupiedSeat} alt="" className="size-full" draggable={false} />
              ) : (
                <Icon icon={chair} className="size-5" />
              )}
            </span>
          ))}
        </div>
        <span>
          {filled} of {total} seats filled
        </span>
      </div>
      <TavernOverlayAction
        data-tavern-cancel=""
        tone="outline"
        className="text-xs"
        onClick={cancel}
        aria-disabled={returning}
      >
        Cancel matchmaking
      </TavernOverlayAction>
    </section>
  );
}
