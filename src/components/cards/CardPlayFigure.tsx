import { ArrowRight } from "lucide-react";

import { ParchmentFigure } from "@/components/surfaces/ParchmentFigure";
import type { Card } from "@/domain/entities/Card";

import { CardFaces } from "./CardFaces";

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
      <p className="font-heading text-xs font-bold tracking-wider uppercase sm:text-sm">{label}</p>
      <CardFaces label={label} cards={cards} className="justify-center" />
    </div>
  );
}

export function CardPlayFigure({ title, played, table, captured, caption }: CardPlayFigureProps) {
  return (
    <ParchmentFigure title={title} caption={caption}>
      <div className="grid items-center justify-items-center gap-5 sm:grid-cols-[1fr_2fr_auto_1.4fr] sm:gap-3">
        <CardGroup label="You play" cards={[played]} />
        <CardGroup label="On the table" cards={table} />
        <ArrowRight aria-hidden="true" className="size-6 rotate-90 sm:rotate-0" />
        <CardGroup label="Your capture" cards={captured} />
      </div>
    </ParchmentFigure>
  );
}
