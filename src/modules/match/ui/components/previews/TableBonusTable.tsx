import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { SuitGlyph } from "@/components/cards/SuitGlyph";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import type { MatchFrame } from "../../../application/localMatch";
import { tableBonusPreview } from "../../../application/tableBonusPreview";
import { MatchScoreboard } from "../board/MatchScoreboard";
import { MatchPointsLayer } from "../flow/MatchPointsLayer";
import { PerfectTableAward } from "../flow/tableBonus/PerfectTableAward";
import { TableBonusDecoration } from "../flow/tableBonus/TableBonusDecoration";
import { createTableBonusEffects } from "../flow/tableBonus/tableBonusEffects";
import { TableBonusFlames } from "../flow/tableBonus/TableBonusFlames";
import { useScorePresentation } from "../flow/useScorePresentation";
import type { TableBonusSettings } from "./TableBonusControls";
import { tableBonusPlayback } from "./tableBonusPlayback";

const sideName = (side: string) => `Side ${side}`;
export function TableBonusTable({
  settings,
  playing,
  speed,
}: {
  settings: TableBonusSettings;
  playing: boolean;
  speed: number;
}) {
  const board = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const effects = useMemo(createTableBonusEffects, []);
  const [effectsCleared, setEffectsCleared] = useState(false);
  const fixture = useMemo(
    () =>
      tableBonusPreview(
        settings.mode,
        settings.pattern,
        settings.order,
        settings.example,
        settings.dealer,
      ),
    [settings],
  );
  const { before, resolved } = fixture;
  const award = resolved.scoreAwards?.at(-1);
  const [frame, setFrame] = useState<MatchFrame>(() => ({ state: before }));
  const [announcement, setAnnouncement] = useState("Ready to deal");
  const points = useScorePresentation(frame, reducedMotion);
  useLayoutEffect(() => {
    if (!playing || !board.current) return;
    setFrame({ state: resolved, motion: { kind: "deal", cards: [], dealer: resolved.dealer } });
    const context = gsap.context(() => {
      tableBonusPlayback(
        board.current!,
        resolved,
        award,
        reducedMotion,
        () => {
          setFrame({ state: resolved });
        },
        setAnnouncement,
        effects,
      )?.timeScale(speed);
    }, board);
    return () => context.revert();
  }, [playing, resolved, award, reducedMotion, speed, effects]);
  useLayoutEffect(() => {
    if (!effectsCleared || !board.current) return;
    const context = gsap.context(() => {
      gsap.set("[data-bonus-glow], [data-bonus-sheen], [data-bonus-burst], [data-perfect-award]", {
        opacity: 0,
      });
      for (const effect of effects) {
        gsap.set(effect.heat.current.strength, { value: 0 });
        gsap.set(effect.flame.current, { value: 0 });
        gsap.set(effect.ignition.current, { value: 0 });
      }
    }, board);
    return () => context.revert();
  }, [effectsCleared, effects]);
  const expected = settings.pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1];
  return (
    <div
      ref={board}
      className="relative isolate grid min-h-[26rem] grid-rows-[auto_auto_1fr_auto] gap-6 overflow-hidden rounded-md border bg-card p-4 text-card-foreground sm:p-6 [&_*]:transition-none"
    >
      <div className="flex justify-center">
        <MatchScoreboard
          state={resolved}
          displayed={points.displayed}
          sideName={sideName}
          reducedMotion={reducedMotion}
        />
      </div>
      <div className="flex items-center justify-center gap-3 text-sm">
        <span data-dealer-deck className="rounded-md border border-primary bg-primary/15 px-3 py-2">
          Dealer: {resolved.dealer}
        </span>
        <span className="text-muted-foreground">{expected.join(" → ")}</span>
      </div>
      <ol
        aria-label="Opening table pattern"
        className="mx-auto grid w-full max-w-lg grid-cols-4 items-center gap-3 sm:gap-6"
      >
        {resolved.table.map((card, index) => {
          const key = `${card.suit}-${card.rank}`;
          return (
            <li key={key} className="grid min-w-0 gap-3 text-center">
              <span className="text-xs text-muted-foreground">Needs {expected[index]}</span>
              <div
                data-bonus-card={key}
                className="relative isolate mx-auto aspect-[63/88] w-full max-w-24 rounded-md bg-stone-50 p-1 opacity-0 shadow-md"
              >
                <TableBonusDecoration />
                <SuitGlyph
                  suit={card.suit}
                  rank={card.rank}
                  className="size-full object-contain"
                  imgProps={{ loading: "eager" }}
                />
              </div>
            </li>
          );
        })}
      </ol>
      <div aria-label="Dealt hands" className="flex flex-wrap justify-around gap-2">
        {resolved.players.map((player) => (
          <div key={player.id} className="grid justify-items-center gap-1 text-xs">
            <span>
              {player.id} · Side {player.team}
            </span>
            <span className="flex gap-1" aria-label="Three-card hand">
              {player.hand.map((_, index) => (
                <span
                  key={index}
                  data-deal-hand={`${player.id}:${index}`}
                  aria-hidden="true"
                  className="h-8 w-5 rounded-md border border-primary/50 bg-primary/15 opacity-0"
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      {playing && !reducedMotion && !effectsCleared && (
        <TableBonusFlames board={board} effects={effects} cards={resolved.table} />
      )}
      <PerfectTableAward award={award} reducedMotion={reducedMotion} />
      <MatchPointsLayer
        board={board}
        award={points.pending[0]}
        reducedMotion={reducedMotion}
        returning={false}
        sideName={sideName}
        arrive={(id, message) => {
          if (points.pending[0]?.id !== id) return;
          points.arrive(id, message);
          if (points.pending.length === 1) setEffectsCleared(true);
        }}
      />
      <p role="status" className="col-span-full min-h-5 text-center text-sm text-muted-foreground">
        {points.announcement || announcement}
      </p>
    </div>
  );
}
