import { cn } from "cn";
import gsap from "gsap";
import { useRef } from "react";

import defeat from "@/assets/lobby/tavern-match/defeat-crest.webp";
import standingsArt from "@/assets/lobby/tavern-match/result-standings.webp";
import victory from "@/assets/lobby/tavern-match/victory-crest.webp";
import { ActionButton } from "@/components/actions/ActionButton";
import type { GameState } from "@/domain/entities/GameState";

import { useGSAP } from "@gsap/react";

import { localPlayerId } from "../../../application/localMatch";
import { getMatchScores } from "../board/MatchScoreboard";
import { scoreSideStyle } from "../board/scoreSideStyle";

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
        className="grid w-[min(100%,28rem)] justify-items-center gap-2 text-center compact-landscape:gap-1"
      >
        <div className="relative grid w-[min(100%,27rem)] place-items-center compact-landscape:w-[min(100%,45dvh)]">
          <img src={won ? victory : defeat} alt="" className="w-full" />
          <h2
            ref={title}
            tabIndex={-1}
            className="absolute top-[67%] -translate-y-1/2 artwork-title text-[clamp(2rem,8vmin,3.75rem)] leading-none outline-none compact-landscape:text-[clamp(1.25rem,6dvh,2rem)]"
          >
            {outcome}
          </h2>
        </div>
        <div className="relative isolate w-[min(100%,17rem)] compact-landscape:w-[min(100%,15rem)]">
          <img
            src={standingsArt}
            alt=""
            className="pointer-events-none absolute inset-0 -z-10 size-full"
          />
          <ol
            aria-label="Final standings"
            className="grid gap-1 px-6 py-4 text-left compact-landscape:gap-0.5 compact-landscape:py-3"
          >
            {standings.map(({ side, label, score }, index) => (
              <li key={side} className="flex min-w-0 items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border border-gold/45 bg-linear-to-b title-type text-[0.625rem] leading-none",
                    scoreSideStyle(side)?.plate ?? "from-slate-700 to-artwork-shadow",
                  )}
                >
                  {index + 1}
                </span>
                <span className={cn("min-w-0 flex-1", side === winner && "text-gold")}>
                  {label}
                  {side === winner && <span className="sr-only">, winner</span>}
                </span>
                <strong className="title-type text-lg leading-none text-artwork-foreground tabular-nums">
                  {score}
                </strong>
              </li>
            ))}
          </ol>
        </div>
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
