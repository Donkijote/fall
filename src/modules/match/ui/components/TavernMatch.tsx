import gsap from "gsap";
import { X } from "lucide-react";
import { useRef, useState } from "react";

import landscape from "@/assets/lobby/tavern-match/table-landscape.webp";
import portrait from "@/assets/lobby/tavern-match/table-portrait.webp";
import { ActionButton } from "@/components/actions/ActionButton";
import type { GameMode } from "@/domain/entities/GameState";

import { useGSAP } from "@gsap/react";

import { getMatchSeats, previewGuests } from "../../application/matchPreview";
import { MatchSeatMarker, type SeatPlayer } from "./MatchSeatMarker";
import { TavernMatchAtmosphere } from "./TavernMatchAtmosphere";
import { useMatchPreview } from "./useMatchPreview";

export function TavernMatchArtworkPreload() {
  return (
    <>
      <link rel="preload" as="image" href={landscape} media="(orientation: landscape)" />
      <link rel="preload" as="image" href={portrait} media="(orientation: portrait)" />
    </>
  );
}

type TavernMatchProps = {
  mode: GameMode;
  title: string;
  player: SeatPlayer;
  returning: boolean;
  reducedMotion: boolean;
  cancel: () => void;
};

export function TavernMatch({
  mode,
  title,
  player,
  returning,
  reducedMotion,
  cancel,
}: TavernMatchProps) {
  const seats = getMatchSeats(mode);
  const guestCount = useMatchPreview(seats.length, returning);
  const connectedCount = guestCount + 1;
  const ready = connectedCount === seats.length;
  const [waitingFaded, setWaitingFaded] = useState(false);
  const waitingOverlay = useRef<HTMLDivElement>(null);
  const showWaiting = !ready || (!reducedMotion && !waitingFaded);

  useGSAP(
    () => {
      if (!ready || !showWaiting || !waitingOverlay.current) return;

      gsap.to(waitingOverlay.current.children, {
        opacity: 0,
        duration: 0.28,
        ease: "sine.inOut",
        onComplete: () => setWaitingFaded(true),
      });
    },
    { scope: waitingOverlay, dependencies: [ready, showWaiting], revertOnUpdate: true },
  );

  return (
    <div
      data-tavern-match=""
      className="[container-type:size] absolute inset-0 isolate overflow-hidden bg-background"
    >
      <div data-tavern-table-scene="" className="absolute inset-0 isolate">
        <picture
          data-match-artwork=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block"
        >
          <source media="(orientation: portrait)" srcSet={portrait} />
          <img src={landscape} alt="" className="size-full object-fill" />
        </picture>
        <TavernMatchAtmosphere playing={!reducedMotion && !returning} />
        <ul
          aria-label="Table seats"
          className="pointer-events-none absolute inset-[var(--safe-area-top)_var(--safe-area-right)_var(--safe-area-bottom)_var(--safe-area-left)]"
        >
          {seats.map((position, index) => (
            <MatchSeatMarker
              key={position}
              position={position}
              player={
                index === 0 ? player : index <= guestCount ? previewGuests[index - 1] : undefined
              }
              reducedMotion={reducedMotion}
              turnPreview={index === 0}
              dealer={seats.length === 2 ? index === 0 : index === 1 && guestCount > 0}
            />
          ))}
        </ul>
      </div>
      <div
        ref={waitingOverlay}
        data-tavern-match-detail=""
        className="pointer-events-none absolute inset-[var(--safe-area-top)_var(--safe-area-right)_var(--safe-area-bottom)_var(--safe-area-left)] z-10 flex flex-col items-center justify-center gap-[clamp(0.875rem,3.5vmin,1.75rem)] px-4 text-center"
      >
        {showWaiting && (
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-[min(112cqw,100cqh,34rem)] w-[min(124%,114cqh,39rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,var(--artwork-shadow)_0%,transparent_73%)]"
          />
        )}
        <div
          className={
            !showWaiting
              ? "sr-only"
              : "relative grid justify-items-center gap-[clamp(0.75rem,3vmin,1.5rem)]"
          }
        >
          <h1 className="artwork-title text-[clamp(1.5rem,6vmin,3rem)] font-normal">{title}</h1>
          <div
            role="status"
            className="grid justify-items-center gap-3 text-sm text-artwork-foreground drop-shadow-sm sm:text-base"
          >
            {!showWaiting ? (
              "All players connected"
            ) : (
              <span>
                Finding players ·{" "}
                <span className="tabular-nums">
                  {connectedCount}/{seats.length}
                </span>{" "}
                seated
              </span>
            )}
            {showWaiting && (
              <span aria-hidden="true" className="flex gap-2">
                {seats.map((seat, index) => (
                  <span
                    key={seat}
                    data-connected={index < connectedCount}
                    className="h-1 w-[clamp(1.25rem,5vmin,2.5rem)] rounded-full bg-gold/25 data-[connected=true]:bg-gold"
                  />
                ))}
              </span>
            )}
          </div>
        </div>
        <ActionButton
          data-tavern-cancel=""
          tone="quiet"
          iconOnly={!showWaiting}
          className={
            !showWaiting
              ? "pointer-events-auto absolute top-2 right-2 border-0 bg-transparent text-artwork-foreground drop-shadow-md hover:bg-transparent hover:text-gold"
              : "pointer-events-auto relative border border-gold/45 bg-artwork-shadow/65 text-artwork-foreground hover:bg-artwork-shadow hover:text-artwork-foreground"
          }
          onClick={cancel}
          aria-label={!showWaiting ? "Close table" : undefined}
          aria-disabled={returning}
        >
          {!showWaiting ? <X aria-hidden="true" /> : "Cancel matchmaking"}
        </ActionButton>
      </div>
    </div>
  );
}
