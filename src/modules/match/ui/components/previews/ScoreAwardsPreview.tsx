import { useRef, useState } from "react";

import { ActionButton } from "@/components";
import type { GameMode, ScoreAward } from "@/domain/entities/GameState";
import { createMatchState } from "@/domain/services/matchSetup";
import { awardPoints } from "@/domain/services/scoring";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import type { MatchFrame } from "../../../application/localMatch";
import { scoreAwardLabel } from "../../../application/scorePresentation";
import { MatchScoreboard } from "../board/MatchScoreboard";
import { MatchPointsLayer } from "../flow/MatchPointsLayer";
import { useScorePresentation } from "../flow/useScorePresentation";

const sideName = (side: string) => `Side ${side}`;
const reasons = ["opening", "sing", "clear", "fall", "count", "other"] as const;

function PreviewTable({ mode }: { mode: GameMode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState<MatchFrame>(() => ({
    state: createMatchState("local", mode),
  }));
  const points = useScorePresentation(frame, reducedMotion);
  function add(reason: ScoreAward["reason"], multiple = false, winning = false) {
    setFrame(({ state }) => {
      let next = state;
      for (const player of multiple ? state.players : [state.players[0]]) {
        next = awardPoints(next, player.id, winning ? 24 : reason === "clear" ? 4 : 2, {
          reason,
          source: reason === "sing" ? "hand" : reason === "count" ? "collector" : "table",
        });
      }
      return { state: next };
    });
  }
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <ActionButton key={reason} tone="outline" onClick={() => add(reason)}>
            {scoreAwardLabel({ reason } as ScoreAward)}
          </ActionButton>
        ))}
        <ActionButton tone="outline" onClick={() => add("count", true)}>
          All recipients
        </ActionButton>
        <ActionButton tone="outline" onClick={() => add("sing", false, true)}>
          Winning amount
        </ActionButton>
        <ActionButton
          tone="outline"
          onClick={() => setFrame(({ state }) => ({ state: { ...state }, snapshot: true }))}
        >
          Reconnect snapshot
        </ActionButton>
      </div>
      <div ref={root} className="relative isolate h-96 overflow-hidden rounded-md bg-background">
        <div className="absolute inset-x-0 top-2 flex justify-center">
          <MatchScoreboard
            state={frame.state}
            sideName={sideName}
            displayed={points.displayed}
            reducedMotion={reducedMotion}
          />
        </div>
        <div className="absolute inset-x-4 bottom-4 flex justify-around gap-2">
          {frame.state.players.map((player) => (
            <div key={player.id} className="grid gap-2 text-sm text-foreground">
              <span data-match-hand={player.id}>
                {player.id} · Side {player.team}
              </span>
              <span data-collector={player.id} className="text-muted-foreground">
                Capture pocket
              </span>
            </div>
          ))}
        </div>
        <MatchPointsLayer
          board={root}
          award={points.pending[0]}
          reducedMotion={reducedMotion}
          returning={false}
          sideName={sideName}
          arrive={points.arrive}
        />
        <p role="status" className="sr-only">
          {points.announcement}
        </p>
      </div>
    </div>
  );
}

export function ScoreAwardsPreview() {
  const [mode, setMode] = useState<GameMode>("1vs1");
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
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
      <PreviewTable key={mode} mode={mode} />
    </div>
  );
}
