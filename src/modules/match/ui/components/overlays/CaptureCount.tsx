import { cn } from "cn";
import { useId } from "react";

import bonusCoin from "@/assets/lobby/tavern-match/capture-bonus-coin.webp";
import tile from "@/assets/lobby/tavern-match/capture-ivory-tile.webp";
import bluePocket from "@/assets/lobby/tavern-match/capture-pocket-blue.webp";
import greenPocket from "@/assets/lobby/tavern-match/capture-pocket-green.webp";
import redPocket from "@/assets/lobby/tavern-match/capture-pocket-red.webp";
import ribbon from "@/assets/lobby/tavern-match/capture-ribbon.webp";
import tray from "@/assets/lobby/tavern-match/capture-tray.webp";
import sprig from "@/assets/ui/dividers/oak-sprig.webp";
import { BronzeArrow } from "@/components/dividers/BronzeArrow";

import type { MatchMotion } from "../../../application/localMatch";
import { MatchPlaque } from "../board/MatchPlaque";
import { matchSideSeals } from "../board/matchSideSeals";
import { scoreSideStyle } from "../board/scoreSideStyle";
import "./CaptureCount.css";

const pockets = new Map([
  ["1", bluePocket],
  ["2", redPocket],
  ["3", greenPocket],
]);

export function CaptureCount({
  groups,
  sideName,
  snapshot,
}: {
  groups: Extract<MatchMotion, { kind: "count" }>["groups"];
  sideName: (side: string) => string;
  snapshot?: Readonly<Record<number, { counted: number; points: number; extraCard?: boolean }>>;
}) {
  const title = useId();

  return (
    <section
      aria-labelledby={title}
      className="[container-type:inline-size] pointer-events-none absolute top-1/2 left-1/2 isolate z-10 aspect-[960/410] min-h-36 w-[min(calc(100%-0.5rem),40rem)] -translate-1/2 text-center text-artwork-foreground compact-landscape:max-w-120"
    >
      <img src={tray} alt="" className="absolute inset-0 -z-10 size-full" />
      <div className="absolute inset-x-[11.5%] top-[21%] bottom-[10%] flex flex-col gap-[clamp(0.375rem,1.7cqw,0.625rem)]">
        <h2
          id={title}
          className="flex shrink-0 translate-y-[3px] items-center justify-center gap-1.5 artwork-title text-[clamp(0.75rem,3.65cqw,1.25rem)] leading-none whitespace-nowrap"
        >
          <BronzeArrow className="h-1.5 max-w-14 min-w-0 flex-1" />
          <img src={sprig} alt="" className="w-[4%] shrink-0 -scale-x-100" />
          Counting captures
          <img src={sprig} alt="" className="w-[4%] shrink-0" />
          <BronzeArrow direction="left" className="h-1.5 max-w-14 min-w-0 flex-1" />
        </h2>
        <ul className="flex min-h-0 w-full flex-1 justify-center gap-[4%]">
          {groups.map(({ side }) => {
            const key = String(side);
            const team = scoreSideStyle(key);
            const seal = matchSideSeals.get(key);
            const tally = snapshot?.[side];
            const pocket = pockets.get(key) ?? bluePocket;
            return (
              <li
                key={side}
                className="flex max-w-30 min-w-0 flex-1 flex-col items-center gap-[clamp(0.25rem,1.1cqw,0.5rem)]"
              >
                <MatchPlaque className="w-[90%] shrink-0 px-1.5 py-0.5 text-[clamp(0.5625rem,2.2cqw,0.75rem)] sm:py-1">
                  {team && (
                    <span
                      aria-hidden="true"
                      className={cn("match-plaque-team-face bg-linear-to-b", team.plate)}
                    />
                  )}
                  <span className="min-w-0 truncate">{sideName(key)}</span>
                </MatchPlaque>
                <div data-capture-counter={side} className="relative isolate min-h-0 w-full flex-1">
                  <img
                    src={pocket}
                    alt=""
                    className="absolute inset-x-0 top-[15%] h-[85%] w-full"
                  />
                  <div className="absolute inset-x-[7%] top-0 isolate grid h-[49%] place-items-center pb-[20%]">
                    <img src={tile} alt="" className="absolute inset-0 -z-10 size-full" />
                    <span
                      data-capture-cards
                      className="capture-count-numeral text-[clamp(0.875rem,5.6cqw,2rem)] leading-none font-normal text-artwork-shadow"
                    >
                      {tally?.counted ?? 0}
                    </span>
                    <span className="sr-only"> captured cards</span>
                  </div>
                  <div className="absolute inset-x-0 top-[15%] bottom-0">
                    <img
                      src={pocket}
                      alt=""
                      className="capture-pocket-front absolute inset-0 size-full"
                    />
                    <div
                      data-capture-anchor={side}
                      className="absolute bottom-[calc(13%+2px)] left-[46%] isolate inline-flex aspect-square w-[38%] -translate-x-1/2 items-center justify-center pb-[0.18em] font-serif text-[clamp(0.625rem,3.35cqw,1.125rem)] leading-none font-normal text-artwork-shadow tabular-nums sm:left-[47%] compact-landscape:bottom-[calc(10%-1px)] compact-landscape:w-[34%]"
                    >
                      <img src={bonusCoin} alt="" className="absolute inset-0 -z-10 size-full" />
                      <span aria-hidden="true">+</span>
                      <span data-capture-points>{tally?.points ?? 0}</span>
                      <span className="sr-only"> bonus points</span>
                    </div>
                    {seal && (
                      <img src={seal} alt="" className="absolute right-[5%] bottom-[9%] w-[24%]" />
                    )}
                    <span
                      aria-hidden="true"
                      data-capture-burst
                      className={cn(
                        "absolute top-[22%] left-1/2 isolate z-10 sm:top-[calc(22%-3px)] compact-landscape:top-[22%]! compact-landscape:top-[calc(22%-2px)] grid h-[20%] min-h-[1.3em] w-[83%] -translate-x-1/2 -translate-y-[2px] place-items-center font-serif text-[clamp(0.5rem,2.1cqw,0.75rem)] leading-[1.1] font-semibold whitespace-nowrap text-artwork-shadow italic",
                        !tally?.extraCard && "invisible",
                      )}
                    >
                      <img src={ribbon} alt="" className="absolute inset-0 -z-10 size-full" />
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 120 24"
                        className="h-full w-full overflow-visible fill-current"
                      >
                        <path id={`${title}-ribbon-${side}`} d="M 8 16 Q 60 6 112 16" fill="none" />
                        <text textAnchor="middle" fontSize="13">
                          <textPath href={`#${title}-ribbon-${side}`} startOffset="50%">
                            Extra card!
                          </textPath>
                        </text>
                      </svg>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
