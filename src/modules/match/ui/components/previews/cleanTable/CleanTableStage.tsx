import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { CleanTableSettings } from "../../../../application/cleanTablePreview";
import { cleanTablePreview } from "../../../../application/cleanTablePreview";
import type { MatchFrame } from "../../../../application/localMatch";
import { getMatchSeats } from "../../../../application/matchSeats";
import { MatchSeatCards, MatchTableCards } from "../../board/MatchBoardCards";
import { MatchScoreboard } from "../../board/MatchScoreboard";
import { MatchSeatMarker } from "../../board/MatchSeatMarker";
import { BonusArtworkPreload } from "../../flow/awards/BonusArtworkPreload";
import { CleanTableCelebration } from "../../flow/cleanTable/CleanTableCelebration";
import { cleanTablePlayback } from "../../flow/cleanTable/cleanTablePlayback";
import { MatchMotionLayer } from "../../flow/MatchMotionLayer";
import { MatchPointsLayer } from "../../flow/MatchPointsLayer";
import { useScorePresentation } from "../../flow/useScorePresentation";

const noop = () => {};
const playerName = (id: string) =>
  id === "local" ? "You" : `Player ${Number(id.split("-")[1]) + 1}`;

export function CleanTableStage({
  settings,
  playing,
  reducedMotion,
}: {
  settings: CleanTableSettings;
  playing: boolean;
  reducedMotion: boolean;
}) {
  const board = useRef<HTMLDivElement>(null);
  const fixture = useMemo(() => cleanTablePreview(settings), [settings]);
  const { before, capture, resolved, award } = fixture;
  const [phase, setPhase] = useState<"ready" | "capture" | "celebrate" | "points" | "done">(
    "ready",
  );
  const [frame, setFrame] = useState<MatchFrame>(() => ({ state: before }));
  const points = useScorePresentation(frame, reducedMotion);
  const captured = phase !== "ready" && phase !== "capture";
  const displayedState = captured ? resolved : before;
  const seats = getMatchSeats(settings.mode);
  const sideName = (side: string) =>
    settings.mode === "2vs2"
      ? `Team ${side}`
      : playerName(before.players.find((p) => String(p.team) === side)!.id);
  useLayoutEffect(() => {
    if (!playing) return;
    // Attach the board and establish the pre-award score baseline before mounting motion.
    setFrame(capture);
    setPhase("capture");
  }, [playing, capture]);
  useLayoutEffect(() => {
    if (phase !== "celebrate" || !board.current) return;
    const context = gsap.context(() => {
      cleanTablePlayback(board.current!, award, reducedMotion, () => {
        setFrame({ state: resolved });
        setPhase("points");
      });
    }, board);
    return () => context.revert();
  }, [phase, award, reducedMotion, resolved]);
  function completeCapture() {
    if (award) {
      setFrame({ state: resolved, motion: capture.motion });
      setPhase("celebrate");
    } else {
      setFrame({ state: resolved });
      setPhase(resolved.scoreAwards?.length ? "points" : "done");
    }
  }
  const status =
    phase === "ready"
      ? "Ready to capture"
      : phase === "capture"
        ? "Capturing table cards"
        : phase === "celebrate"
          ? `Clean table! +${award?.amount} points earned.`
          : !award
            ? settings.example === "last-round"
              ? "Table cleared. No clean-table bonus in the last round."
              : "Cards remain. No clean-table bonus."
            : points.announcement || "Sending earned points to the scoreboard";
  return (
    <div
      ref={board}
      data-clean-table-stage
      data-clean-phase={phase}
      className="[container-type:size] relative isolate h-[clamp(20rem,62vh,44rem)] overflow-hidden rounded-md border bg-card text-card-foreground [&_*]:transition-none"
    >
      <BonusArtworkPreload />
      <div className="pointer-events-none absolute inset-x-2 top-1 z-10 flex justify-center">
        <MatchScoreboard
          state={resolved}
          displayed={points.displayed}
          sideName={sideName}
          reducedMotion={reducedMotion}
        />
      </div>
      <MatchTableCards cards={displayedState.table} />
      <ul aria-label="Example table seats" className="pointer-events-none absolute inset-0">
        {displayedState.players.map((player, index) => (
          <MatchSeatMarker
            key={player.id}
            playerId={player.id}
            position={seats[index]}
            player={{ name: playerName(player.id) }}
            scoreSide={String(player.team)}
            reducedMotion
            active={phase === "capture" && player.id === before.currentPlayer}
            dealer={false}
          >
            <MatchSeatCards
              hand={player.hand}
              collected={player.collected.length}
              player={player.id}
              local={index === 0}
              canPlay={false}
              reducedMotion
              play={noop}
              align={
                seats[index] === "top" || seats[index] === "bottom"
                  ? "center"
                  : seats[index] === "right" || seats[index] === "upper-right"
                    ? "right"
                    : "left"
              }
            />
          </MatchSeatMarker>
        ))}
      </ul>
      {phase === "capture" && (
        <MatchMotionLayer
          board={board}
          frame={capture}
          reducedMotion={reducedMotion}
          returning={false}
          complete={completeCapture}
        />
      )}
      {phase === "celebrate" && <CleanTableCelebration award={award} />}
      <MatchPointsLayer
        board={board}
        award={points.pending[0]}
        reducedMotion={reducedMotion}
        returning={false}
        sideName={sideName}
        arrive={(id, message) => {
          if (points.pending[0]?.id !== id) return;
          points.arrive(id, message);
          if (points.pending.length === 1) setPhase("done");
        }}
      />
      <p
        role="status"
        className="pointer-events-none absolute inset-x-2 bottom-1 z-30 text-center text-xs text-muted-foreground"
      >
        {points.announcement || status}
        {phase === "done" && resolved.winner ? " · Match won!" : ""}
      </p>
    </div>
  );
}
