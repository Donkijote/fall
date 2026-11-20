import { cn } from "cn";
import gsap from "gsap";
import { useRef } from "react";

import defeat from "@/assets/lobby/tavern-match/defeat-crest.webp";
import victory from "@/assets/lobby/tavern-match/victory-crest.webp";
import { ActionButton } from "@/components/actions/ActionButton";
import { PointsBadge } from "@/components/cards/PointsBadge";
import type { GameState } from "@/domain/entities/GameState";

import { useGSAP } from "@gsap/react";

import { localPlayerId } from "../../../application/localMatch";
import { MatchPlaque } from "../board/MatchPlaque";
import { getMatchScores } from "../board/MatchScoreboard";
import { scoreSideStyle } from "../board/scoreSideStyle";
import "./MatchResult.css";

export function MatchResult({
  state,
  sideName,
  reducedMotion,
  returning,
  close,
}: {
  state: GameState;
  sideName: (side: string) => string;
  reducedMotion: boolean;
  returning: boolean;
  close: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const winner = state.winner;
  const won = state.players.some(({ id, team }) => id === localPlayerId && String(team) === winner);
  const standings = getMatchScores(state, sideName).sort(
    (a, b) => Number(b.side === winner) - Number(a.side === winner) || b.score - a.score,
  );
  const outcome = won ? "Victory" : "Defeat";

  useGSAP(
    () => {
      title.current?.focus({ preventScroll: true });
      if (!reducedMotion) {
        gsap.from(result.current, {
          opacity: 0,
          scale: won ? 0.94 : 1,
          y: 6,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    },
    { scope: result, dependencies: [reducedMotion, won] },
  );

  return (
    <div
      className="absolute inset-0 z-20 grid place-items-center overflow-y-auto bg-artwork-shadow/75 px-[max(1rem,var(--safe-area-left),var(--safe-area-right))] pt-[max(0.75rem,var(--safe-area-top))] pb-[max(0.75rem,var(--safe-area-bottom))] text-artwork-foreground"
      data-match-result=""
      role="region"
      aria-label="Match result"
    >
      <div
        ref={result}
        className="grid w-[min(100%,28rem)] justify-items-center gap-1 text-center lg:gap-2"
      >
        <div className="relative grid w-[min(100%,45dvh)] place-items-center lg:w-[min(100%,27rem)]">
          <img src={won ? victory : defeat} alt="" className="w-full" />
          <h2
            ref={title}
            tabIndex={-1}
            className="absolute top-[67%] -translate-y-1/2 artwork-title text-[clamp(1.25rem,6dvh,2rem)] outline-none lg:text-[clamp(2rem,8vmin,3.75rem)] lg:leading-none"
          >
            {outcome}
          </h2>
        </div>
        <ol
          aria-label="Final standings"
          className="match-result-standings relative isolate grid w-[min(100%,19rem)] gap-1 px-6 py-3.5 lg:w-[min(100%,22rem)] lg:gap-2 lg:px-7 lg:py-5"
        >
          {standings.map(({ side, label, score }) => {
            const team = scoreSideStyle(side);
            return (
              <li
                key={side}
                className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
              >
                <MatchPlaque className="min-h-7 w-[clamp(7rem,20vw,9.5rem)] max-w-full justify-self-start px-4 text-sm lg:min-h-8 lg:w-[clamp(7rem,34vw,11rem)]">
                  {team && (
                    <span
                      aria-hidden="true"
                      className={cn("match-plaque-team-face bg-linear-to-b", team.plate)}
                    />
                  )}
                  <span className="min-w-0 truncate" title={label}>
                    {label}
                  </span>
                  {side === winner && <span className="sr-only">, winner</span>}
                </MatchPlaque>
                <PointsBadge
                  points={score}
                  label={`${score} ${score === 1 ? "point" : "points"}`}
                  className="size-11 lg:size-13"
                />
              </li>
            );
          })}
        </ol>
        <ActionButton
          tone="primary"
          className="min-w-48 text-sm"
          onClick={close}
          aria-disabled={returning}
        >
          Back to Tavern
        </ActionButton>
      </div>
    </div>
  );
}
