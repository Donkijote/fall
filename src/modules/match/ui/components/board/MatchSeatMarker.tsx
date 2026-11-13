import { cn } from "cn";
import gsap from "gsap";
import { useRef } from "react";
import type { ReactNode } from "react";

import woodenChair from "@/assets/lobby/tavern-match/wooden-chair.svg";
import { Icon } from "@/components/icons/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGSAP } from "@gsap/react";

import type { MatchSeat } from "../../../application/matchSeats";

export type SeatPlayer = { name: string; avatarUrl?: string };

const positions: Record<MatchSeat, string> = {
  bottom: "left-1/2 top-[87%] -translate-x-1/2",
  top: "left-1/2 top-[21%] -translate-x-1/2",
  left: "left-[4%] top-1/2 portrait:top-[37%] compact-landscape:left-2",
  right: "right-[4%] top-1/2 portrait:top-[37%] flex-row-reverse compact-landscape:right-2",
  "upper-left": "left-[8%] top-[35%] portrait:left-[4%]",
  "upper-right": "right-[8%] top-[35%] flex-row-reverse portrait:right-[4%]",
};

const plaqueEdge =
  "[clip-path:polygon(0_0,calc(100%_-_0.5rem)_0,100%_0.5rem,100%_calc(100%_-_0.5rem),calc(100%_-_0.5rem)_100%,0_100%)] group-data-[side=right]:[clip-path:polygon(0_0.5rem,0.5rem_0,100%_0,100%_100%,0.5rem_100%,0_calc(100%_-_0.5rem))]";
const openSeatEdge =
  "[clip-path:polygon(23%_0,77%_0,100%_23%,100%_77%,77%_100%,23%_100%,0_77%,0_23%)]";
const medallionSize = "size-(--seat-size)";

export function MatchSeatMarker({
  position,
  playerId,
  team,
  player,
  reducedMotion,
  active,
  dealer,
  children,
}: {
  position: MatchSeat;
  playerId?: string;
  team?: string;
  player?: SeatPlayer;
  reducedMotion: boolean;
  active: boolean;
  dealer: boolean;
  children?: ReactNode;
}) {
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
        {active && (
          <>
            <span className="sr-only">Active seat</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 grid h-2.5 w-4 -translate-x-1/2 rotate-180 place-items-center bg-gold [clip-path:polygon(50%_0,100%_100%,0_100%)]"
            >
              <span className="mt-0.5 h-1.5 w-2.5 bg-linear-to-b from-amber-100 to-gold [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
            </span>
          </>
        )}
        <div ref={portrait} aria-hidden="true">
          {player ? (
            <Avatar
              className={cn(
                "border-2 border-gold/75 bg-artwork-shadow p-0.5 ring-1 ring-artwork-shadow",
                medallionSize,
                active && "border-gold ring-2 ring-gold/65 shadow-[0_0_0.8rem_var(--gold)]",
              )}
            >
              <AvatarImage src={player.avatarUrl} alt="" />
              <AvatarFallback className="bg-linear-to-b from-slate-700 to-artwork-shadow title-type text-base text-artwork-foreground sm:text-lg">
                {Array.from(player.name)[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
      <span className="relative -ml-2 min-w-16 group-data-[side=right]:-mr-2 group-data-[side=right]:ml-0">
        <span className={cn("block bg-linear-to-b from-gold/85 to-gold/45 p-px", plaqueEdge)}>
          <span
            className={cn(
              "title-type block max-w-[29cqw] portrait:max-w-[23cqw] portrait:pr-2 portrait:pl-3 portrait:group-data-[side=right]:pr-3 portrait:group-data-[side=right]:pl-2 truncate pr-3 pl-4 text-center whitespace-nowrap h-[calc(var(--seat-size)*0.58)] content-center leading-none text-[clamp(0.625rem,calc(var(--seat-size)*0.28),1rem)] group-data-[side=right]:pr-4 group-data-[side=right]:pl-3",
              player ? "bg-linear-to-b from-slate-700 to-artwork-shadow" : "bg-artwork-shadow",
              plaqueEdge,
            )}
          >
            {position === "bottom" ? "You" : (player?.name ?? "Open seat")}
          </span>
        </span>
        {team && (
          <span
            className={cn(
              "absolute left-1 rounded-sm bg-artwork-shadow px-1 text-[0.55rem] leading-tight whitespace-nowrap",
              position === "bottom" ? "sr-only" : dealer ? "bottom-full" : "top-full",
              team === "Your team" ? "text-gold" : "text-artwork-foreground",
            )}
          >
            {team === "Your team" ? (position === "bottom" ? "Your team" : "Ally") : "Opponent"}
          </span>
        )}
        {dealer && (
          <span className="absolute -right-1.5 bottom-0 z-10 translate-y-[65%] rounded-sm border border-gold bg-gold px-0.75 py-px title-type text-[0.5rem] leading-none whitespace-nowrap text-artwork-shadow shadow-sm shadow-artwork-shadow/70">
            Dealer
          </span>
        )}
      </span>
      {children}
    </li>
  );
}
