import gsap from "gsap";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";

import { HearthAsh } from "../../adapters/three/HearthAsh";

export function TavernMatchAtmosphere({ playing }: { playing: boolean }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!playing || !scope.current) return;

      gsap.to("[data-table-candle]", {
        opacity: 0.33,
        scale: 1.12,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap
        .timeline({ repeat: -1, defaults: { ease: "sine.inOut" } })
        .to("[data-table-hearth]", { opacity: 0.19, duration: 0.15 })
        .to("[data-table-hearth]", { opacity: 0.1, duration: 0.24 })
        .to("[data-table-hearth]", { opacity: 0.16, duration: 0.18 }, "+=0.07")
        .to("[data-table-hearth]", { opacity: 0.08, duration: 0.29 })
        .to("[data-table-hearth]", { opacity: 0.2, duration: 0.18 }, "+=0.11")
        .to("[data-table-hearth]", { opacity: 0.12, duration: 0.35 });
    },
    { scope, dependencies: [playing], revertOnUpdate: true },
  );

  if (!playing) return null;

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Percentages use the same frame as the orientation-specific paintings. */}
      <div className="absolute top-[4.9%] left-[16%] portrait:top-[3.8%] portrait:left-[23.2%]">
        <span
          data-table-candle=""
          className="absolute size-[9cqmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--gold),transparent_70%)] opacity-10 mix-blend-screen"
        />
      </div>
      <div className="absolute top-[11%] left-[97.5%] portrait:top-[7%] portrait:left-[96%]">
        <span
          data-table-hearth=""
          className="absolute h-[13cqmin] w-[9cqmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--gold),transparent_70%)] opacity-[0.12] mix-blend-screen"
        />
        <HearthAsh />
      </div>
    </div>
  );
}
