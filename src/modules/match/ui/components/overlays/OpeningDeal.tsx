import { useId, useState } from "react";

import sprig from "@/assets/ui/dividers/oak-sprig.webp";
import { ChoiceButton } from "@/components/controls/ChoiceButton";
import { BronzeArrow } from "@/components/dividers/BronzeArrow";
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
      className="opening-deal [container-type:inline-size] pointer-events-auto absolute top-1/2 left-1/2 isolate z-10 grid w-[min(calc(100%-2rem),40rem)] -translate-1/2 justify-items-center gap-1.5 px-8 pt-0 pb-5 text-artwork-foreground lg:w-[min(calc(100%-1rem),46rem)] lg:gap-4 lg:px-12 lg:pb-7 [@media(max-height:350px)]:gap-1 [@media(max-height:350px)]:pb-2"
      onSubmit={(event) => {
        event.preventDefault();
        deal(order, pattern);
      }}
    >
      <header className="opening-deal-heading mt-[calc(13.1cqw+0.25rem)] grid w-full justify-items-center gap-1 lg:mt-[calc(13.1cqw+0.75rem)] lg:gap-2 [@media(max-height:350px)]:mt-[13.1cqw]">
        <h2
          id={`${id}-title`}
          className="text-center artwork-title text-[clamp(1rem,3.2cqw,1.375rem)] leading-tight lg:text-[clamp(1.125rem,3.8cqw,2rem)]"
        >
          Choose the opening deal
        </h2>
        <div aria-hidden="true" className="flex w-[78%] items-center gap-2">
          <BronzeArrow tone="faded" className="h-0.5 min-w-0 flex-1" />
          <img src={sprig} alt="" className="h-2.5 w-auto lg:h-3.5" />
          <BronzeArrow tone="faded" direction="left" className="h-0.5 min-w-0 flex-1" />
        </div>
      </header>
      <div className="opening-deal-content grid w-full min-w-0 grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-4 [@media(max-height:350px)]:[&_p]:text-[0.6875rem] [@media(max-height:350px)]:[&_p]:leading-tight [@media(max-height:350px)]:[&>div:first-child]:gap-2">
        <div className="grid min-w-0 gap-3 lg:gap-4">
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
              className="opening-deal-options relative isolate mt-2 grid w-full grid-cols-2 gap-1 p-1 lg:p-1.5 [@media(max-height:350px)]:mt-1"
            >
              <ChoiceButton
                value="playersThenTable"
                className="min-w-0 px-2 title-type text-xs text-artwork-foreground"
              >
                Hands first
              </ChoiceButton>
              <ChoiceButton
                value="tableThenPlayers"
                className="min-w-0 px-2 title-type text-xs text-artwork-foreground"
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
              className="opening-deal-options relative isolate mt-2 grid w-full grid-cols-2 gap-1 p-1 lg:p-1.5 [@media(max-height:350px)]:mt-1"
            >
              <ChoiceButton
                value="inc"
                aria-label="Ascending, 1–2–3–4"
                className="min-w-0 px-2 font-[family-name:Times_New_Roman,Times,serif] text-lg text-artwork-foreground lining-nums tabular-nums"
              >
                1 2 3 4
              </ChoiceButton>
              <ChoiceButton
                value="dec"
                aria-label="Descending, 4–3–2–1"
                className="min-w-0 px-2 font-[family-name:Times_New_Roman,Times,serif] text-lg text-artwork-foreground lining-nums tabular-nums"
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
