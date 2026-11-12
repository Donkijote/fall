import { cn } from "cn";

import cardBack from "@/assets/cards/back.svg";
import { SuitGlyph } from "@/components/cards/SuitGlyph";
import type { Card } from "@/domain/entities/Card";

function CardImage({ card, faceUp }: { card: Card; faceUp: boolean }) {
  const className =
    "block aspect-[63/88] w-(--preview-card-width) shrink-0 rounded-[10%] shadow-sm shadow-artwork-shadow/80";
  return faceUp ? (
    <SuitGlyph
      suit={card.suit}
      rank={card.rank}
      className={cn(className, "bg-amber-50 object-contain p-[12%] ring-1 ring-gold/45")}
      imgProps={{ loading: "eager" }}
    />
  ) : (
    <img src={cardBack} alt="Face-down card" draggable={false} className={className} />
  );
}

function CardStack({ cards, draw = false }: { cards: readonly Card[]; draw?: boolean }) {
  const label = draw ? "Draw deck" : "Collected";
  return (
    <div
      role="img"
      aria-label={`${label}: ${cards.length} cards`}
      className="relative grid min-w-[clamp(2.65rem,7.2cqmin,3.7rem)] shrink-0 justify-items-center"
    >
      <div aria-hidden="true" className="relative w-(--preview-card-width)">
        <div
          className={cn(
            "absolute inset-0 rounded-[10%] bg-slate-700 shadow-sm shadow-artwork-shadow",
            draw ? "translate-x-0.5 translate-y-1" : "translate-y-0.5",
          )}
        />
        <div className="relative">
          <CardImage card={cards[0]} faceUp={false} />
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 rounded-sm border border-gold/55 bg-artwork-shadow/90 px-1 py-0.5 text-[clamp(0.5rem,1.35cqmin,0.7rem)] leading-none whitespace-nowrap text-artwork-foreground"
      >
        {label}
      </span>
    </div>
  );
}

export function MatchTableCards({ cards }: { cards: readonly Card[] }) {
  return (
    <ul
      data-preview-cards=""
      aria-label="Cards on the table"
      className="pointer-events-none absolute top-[55%] left-1/2 grid -translate-1/2 grid-cols-3 gap-[clamp(0.25rem,1.4cqmin,0.9rem)] [--preview-card-width:clamp(1.4rem,9.5cqmin,4.25rem)] portrait:top-[56%] portrait:[--preview-card-width:clamp(2rem,12cqmin,4.25rem)] compact-landscape:[--preview-card-width:clamp(1.3rem,8.5cqmin,3.4rem)]"
    >
      {cards.map((card) => (
        <li key={`${card.suit}-${card.rank}`}>
          <CardImage card={card} faceUp />
        </li>
      ))}
    </ul>
  );
}

export function MatchSeatCards({
  hand,
  collected,
  drawPile,
  local,
  align,
}: {
  hand: readonly Card[];
  collected: readonly Card[];
  drawPile?: readonly Card[];
  local: boolean;
  align: "left" | "center" | "right";
}) {
  const centered = align === "center";
  return (
    <>
      <div
        data-preview-cards=""
        className={cn(
          "absolute flex w-max items-center gap-[clamp(0.375rem,1cqmin,0.8rem)] [--preview-card-width:clamp(1rem,5.6cqmin,2.7rem)]",
          centered
            ? "top-1/2 right-full mr-[clamp(0.4rem,1.8cqmin,1.4rem)] -translate-y-1/2"
            : "bottom-full mb-6",
          align === "left" && "left-[clamp(0.75rem,4cqmin,1.75rem)]",
          align === "right" && "right-[clamp(0.75rem,4cqmin,1.75rem)] flex-row-reverse",
        )}
      >
        <CardStack cards={collected} />
        {drawPile && <CardStack cards={drawPile} draw />}
      </div>
      <ul
        data-preview-cards=""
        aria-label={local ? "Your hand" : "Face-down hand"}
        className={cn(
          "absolute flex w-max -space-x-[calc(var(--preview-card-width)*0.26)]",
          align === "left" && "top-full left-1 mt-2",
          align === "right" && "top-full right-1 mt-2",
          centered && "top-1/2 left-full ml-[clamp(0.75rem,3cqmin,1.25rem)] -translate-y-1/2",
          local
            ? "[--preview-card-width:clamp(1.3rem,7cqmin,3.2rem)]"
            : "[--preview-card-width:clamp(1.15rem,6.5cqmin,2.85rem)]",
        )}
      >
        {hand.map((card, index) => (
          <li
            key={`${card.suit}-${card.rank}`}
            className={cn(
              "relative",
              !centered && "origin-bottom",
              index !== 1 && !centered && "translate-y-[12%]",
              index === 0 && "-rotate-12",
              index === 2 && "rotate-12",
            )}
          >
            <CardImage card={card} faceUp={local} />
          </li>
        ))}
      </ul>
    </>
  );
}
