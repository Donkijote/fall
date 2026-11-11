import { cn } from "cn";

import type { Card } from "@/domain/entities/Card";

import { SuitGlyph } from "./SuitGlyph";

export function CardFaces({
  label,
  cards,
  className,
}: {
  label: string;
  cards: readonly Card[];
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
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
  );
}
