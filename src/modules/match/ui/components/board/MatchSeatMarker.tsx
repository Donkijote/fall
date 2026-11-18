import { cn } from "cn";
import gsap from "gsap";
import { useRef } from "react";
import type { ReactNode } from "react";

import woodenChair from "@/assets/lobby/tavern-match/wooden-chair.svg";
import { PlayerPortrait } from "@/components/hud/PlayerPortrait";
import { Icon } from "@/components/icons/Icon";

import { useGSAP } from "@gsap/react";

import type { MatchSeat } from "../../../application/matchSeats";
import { MatchPlaque } from "./MatchPlaque";
import { scoreSideStyle } from "./scoreSideStyle";
import { TurnPointer } from "./TurnPointer";

export type SeatPlayer = { name: string; avatarUrl?: string };

const positions: Record<MatchSeat, string> = {
  bottom: "left-1/2 top-[87%] -translate-x-1/2",
  top: "left-1/2 top-[21%] -translate-x-1/2",
  left: "left-[4%] top-1/2 portrait:top-[37%] compact-landscape:left-2",
  right: "right-[4%] top-1/2 portrait:top-[37%] flex-row-reverse compact-landscape:right-2",
  "upper-left": "left-[8%] top-[35%] portrait:left-[4%]",
  "upper-right": "right-[8%] top-[35%] flex-row-reverse portrait:right-[4%]",
};

const openSeatEdge =
  "[clip-path:polygon(23%_0,77%_0,100%_23%,100%_77%,77%_100%,23%_100%,0_77%,0_23%)]";
const medallionSize = "size-(--seat-size)";

export function MatchSeatMarker({
  position,
  playerId,
  scoreSide,
  player,
  reducedMotion,
  active,
  dealer,
  children,
}: {
  position: MatchSeat;
  playerId?: string;
  scoreSide?: string;
  player?: SeatPlayer;
  reducedMotion: boolean;
  active: boolean;
  dealer: boolean;
  children?: ReactNode;
}) {
  const side = scoreSide && scoreSideStyle(scoreSide);
  const portrait = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!player || position === "bottom" || reducedMotion) return;
      gsap.from(portrait.current, {
        opacity: 0,
        scale: 0.76,
        y: -10,
        duration: 0.36,
        ease: "power2.out",
      });
    },
    { dependencies: [player, position, reducedMotion], revertOnUpdate: true },
  );

  return (
    <li
      data-match-seat={playerId}
      data-side={position === "right" || position === "upper-right" ? "right" : "left"}
      className={cn(
        "group absolute flex -translate-y-1/2 items-center text-artwork-foreground drop-shadow-md [--seat-size:clamp(2.15rem,7cqmin,4.5rem)] portrait:[--seat-size:clamp(2.5rem,8cqmin,4.5rem)]",
        positions[position],
      )}
    >
      <div className="relative z-10 shrink-0">
        {active && <span className="sr-only">Active seat</span>}
        <TurnPointer active={active} />
        <div ref={portrait} aria-hidden="true">
          {player ? (
            <PlayerPortrait
              avatarUrl={player.avatarUrl}
              highlighted={active}
              className={medallionSize}
              fallback={
                <span
                  className={cn(
                    "grid size-full place-items-center bg-linear-to-b title-type text-base text-artwork-foreground sm:text-lg",
                    side ? side.plate : "from-slate-700 to-artwork-shadow",
                  )}
                >
                  {Array.from(player.name)[0]?.toUpperCase()}
                </span>
              }
            />
          ) : (
            <span
              className={cn(
                "grid place-items-stretch bg-linear-to-b from-gold to-gold/50 p-0.5",
                openSeatEdge,
                medallionSize,
              )}
            >
              <span
                className={cn(
                  "grid place-items-center bg-artwork-shadow text-gold/75",
                  openSeatEdge,
                )}
              >
                <Icon icon={woodenChair} className="size-[58%]" />
              </span>
            </span>
          )}
        </div>
      </div>
      <MatchPlaque className="-ml-(--seat-plaque-overlap) min-h-[clamp(1.35rem,calc(var(--seat-size)*0.55),2.5rem)] min-w-(--seat-plaque-width) justify-start gap-1 px-2.5 py-0.5 pl-[calc(0.5rem+var(--seat-plaque-overlap))] text-[clamp(0.625rem,calc(var(--seat-size)*0.23),0.9375rem)] [--seat-plaque-overlap:calc(var(--seat-size)*0.18)] [--seat-plaque-width:clamp(3.75rem,calc(var(--seat-size)*1.25),5.75rem)] group-data-[side=right]:-mr-(--seat-plaque-overlap) group-data-[side=right]:ml-0 group-data-[side=right]:justify-end group-data-[side=right]:pr-[calc(0.5rem+var(--seat-plaque-overlap))] group-data-[side=right]:pl-2.5 compact-landscape:[--seat-plaque-overlap:max(0.875rem,calc(var(--seat-size)*0.26))]">
        {side && (
          <span
            aria-hidden="true"
            className={cn("match-plaque-team-face bg-linear-to-b", side.plate)}
          />
        )}
        <span
          className="max-w-[clamp(5rem,19cqw,9rem)] min-w-0 truncate portrait:max-w-[clamp(4rem,15cqw,7rem)]"
          title={player?.name}
        >
          {position === "bottom" ? "You" : (player?.name ?? "Open seat")}
        </span>
        {dealer && (
          <span className="shrink-0 text-gold group-data-[side=right]:order-first">
            <span aria-hidden="true" className="group-data-[side=right]:hidden">
              ·{" "}
            </span>
            Dealer
            <span aria-hidden="true" className="hidden group-data-[side=right]:inline">
              {" "}
              ·
            </span>
          </span>
        )}
        {side && <span className="sr-only">{side.name} side</span>}
      </MatchPlaque>
      {children}
    </li>
  );
}
