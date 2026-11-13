import { cn } from "cn";

import counter from "@/assets/lobby/tavern-match/score-counter.webp";
import tally from "@/assets/lobby/tavern-match/score-tally.webp";
import type { GameState } from "@/domain/entities/GameState";

import { scoreSideStyle } from "./scoreSideStyle";

export function getMatchScores(state: GameState, sideName: (side: string) => string) {
  return [...new Set(state.players.map(({ team }) => String(team)))].map((side) => ({
    side,
    label: sideName(side),
    score: state.scores.values[side] ?? 0,
  }));
}

export function MatchScoreboard({
  state,
  sideName,
}: {
  state: GameState;
  sideName: (side: string) => string;
}) {
  const scores = getMatchScores(state, sideName);

  return (
    <div className="relative isolate max-w-full px-5 pt-4 pb-2 text-artwork-foreground sm:px-6 compact-landscape:pt-3 compact-landscape:pb-1.5">
      <img src={tally} alt="" className="pointer-events-none absolute inset-0 -z-10 size-full" />
      <ul
        aria-label="Scores"
        className="flex items-center justify-center gap-2 sm:gap-4 compact-landscape:gap-2"
      >
        {scores.map(({ side, label, score }) => {
          const style = scoreSideStyle(side);
          const team = state.scores.type === "team";
          return (
            <li key={side} className="grid min-w-0 justify-items-center gap-0.5">
              <span className="sr-only">{team ? (style?.name ?? label) : label}</span>
              <strong
                className={cn(
                  "relative isolate block h-8 w-12 title-type text-artwork-foreground tabular-nums sm:h-9 sm:w-14 compact-landscape:h-7 compact-landscape:w-11",
                  state.players.length === 2 && "w-14 sm:w-17 compact-landscape:w-12",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-[30%_8%_18%] -z-20 rounded-md bg-linear-to-b",
                    style?.plate ?? "from-slate-700 to-artwork-shadow",
                  )}
                />
                <img
                  src={counter}
                  alt=""
                  className="pointer-events-none absolute inset-0 -z-10 size-full"
                />
                <span className="absolute inset-[33%_12%_21%] grid place-items-center text-[0.8125rem] leading-none sm:text-[0.9375rem] compact-landscape:text-xs">
                  {score}
                </span>
              </strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
