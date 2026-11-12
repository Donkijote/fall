import { useLayoutEffect, useRef } from "react";

import type { GameMode, GameState } from "@/domain/entities/GameState";

import { localPlayerId, playMatchCard, type MatchFrame } from "../../../application/localMatch";
import { getMatchSeats, simulatedGuests } from "../../../application/matchSeats";
import { MatchMotionLayer } from "../flow/MatchMotionLayer";
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
  close,
}: {
  mode: GameMode;
  title: string;
  player: SeatPlayer;
  frame: MatchFrame;
  act: (transition: (state: GameState) => MatchFrame[]) => void;
  completeMotion: () => void;
  reducedMotion: boolean;
  returning: boolean;
  close: () => void;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const restoreHandFocus = useRef(false);
  const { state, motion } = frame;
  const seats = getMatchSeats(mode);
  const canPlay =
    !returning && !motion && state.phase === "play" && state.currentPlayer === localPlayerId;
  const finished = !motion && state.phase === "gameOver";

  useLayoutEffect(() => {
    if (returning) return;
    if (finished) {
      scope.current
        ?.querySelector<HTMLElement>("[data-match-result]")
        ?.focus({ preventScroll: true });
    } else if (canPlay && restoreHandFocus.current) {
      restoreHandFocus.current = false;
      if (document.activeElement === document.body) {
        scope.current
          ?.querySelector<HTMLButtonElement>('[data-match-hand="local"] button')
          ?.focus({ preventScroll: true });
      }
    }
  }, [canPlay, finished, returning]);

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
    <div ref={scope} className="absolute inset-0" inert={returning}>
      <MatchScoreboard title={title} frame={frame} sideName={sideName} playerName={playerName} />
      <MatchTableCards cards={state.table} />
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
              team={state.scores.type === "team" ? sideName(String(seat.team)) : undefined}
            >
              <MatchSeatCards
                hand={seat.hand}
                collected={seat.collected.length}
                deck={seat.id === state.dealer ? state.deck.length : undefined}
                player={seat.id}
                local={index === 0}
                canPlay={canPlay}
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
      <MatchControls frame={frame} sideName={sideName} act={act} close={close} />
      <MatchMotionLayer
        board={scope}
        frame={frame}
        reducedMotion={reducedMotion}
        returning={returning}
        complete={completeMotion}
      />
    </div>
  );
}
