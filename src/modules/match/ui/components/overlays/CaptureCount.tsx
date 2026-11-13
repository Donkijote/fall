import { cn } from "cn";
import { Coins, Layers2, Sparkles } from "lucide-react";

import tray from "@/assets/lobby/tavern-match/capture-tray.webp";

import type { MatchMotion } from "../../../application/localMatch";
import { scoreSideStyle } from "../board/scoreSideStyle";

export function CaptureCount({
  groups,
  sideName,
}: {
  groups: Extract<MatchMotion, { kind: "count" }>["groups"];
  sideName: (side: string) => string;
}) {
  return (
    <section
      aria-labelledby="capture-count-title"
      className="pointer-events-none absolute top-1/2 left-1/2 isolate z-10 grid w-[min(calc(100%-1rem),32rem)] -translate-1/2 justify-items-center gap-4 px-6 pt-[4.5rem] pb-8 text-center text-artwork-foreground sm:px-10 compact-landscape:max-w-[25rem] compact-landscape:gap-2 compact-landscape:pt-12 compact-landscape:pb-6"
    >
      <img src={tray} alt="" className="absolute inset-0 -z-10 size-full" />
      <h2
        id="capture-count-title"
        className="artwork-title text-[clamp(1rem,4vmin,1.5rem)] leading-none"
      >
        Counting captures
      </h2>
      <ul className="flex w-full justify-center gap-1 sm:gap-3">
        {groups.map(({ side }) => (
          <li key={side} className="grid min-w-0 flex-1 justify-items-center gap-1 text-xs">
            <span
              className={cn(
                "max-w-full truncate rounded-md border border-gold/45 bg-linear-to-b px-2 py-1",
                scoreSideStyle(String(side))?.plate,
              )}
            >
              {sideName(String(side))}
            </span>
            <div data-capture-counter={side} className="grid justify-items-center gap-1">
              <span className="flex items-center gap-1 whitespace-nowrap tabular-nums">
                <Layers2 aria-hidden="true" className="size-3.5 text-gold" />
                <span data-capture-cards className="min-w-[2ch]">
                  0
                </span>
                <span className="sr-only"> captured cards</span>
              </span>
              <div
                data-capture-anchor={side}
                className="relative flex items-center gap-1 rounded-full border border-gold/50 bg-artwork-shadow px-2 py-1 text-gold tabular-nums shadow-sm"
              >
                <Coins aria-hidden="true" className="size-4" />
                <span data-capture-points className="min-w-[2ch] text-center font-semibold">
                  0
                </span>
                <span className="sr-only"> bonus points</span>
                <span
                  aria-hidden="true"
                  data-capture-burst
                  className="invisible absolute bottom-full left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gold bg-artwork-shadow px-2 py-1 text-[0.625rem] font-semibold whitespace-nowrap"
                >
                  <Sparkles className="size-3" />
                  Extra card!
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
