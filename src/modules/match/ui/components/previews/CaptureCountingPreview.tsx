import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { ActionButton } from "@/components";
import type { GameMode } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";
import { createMatchState } from "@/domain/services/matchSetup";
import { getCountingGroups } from "@/domain/services/scoring";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import type { MatchFrame } from "../../../application/localMatch";
import { getMatchSeats } from "../../../application/matchSeats";
import { MatchSeatCards } from "../board/MatchBoardCards";
import { MatchSeatMarker } from "../board/MatchSeatMarker";
import { MatchMotionLayer } from "../flow/MatchMotionLayer";
import { CaptureCount } from "../overlays/CaptureCount";

const sideName = (side: string) => `Team ${side}`;
const noop = () => {};

function CountingTable({
  mode,
  total,
  quota,
  speed,
}: {
  mode: GameMode;
  total: number;
  quota: number;
  speed: number;
}) {
  const board = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Unlike the live board, this fixture mounts directly into a motion frame.
  // Child layout effects run before the parent's board ref is attached.
  useLayoutEffect(() => setReady(true), []);
  const reducedMotion = useReducedMotion();
  const [finished, setFinished] = useState(false);
  const frame = useMemo<MatchFrame>(() => {
    const state = createMatchState("local", mode);
    const deck = createDeck();
    const sideCards = new Map([
      [1, deck.slice(0, total)],
      [2, deck.slice(total)],
    ]);
    if (mode === "1vs2") {
      const remaining = sideCards.get(2)!;
      sideCards.set(2, remaining.slice(0, Math.ceil(remaining.length / 2)));
      sideCards.set(3, remaining.slice(Math.ceil(remaining.length / 2)));
    }
    const players = state.players.map((player) => {
      const side = sideCards.get(player.team)!;
      const teammates = state.players.filter(({ team }) => team === player.team);
      const seat = teammates.findIndex(({ id }) => id === player.id);
      return { ...player, collected: side.filter((_, index) => index % teammates.length === seat) };
    });
    const counted = { ...state, players, phase: "roundEnd" as const };
    return {
      state: counted,
      motion: {
        kind: "count",
        groups: getCountingGroups(counted).map((group) => ({ ...group, quota })),
        piles: players.map(({ id, team, collected }) => ({
          player: id,
          side: team,
          cards: collected,
        })),
      },
    };
  }, [mode, total, quota]);
  const groups = frame.motion?.kind === "count" ? frame.motion.groups : [];
  const seats = getMatchSeats(mode);
  return (
    <div
      ref={board}
      className="[container-type:size] absolute inset-0 isolate overflow-hidden bg-background"
    >
      <ul aria-label="Example collected piles" className="absolute inset-0">
        {frame.state.players.map((player, index) => (
          <MatchSeatMarker
            key={player.id}
            playerId={player.id}
            position={seats[index]}
            player={{ name: index === 0 ? "You" : `Player ${index + 1}` }}
            scoreSide={String(player.team)}
            reducedMotion
            active={false}
            dealer={false}
          >
            <MatchSeatCards
              hand={[]}
              collected={finished ? 0 : player.collected.length}
              player={player.id}
              local={index === 0}
              canPlay={false}
              reducedMotion
              play={noop}
              align="center"
            />
          </MatchSeatMarker>
        ))}
      </ul>
      <div data-count-overlay="" className="pointer-events-none absolute inset-0 z-10">
        <CaptureCount
          groups={groups}
          sideName={sideName}
          snapshot={
            finished
              ? Object.fromEntries(
                  groups.map(({ side, cards, quota }) => [
                    side,
                    { counted: cards, points: Math.max(0, cards - quota) },
                  ]),
                )
              : undefined
          }
        />
      </div>
      {ready && !finished && (
        <MatchMotionLayer
          board={board}
          frame={frame}
          reducedMotion={reducedMotion}
          returning={false}
          countSpeed={speed}
          complete={() => setFinished(true)}
        />
      )}
      <p role="status" className="sr-only">
        {finished ? "Counting complete" : "Counting captured cards into each team pocket"}
      </p>
    </div>
  );
}

/** Uses the live counter artwork, measured pockets and card renderer. */
export function CaptureCountingPreview({
  total,
  quota,
  speed = 1,
  revision = 0,
}: {
  total: number;
  quota: number;
  speed?: number;
  revision?: number;
}) {
  const [mode, setMode] = useState<GameMode>("2vs2");
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-2">
      <div className="flex flex-wrap justify-center gap-2">
        {(["1vs1", "1vs2", "2vs2"] as const).map((value) => (
          <ActionButton
            key={value}
            tone="outline"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {value}
          </ActionButton>
        ))}
      </div>
      <div className="relative min-h-0 flex-1">
        <CountingTable
          key={`${mode}:${total}:${quota}:${speed}:${revision}`}
          mode={mode}
          total={total}
          quota={quota}
          speed={speed}
        />
      </div>
    </div>
  );
}
