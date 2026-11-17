import { useId, useState } from "react";

import { ChoiceButton } from "@/components/controls/ChoiceButton";
import { ToggleGroup } from "@/components/ui/toggle-group";
import type { DealOrder, TablePattern } from "@/domain/entities/GameState";

import { OpeningDealPreview } from "./OpeningDealPreview";
import { TavernOverlayAction } from "./TavernOverlayAction";
import "./OpeningDeal.css";

export function OpeningDeal({ deal }: { deal: (order: DealOrder, pattern: TablePattern) => void }) {
  const [order, setOrder] = useState<DealOrder>("playersThenTable");
  const [pattern, setPattern] = useState<TablePattern>("inc");
  const id = useId();

  return (
    <form
      aria-labelledby={`${id}-title`}
      className="opening-deal [container-type:inline-size] pointer-events-auto absolute top-1/2 left-1/2 isolate z-10 grid w-[min(calc(100%-1rem),46rem)] -translate-1/2 justify-items-center gap-4 px-7 pt-0 pb-7 text-artwork-foreground sm:px-12 compact-landscape:w-[min(calc(100%-2rem),40rem)] compact-landscape:gap-2 compact-landscape:px-8 compact-landscape:pb-5"
      onSubmit={(event) => {
        event.preventDefault();
        deal(order, pattern);
      }}
    >
      <h2
        id={`${id}-title`}
        className="mt-[calc(13.1cqw+0.75rem)] text-center artwork-title text-[clamp(1rem,4vmin,1.5rem)] leading-tight"
      >
        Choose the opening deal
      </h2>
      <div className="opening-deal-content grid w-full min-w-0 items-center gap-4">
        <div className="grid min-w-0 gap-4 compact-landscape:gap-3">
          <div className="min-w-0">
            <h3 id={`${id}-order-label`} className="sr-only">
              Deal order
            </h3>
            <p id={`${id}-order-help`} className="text-xs leading-relaxed">
              Choose what gets dealt first.
            </p>
            <ToggleGroup
              aria-labelledby={`${id}-order-label`}
              aria-describedby={`${id}-order-help`}
              value={[order]}
              onValueChange={([next]) => {
                if (next === "playersThenTable" || next === "tableThenPlayers") setOrder(next);
              }}
              className="opening-deal-options mt-2 grid w-full grid-cols-2 gap-1"
            >
              <ChoiceButton
                value="playersThenTable"
                className="min-w-0 px-2 text-xs text-artwork-foreground"
              >
                Hands first
              </ChoiceButton>
              <ChoiceButton
                value="tableThenPlayers"
                className="min-w-0 px-2 text-xs text-artwork-foreground"
              >
                Table first
              </ChoiceButton>
            </ToggleGroup>
          </div>
          <div className="min-w-0">
            <h3 id={`${id}-pattern-label`} className="sr-only">
              Bonus pattern
            </h3>
            <p id={`${id}-pattern-help`} className="text-xs leading-relaxed">
              Matching ranks in the right slots earn bonus points.
            </p>
            <ToggleGroup
              aria-labelledby={`${id}-pattern-label`}
              aria-describedby={`${id}-pattern-help`}
              value={[pattern]}
              onValueChange={([next]) => {
                if (next === "inc" || next === "dec") setPattern(next);
              }}
              className="opening-deal-options mt-2 grid w-full grid-cols-2 gap-1"
            >
              <ChoiceButton
                value="inc"
                aria-label="Ascending, 1–2–3–4"
                className="min-w-0 px-2 text-sm text-artwork-foreground tabular-nums"
              >
                1 2 3 4
              </ChoiceButton>
              <ChoiceButton
                value="dec"
                aria-label="Descending, 4–3–2–1"
                className="min-w-0 px-2 text-sm text-artwork-foreground tabular-nums"
              >
                4 3 2 1
              </ChoiceButton>
            </ToggleGroup>
          </div>
        </div>
        <OpeningDealPreview order={order} pattern={pattern} />
      </div>
      <p role="status" aria-atomic="true" className="sr-only">
        {order === "playersThenTable" ? "Hands first, then table." : "Table first, then hands."}{" "}
        Bonus target: {pattern === "inc" ? "1, 2, 3, 4." : "4, 3, 2, 1."}
      </p>
      <TavernOverlayAction type="submit" className="min-w-44 text-sm">
        Deal cards
      </TavernOverlayAction>
    </form>
  );
}
