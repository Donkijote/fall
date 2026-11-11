import gsap from "gsap";
import { useRef } from "react";

import inn from "@/assets/lobby/tavern/inn-landscape.webp";
import innPortrait from "@/assets/lobby/tavern/inn-portrait.webp";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { TavernEmbers } from "./TavernEmbers";

gsap.registerPlugin(useGSAP);

export function TavernRoom() {
  const room = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!room.current || reducedMotion) return;

      room.current.querySelectorAll("[data-tavern-lantern]").forEach((light, index) => {
        gsap
          .timeline({ repeat: -1, yoyo: true, delay: index * 0.55 })
          .to(light, {
            opacity: 0.24,
            scale: 1.08,
            duration: 1.1 + index * 0.35,
            ease: "sine.inOut",
          })
          .to(light, { opacity: 0.12, scale: 0.96, duration: 0.48, ease: "sine.inOut" })
          .to(light, { opacity: 0.28, scale: 1.06, duration: 0.74, ease: "sine.inOut" })
          .to(light, { opacity: 0.04, scale: 1, duration: 1.9, ease: "sine.inOut" });
      });
    },
    { scope: room, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      data-tavern-room=""
      aria-hidden="true"
      ref={room}
      className="[container-type:size] pointer-events-none absolute inset-0 overflow-hidden bg-background"
    >
      {/* The painting and lights share the same centered cover crop. */}
      <div className="absolute top-1/2 left-1/2 aspect-[1672/941] w-[max(100cqw,177.6834cqh)] -translate-x-1/2 -translate-y-1/2 portrait:aspect-[852/1846] portrait:w-[max(100cqw,46.1538cqh)]">
        <picture className="absolute inset-0 block">
          <source media="(orientation: portrait)" srcSet={innPortrait} />
          <img src={inn} alt="" width={1672} height={941} className="size-full" />
        </picture>
        {!reducedMotion && (
          <div className="absolute inset-0 mix-blend-screen">
            <span
              data-tavern-lantern=""
              className="absolute top-[68.5%] left-[11%] h-[17%] w-[13%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,var(--gold),transparent_68%)] opacity-0 portrait:top-[77%] portrait:left-[12%] portrait:h-[9%] portrait:w-[25%]"
            />
            <span
              data-tavern-lantern=""
              className="absolute top-[59%] left-[95.5%] h-[25%] w-[18%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,var(--gold),transparent_68%)] opacity-0 portrait:top-[47%] portrait:left-[95%] portrait:h-[14%] portrait:w-[33%]"
            />
            <TavernEmbers />
          </div>
        )}
      </div>
    </div>
  );
}
