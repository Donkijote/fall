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
      <h4 className="font-sans text-xs font-bold tracking-wider uppercase">{label}</h4>
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
  return (
    <figure
      aria-labelledby={id}
      className="rounded-md bg-artwork-foreground p-4 text-center text-artwork-shadow sm:p-5"
    >
      <h3 className="mb-5 font-heading text-lg font-bold uppercase sm:text-xl">{title}</h3>
      <div className="grid items-center justify-items-center gap-5 sm:grid-cols-[1fr_2fr_auto_1.4fr] sm:gap-3">
        <CardGroup label="You play" cards={[played]} />
        <CardGroup label="On the table" cards={table} />
        <ArrowRight aria-hidden="true" className="size-6 rotate-90 sm:rotate-0" />
        <CardGroup label="Your capture" cards={captured} />
      </div>
      <figcaption id={id} className="mt-5 text-sm leading-relaxed sm:text-base">
        {caption}
      </figcaption>
    </figure>
  );
}
