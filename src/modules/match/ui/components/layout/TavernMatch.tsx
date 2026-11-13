import gsap from "gsap";
import { DoorOpen } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import landscape from "@/assets/lobby/tavern-match/table-landscape.webp";
import portrait from "@/assets/lobby/tavern-match/table-portrait.webp";
import { ActionButton } from "@/components/actions/ActionButton";
import type { GameMode } from "@/domain/entities/GameState";

import { useGSAP } from "@gsap/react";

import { getMatchSeats, simulatedGuests } from "../../../application/matchSeats";
import { MatchSeatMarker, type SeatPlayer } from "../board/MatchSeatMarker";
import { PlayableBoard } from "../board/PlayableBoard";
import { useLocalMatch } from "../flow/useLocalMatch";
import { useSimulatedLobby } from "../flow/useSimulatedLobby";
import { LeaveMatchDialog } from "../overlays/LeaveMatchDialog";
import { WaitingSign } from "../overlays/WaitingSign";
import { TavernMatchAtmosphere } from "./TavernMatchAtmosphere";

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
  const guestCount = useSimulatedLobby(seats.length, returning);
  const connectedCount = guestCount + 1;
  const ready = connectedCount === seats.length;
  const [waitingFaded, setWaitingFaded] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const leaveButton = useRef<HTMLButtonElement>(null);
  const waitingOverlay = useRef<HTMLDivElement>(null);
  const showWaiting = !ready || (!reducedMotion && !waitingFaded);
  const match = useLocalMatch(mode, !showWaiting, returning, reducedMotion, leaveOpen);

  const hasBoard = Boolean(match.frame);
  const finished = match.frame?.state.phase === "gameOver" && !match.frame.motion;

  useEffect(() => {
    if (reducedMotion || typeof WebGL2RenderingContext === "undefined") return;
    void import("../../../adapters/three/MatchCardCanvas")
      .then(({ preloadMatchCardArt }) => preloadMatchCardArt())
      .catch(() => {}); // The match canvas handles unavailable graphics.
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (hasBoard && !returning && document.activeElement === document.body) {
      leaveButton.current?.focus({ preventScroll: true });
    }
  }, [hasBoard, returning]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        event.repeat ||
        leaveOpen ||
        returning
      )
        return;
      if (showWaiting || finished) cancel();
      else setLeaveOpen(true);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [cancel, finished, leaveOpen, returning, showWaiting]);

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
        {match.frame ? (
          <PlayableBoard
            mode={mode}
            title={title}
            player={player}
            frame={match.frame}
            act={match.act}
            completeMotion={match.completeMotion}
            reducedMotion={reducedMotion}
            returning={returning}
            paused={leaveOpen}
            close={cancel}
            leaveControl={
              <ActionButton
                ref={leaveButton}
                iconOnly
                tone="quiet"
                aria-label="Leave match"
                className="pointer-events-auto col-start-3 row-start-1 text-artwork-foreground drop-shadow-[0_2px_3px_var(--artwork-shadow)] hover:bg-transparent hover:text-gold dark:hover:bg-transparent"
                onClick={() => setLeaveOpen(true)}
              >
                <DoorOpen aria-hidden="true" />
              </ActionButton>
            }
          />
        ) : (
          <ul
            aria-label="Table seats"
            className="pointer-events-none absolute inset-[var(--safe-area-top)_var(--safe-area-right)_var(--safe-area-bottom)_var(--safe-area-left)]"
          >
            {seats.map((position, index) => (
              <MatchSeatMarker
                key={position}
                position={position}
                player={
                  index === 0
                    ? player
                    : index <= guestCount
                      ? simulatedGuests[index - 1]
                      : undefined
                }
                reducedMotion={reducedMotion}
                active={false}
                dealer={false}
              />
            ))}
          </ul>
        )}
      </div>
      {showWaiting && (
        <div
          ref={waitingOverlay}
          data-tavern-match-detail=""
          className="absolute inset-[var(--safe-area-top)_var(--safe-area-right)_var(--safe-area-bottom)_var(--safe-area-left)] z-10 grid place-items-center px-4 portrait:pt-[12dvh]"
        >
          <WaitingSign
            title={title}
            filled={connectedCount}
            total={seats.length}
            cancel={cancel}
            returning={returning}
          />
        </div>
      )}
      <LeaveMatchDialog
        open={leaveOpen && !returning}
        setOpen={setLeaveOpen}
        leaveButton={leaveButton}
        leave={cancel}
      />
    </div>
  );
}
