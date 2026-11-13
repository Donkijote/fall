import { cn } from "cn";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

import type { GameMode, GameState } from "@/domain/entities/GameState";
import { toCardKey } from "@/domain/helpers/card";

import { useGSAP } from "@gsap/react";

import { localPlayerId, playMatchCard, type MatchFrame } from "../../../application/localMatch";
import { getMatchSeats, simulatedGuests } from "../../../application/matchSeats";
import { MatchMotionLayer } from "../flow/MatchMotionLayer";
import { MatchResult } from "../overlays/MatchResult";
import { MatchSeatCards, MatchTableCards } from "./MatchBoardCards";
import { MatchControls } from "./MatchControls";
import { MatchScoreboard } from "./MatchScoreboard";
import { MatchSeatMarker, type SeatPlayer } from "./MatchSeatMarker";

export function PlayableBoard({
  mode,
  title,
  player,
  frame,
  act,
  completeMotion,
  reducedMotion,
  returning,
  paused,
  close,
  leaveControl,
}: {
  mode: GameMode;
  title: string;
  player: SeatPlayer;
  frame: MatchFrame;
  act: (transition: (state: GameState) => MatchFrame[]) => void;
  completeMotion: () => void;
  reducedMotion: boolean;
  returning: boolean;
  paused: boolean;
  close: () => void;
  leaveControl: ReactNode;
}) {
  const hud = useRef<HTMLDivElement>(null);
  const scope = useRef<HTMLDivElement>(null);
  const restoreHandFocus = useRef(false);
  const { state, motion } = frame;
  const seats = getMatchSeats(mode);
  const landing =
    motion?.kind === "play"
      ? state.players
          .find(({ id }) => id === motion.player)
          ?.hand.find((card) => toCardKey(card) === motion.card)
      : undefined;
  const canPlay =
    !returning && !motion && state.phase === "play" && state.currentPlayer === localPlayerId;
  const finished = !motion && state.phase === "gameOver";

  useGSAP(
    () => {
      if (!reducedMotion) gsap.from(hud.current, { opacity: 0, duration: 0.28, ease: "sine.out" });
    },
    { scope: hud },
  );

  useLayoutEffect(() => {
    if (!returning && canPlay && restoreHandFocus.current) {
      restoreHandFocus.current = false;
      if (document.activeElement === document.body) {
        scope.current
          ?.querySelector<HTMLButtonElement>('[data-match-hand="local"] button')
          ?.focus({ preventScroll: true });
      }
    }
  }, [canPlay, returning]);

  function playerName(id: string) {
    if (id === localPlayerId) return "You";
    return simulatedGuests[state.players.findIndex((seat) => seat.id === id) - 1]?.name ?? id;
  }

  function sideName(side: string) {
    if (state.scores.type === "team") return side === "1" ? "Your team" : "Opponents";
    const owner = state.players.find(({ team }) => String(team) === side);
    return owner ? playerName(owner.id) : side;
  }

  return (
    <>
      <div className="absolute inset-0" inert={returning || finished}>
        <h1 className="sr-only">{title}</h1>
        <div
          ref={hud}
          className="pointer-events-none absolute inset-x-[max(var(--safe-area-left),var(--safe-area-right),0.25rem)] top-[calc(var(--safe-area-top)+0.25rem)] z-10 grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start"
        >
          <div
            className={cn(
              "col-start-2 justify-self-center",
              mode !== "1vs2" &&
                "compact-landscape:col-span-2 compact-landscape:col-start-1 compact-landscape:justify-self-start",
            )}
          >
            <MatchScoreboard state={state} sideName={sideName} />
          </div>
          {leaveControl}
        </div>
        <div ref={scope} className="[container-type:size] absolute inset-0">
          <MatchTableCards cards={state.table} landing={landing} />
          <ul
            aria-label="Table seats"
            className="pointer-events-none absolute inset-[var(--safe-area-top)_var(--safe-area-right)_var(--safe-area-bottom)_var(--safe-area-left)]"
          >
            {state.players.map((seat, index) => {
              const position = seats[index];
              return (
                <MatchSeatMarker
                  key={position}
                  playerId={seat.id}
                  position={position}
                  player={index === 0 ? player : simulatedGuests[index - 1]}
                  reducedMotion
                  active={
                    state.phase === "dealerChoice"
                      ? seat.id === state.dealer
                      : state.phase === "play" && seat.id === state.currentPlayer
                  }
                  dealer={seat.id === state.dealer}
                  scoreSide={String(seat.team)}
                >
                  <MatchSeatCards
                    hand={seat.hand}
                    collected={seat.collected.length}
                    deck={seat.id === state.dealer ? state.deck.length : undefined}
                    player={seat.id}
                    local={index === 0}
                    canPlay={canPlay}
                    reducedMotion={reducedMotion}
                    play={(card) => {
                      restoreHandFocus.current = Boolean(
                        scope.current
                          ?.querySelector('[data-match-hand="local"]')
                          ?.contains(document.activeElement),
                      );
                      act((current) => playMatchCard(current, localPlayerId, card));
                    }}
                    align={
                      position === "bottom" || position === "top"
                        ? "center"
                        : position === "right" || position === "upper-right"
                          ? "right"
                          : "left"
                    }
                  />
                </MatchSeatMarker>
              );
            })}
          </ul>
          <MatchControls
            frame={frame}
            sideName={sideName}
            act={act}
            reducedMotion={reducedMotion}
            returning={returning}
            paused={paused}
          />
          <MatchMotionLayer
            board={scope}
            frame={frame}
            reducedMotion={reducedMotion}
            returning={returning}
            complete={completeMotion}
          />
        </div>
      </div>
      {finished && (
        <MatchResult
          state={state}
          sideName={sideName}
          reducedMotion={reducedMotion}
          returning={returning}
          close={close}
        />
      )}
    </>
  );
}
