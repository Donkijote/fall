import { ArrowDown, ArrowRight, ArrowUp, Hand, LayoutGrid } from "lucide-react";
import { useState, type ReactNode } from "react";

import board from "@/assets/lobby/tavern-match/dealer-board.webp";
import type { DealOrder, TablePattern } from "@/domain/entities/GameState";

import { TavernOverlayAction } from "./TavernOverlayAction";

const choiceStyle =
  "grid min-h-12 cursor-pointer place-items-center rounded-md border border-gold/30 bg-artwork-shadow/60 px-3 text-artwork-foreground peer-checked:border-gold peer-checked:bg-artwork-shadow peer-checked:text-gold peer-checked:inset-ring-1 peer-checked:inset-ring-gold/35 peer-focus-visible:ring-2 peer-focus-visible:ring-ring compact-landscape:min-h-11";

function DealChoices<Value extends string>({
  title,
  name,
  value,
  choices,
  select,
}: {
  title: string;
  name: string;
  value: Value;
  choices: readonly (readonly [Value, string, ReactNode])[];
  select: (choice: Value) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mx-auto pb-2 title-type text-xs text-gold sm:text-sm">{title}</legend>
      <div className="grid grid-cols-2 gap-3">
        {choices.map(([choice, label, icon]) => (
          <label key={choice} title={label}>
            <input
              type="radio"
              name={name}
              value={choice}
              checked={value === choice}
              onChange={() => select(choice)}
              className="peer sr-only"
            />
            <span className="sr-only">{label}</span>
            <span className={choiceStyle} aria-hidden="true">
              {icon}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DealOrderIcon({ tableFirst = false }: { tableFirst?: boolean }) {
  const First = tableFirst ? LayoutGrid : Hand;
  const Second = tableFirst ? Hand : LayoutGrid;
  return (
    <span className="flex items-center gap-1.5">
      <First className="size-4" />
      <ArrowRight className="size-3 opacity-70" />
      <Second className="size-4" />
    </span>
  );
}

function PatternIcon({ descending = false }: { descending?: boolean }) {
  const Arrow = descending ? ArrowDown : ArrowUp;
  return (
    <span className="flex items-center gap-1">
      <Arrow className="size-4" />
      <span
        className="flex h-4 items-end gap-0.5"
        style={{ flexDirection: descending ? "row-reverse" : "row" }}
      >
        {[5, 8, 11, 14].map((height) => (
          <span key={height} className="w-1 rounded-[1px] bg-current" style={{ height }} />
        ))}
      </span>
    </span>
  );
}

export function OpeningDeal({ deal }: { deal: (order: DealOrder, pattern: TablePattern) => void }) {
  const [order, setOrder] = useState<DealOrder>("playersThenTable");
  const [pattern, setPattern] = useState<TablePattern>("inc");

  return (
    <form
      aria-labelledby="opening-deal-title"
      className="pointer-events-auto absolute top-1/2 left-1/2 z-10 grid w-[min(calc(100%-1rem),36rem)] -translate-1/2 justify-items-center gap-5 px-7 pt-20 pb-9 text-artwork-foreground sm:px-12 compact-landscape:w-[min(calc(100%-2rem),29rem)] compact-landscape:gap-3 compact-landscape:px-8 compact-landscape:pt-[3.75rem] compact-landscape:pb-6"
      onSubmit={(event) => {
        event.preventDefault();
        deal(order, pattern);
      }}
    >
      <img src={board} alt="" className="pointer-events-none absolute inset-0 -z-10 size-full" />
      <h2
        id="opening-deal-title"
        className="text-center artwork-title text-[clamp(1rem,4vmin,1.5rem)] leading-tight"
      >
        Choose the opening deal
      </h2>
      <div className="grid w-full max-w-md grid-cols-2 gap-6 max-sm:portrait:max-w-64 max-sm:portrait:grid-cols-1 max-sm:portrait:gap-4 compact-landscape:gap-5">
        <DealChoices<DealOrder>
          title="Deal order"
          name="opening-deal-order"
          value={order}
          choices={[
            ["playersThenTable", "Hands first", <DealOrderIcon />],
            ["tableThenPlayers", "Table first", <DealOrderIcon tableFirst />],
          ]}
          select={setOrder}
        />
        <DealChoices<TablePattern>
          title="Table pattern"
          name="opening-table-pattern"
          value={pattern}
          choices={[
            ["inc", "1–2–3–4", <PatternIcon />],
            ["dec", "4–3–2–1", <PatternIcon descending />],
          ]}
          select={setPattern}
        />
      </div>
      <TavernOverlayAction type="submit" className="text-sm">
        Deal cards
      </TavernOverlayAction>
    </form>
  );
}
