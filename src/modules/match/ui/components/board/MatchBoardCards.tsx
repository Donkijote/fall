import { cn } from "cn";
import { useState } from "react";

import cardBack from "@/assets/cards/back.svg";
import { SuitGlyph } from "@/components/cards/SuitGlyph";
import type { Card } from "@/domain/entities/Card";
import { toCardKey } from "@/domain/helpers/card";

import { MatchHandCard } from "./MatchHandCard";
import { placeTableCards, type TableSlots } from "./tableSlots";

const cardStyle =
  "block aspect-[63/88] w-(--match-card-width) shrink-0 rounded-[10%] shadow-sm shadow-artwork-shadow/80";

function CardImage({ card }: { card?: Card }) {
  return card ? (
    <SuitGlyph
      suit={card.suit}
      rank={card.rank}
      className={cn(cardStyle, "bg-amber-50 object-contain p-[8%] ring-1 ring-gold/45")}
      imgProps={{ loading: "eager" }}
    />
  ) : (
    <img src={cardBack} alt="" draggable={false} className={cardStyle} />
  );
}

function CardStack({
  count,
  draw = false,
  player,
}: {
  count: number;
  draw?: boolean;
  player: string;
}) {
  const label = draw ? "Deck" : "Collected";
  return (
    <div
      role="img"
      aria-label={draw ? "Draw deck" : "Collected pile"}
      data-draw-pile={draw ? player : undefined}
      data-collector={draw ? undefined : player}
      className="grid min-w-[2.1rem] shrink-0 justify-items-center gap-0.5"
    >
      <div aria-hidden="true" className="relative w-(--match-card-width)">
        {count > 0 ? (
          <>
            <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded-[10%] bg-slate-700" />
            <div className="relative">
              <CardImage />
            </div>
          </>
        ) : (
          <div className="aspect-[63/88] w-full rounded-[10%] border border-dashed border-gold/55 bg-artwork-shadow/55" />
        )}
      </div>
      <span
        aria-hidden="true"
        className="rounded-sm bg-artwork-shadow/90 px-1 py-0.5 text-[clamp(0.55rem,1.35cqmin,0.75rem)] leading-none whitespace-nowrap text-artwork-foreground"
      >
        {label}
      </span>
    </div>
  );
}

export function MatchTableCards({ cards, landing }: { cards: readonly Card[]; landing?: Card }) {
  const [previous, setPrevious] = useState<TableSlots>(() => new Map());
  const displayed = landing ? [...cards, landing] : cards;
  const slots = placeTableCards(previous, displayed.map(toCardKey));
  if (slots !== previous) setPrevious(slots);

  return (
    <ul
      aria-label="Cards on the table"
      className="pointer-events-none absolute top-[55%] left-1/2 grid -translate-1/2 grid-cols-[repeat(4,var(--match-card-width))] grid-rows-[repeat(3,calc(var(--match-card-width)*88/63))] gap-[clamp(0.25rem,1.2cqmin,0.7rem)] [--match-card-width:clamp(1.35rem,8.2cqmin,3.85rem)] portrait:top-[56%] portrait:[--match-card-width:clamp(1.55rem,10cqmin,3.85rem)]"
    >
      {displayed.map((card) => {
        const key = toCardKey(card);
        const slot = slots.get(key)!;
        const pending = card === landing;
        return (
          <li
            key={key}
            data-table-card={key}
            data-table-slot={slot}
            aria-hidden={pending || undefined}
            className={pending ? "invisible" : undefined}
            style={{ gridColumn: (slot % 4) + 1, gridRow: Math.floor(slot / 4) + 1 }}
          >
            <CardImage card={card} />
          </li>
        );
      })}
    </ul>
  );
}

export function MatchSeatCards({
  hand,
  collected,
  deck,
  player,
  local,
  align,
  canPlay,
  reducedMotion,
  play,
}: {
  hand: readonly Card[];
  collected: number;
  deck?: number;
  player: string;
  local: boolean;
  align: "left" | "center" | "right";
  canPlay: boolean;
  reducedMotion: boolean;
  play: (card: Card) => void;
}) {
  const centered = align === "center";
  return (
    <>
      <div
        className={cn(
          "absolute flex w-max items-center gap-[clamp(0.25rem,0.8cqmin,0.65rem)] [--match-card-width:clamp(0.95rem,5.1cqmin,2.7rem)]",
          centered ? "top-1/2 right-full mr-2 -translate-y-1/2" : "bottom-full mb-2",
          align === "left" && "left-1",
          align === "right" && "right-1 flex-row-reverse",
        )}
      >
        <CardStack count={collected} player={player} />
        {deck !== undefined && <CardStack count={deck} player={player} draw />}
      </div>
      <ul
        data-match-hand={player}
        aria-label={local ? "Your hand" : `Face-down hand: ${hand.length} cards`}
        className={cn(
          "absolute flex w-max items-center",
          align === "left" && "top-full left-1 mt-1",
          align === "right" && "top-full right-1 mt-1",
          centered && "top-1/2 left-full ml-2 -translate-y-1/2",
          local
            ? "gap-0.5 [--match-card-width:clamp(1.55rem,7.2cqmin,3.2rem)]"
            : "-space-x-[calc(var(--match-card-width)*0.26)] [--match-card-width:clamp(1rem,5.6cqmin,2.85rem)]",
        )}
      >
        {hand.map((card, index) => (
          <li
            key={toCardKey(card)}
            data-hand-card={toCardKey(card)}
            className={cn(
              "relative",
              local && "has-[:focus-visible]:z-10 has-[:hover]:z-10",
              local &&
                hand.length === 3 &&
                ["translate-y-[6%] -rotate-9", "-translate-y-[6%]", "translate-y-[6%] rotate-9"][
                  index
                ],
              local && hand.length === 2 && (index === 0 ? "-rotate-6" : "rotate-6"),
              !local && index === 0 && "-rotate-12",
              !local && index === 2 && "rotate-12",
            )}
          >
            {local ? (
              <MatchHandCard
                canPlay={canPlay}
                reducedMotion={reducedMotion}
                play={() => play(card)}
              >
                <CardImage card={card} />
              </MatchHandCard>
            ) : (
              <CardImage />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
