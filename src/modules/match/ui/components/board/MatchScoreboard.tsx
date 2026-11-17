import tile from "@/assets/lobby/tavern-match/score-ivory-tile.webp";
import type { GameState } from "@/domain/entities/GameState";

import { matchSideSeals } from "./matchSideSeals";
import { scoreSideStyle } from "./scoreSideStyle";
import "./MatchScoreboard.css";

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
    <ul
      aria-label="Scores"
      data-two-scores={scores.length === 2 || undefined}
      className="match-scoreboard relative isolate flex max-w-full items-start justify-center gap-2 px-9 pt-1 pb-3 data-[two-scores]:gap-3.5 data-[two-scores]:px-10 sm:gap-3 sm:px-11 sm:pb-4 sm:data-[two-scores]:gap-5 sm:data-[two-scores]:px-13 compact-landscape:gap-1.5 compact-landscape:px-7 compact-landscape:pb-2.5 compact-landscape:data-[two-scores]:gap-3.5 compact-landscape:data-[two-scores]:px-9"
    >
      {scores.map(({ side, label, score }) => {
        const seal = matchSideSeals.get(side);
        return (
          <li
            key={side}
            className="relative isolate grid aspect-[7/5] w-11 min-w-0 place-items-center sm:w-14 compact-landscape:w-10"
          >
            <span className="sr-only">
              {state.scores.type === "team" ? (scoreSideStyle(side)?.name ?? label) : label}
            </span>
            <img
              src={tile}
              alt=""
              className="pointer-events-none absolute inset-0 -z-10 size-full"
            />
            <strong className="pb-[12%] title-type text-base leading-none font-normal text-artwork-shadow tabular-nums sm:text-xl compact-landscape:text-sm">
              {score}
            </strong>
            {seal && (
              <img
                src={seal}
                alt=""
                className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[64%] w-auto max-w-none -translate-x-1/2 translate-y-[56%] object-contain drop-shadow-sm"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
