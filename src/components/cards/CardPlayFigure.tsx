import { ArrowRight } from "lucide-react";
import { useId } from "react";

import { SuitGlyph } from "@/components/cards/SuitGlyph";
import type { Card } from "@/domain/entities/Card";

type CardPlayFigureProps = {
  title: string;
  played: Card;
  table: readonly Card[];
  captured: readonly Card[];
  caption: string;
};

function CardGroup({ label, cards }: { label: string; cards: readonly Card[] }) {
  return (
    <div className="min-w-0 space-y-3">
      <h4 className="font-heading text-xs font-bold tracking-wider uppercase sm:text-sm">
        {label}
      </h4>
      <ul aria-label={label} className="flex flex-wrap justify-center gap-2">
        {cards.map((card) => (
          <li key={`${card.suit}-${card.rank}`}>
            <div
              role="img"
              aria-label={`${card.rank} of ${card.suit}`}
              className="aspect-[63/88] w-16 rounded-md border border-artwork-shadow/30 bg-stone-50 p-1 shadow-sm sm:w-[clamp(3rem,5vw,4.5rem)] sm:p-1.5"
            >
              <span
                aria-hidden="true"
                className="block size-full [&_img]:size-full [&_img]:object-contain"
              >
                <SuitGlyph suit={card.suit} rank={card.rank} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CardPlayFigure({ title, played, table, captured, caption }: CardPlayFigureProps) {
  const id = useId();
  const grain = `${id}-paper-grain`;
  return (
    <figure
      aria-labelledby={id}
      className="relative isolate overflow-hidden rounded-md border border-amber-900/25 bg-artwork-foreground bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-amber-50)_62%,transparent),transparent_78%),linear-gradient(110deg,color-mix(in_oklch,var(--color-amber-300)_35%,transparent),transparent_44%,color-mix(in_oklch,var(--color-amber-300)_35%,transparent))] p-4 text-center text-artwork-shadow inset-shadow-sm inset-shadow-amber-900/20 sm:p-5"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-20 mix-blend-multiply"
      >
        <filter id={grain}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.48"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grain})`} />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1.5 -z-10 rounded-sm border border-amber-900/20"
      />
      <h3 className="mb-5 flex items-center justify-center gap-3 font-heading text-lg font-bold uppercase sm:gap-5 sm:text-xl">
        <span
          aria-hidden="true"
          className="h-px max-w-40 min-w-3 flex-1 bg-linear-to-r from-transparent to-amber-900/60"
        />
        {title}
        <span
          aria-hidden="true"
          className="h-px max-w-40 min-w-3 flex-1 bg-linear-to-l from-transparent to-amber-900/60"
        />
      </h3>
      <div className="grid items-center justify-items-center gap-5 sm:grid-cols-[1fr_2fr_auto_1.4fr] sm:gap-3">
        <CardGroup label="You play" cards={[played]} />
        <CardGroup label="On the table" cards={table} />
        <ArrowRight aria-hidden="true" className="size-6 rotate-90 sm:rotate-0" />
        <CardGroup label="Your capture" cards={captured} />
      </div>
      <figcaption id={id} className="mt-5 text-sm leading-relaxed italic sm:text-base">
        {caption}
      </figcaption>
    </figure>
  );
}
