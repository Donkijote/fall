import { SelectField } from "@/components";
import type { DealOrder, GameMode, TablePattern } from "@/domain/entities/GameState";

import type { TableBonusCase } from "../../../application/tableBonusPreview";

export type TableBonusSettings = {
  mode: GameMode;
  pattern: TablePattern;
  order: DealOrder;
  example: TableBonusCase;
  dealer: number;
};
export function TableBonusControls({
  settings,
  update,
  speed,
  changeSpeed,
}: {
  settings: TableBonusSettings;
  update: (patch: Partial<TableBonusSettings>) => void;
  speed: string;
  changeSpeed: (speed: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Choice
        label="Format"
        value={settings.mode}
        choices={[
          ["1vs1", "1vs1"],
          ["1vs2", "1vs2"],
          ["2vs2", "2vs2"],
        ]}
        change={(mode) => update({ mode: mode as GameMode })}
      />
      <Choice
        label="Pattern"
        value={settings.pattern}
        choices={[
          ["inc", "Ascending · 1 → 4"],
          ["dec", "Descending · 4 → 1"],
        ]}
        change={(pattern) => update({ pattern: pattern as TablePattern })}
      />
      <Choice
        label="Deal order"
        value={settings.order}
        choices={[
          ["playersThenTable", "Players then table"],
          ["tableThenPlayers", "Table then players"],
        ]}
        change={(order) => update({ order: order as DealOrder })}
      />
      <Choice
        label="Example"
        value={settings.example}
        choices={[
          ["perfect", "Perfect table"],
          ["partial", "Three consecutive matches"],
          ["broken", "Broken sequence"],
          ["none", "No bonus"],
          ["winning", "Match-winning bonus"],
        ]}
        change={(example) => update({ example: example as TableBonusCase })}
      />
      <Choice
        label="Dealer seat"
        value={String(settings.dealer)}
        choices={Array.from(
          { length: settings.mode === "1vs1" ? 2 : settings.mode === "1vs2" ? 3 : 4 },
          (_, index) => [String(index), `Seat ${index + 1}`],
        )}
        change={(dealer) => update({ dealer: Number(dealer) })}
      />
      <Choice
        label="Playback speed"
        value={speed}
        choices={[
          ["0.5", "0.5×"],
          ["1", "1×"],
          ["1.5", "1.5×"],
        ]}
        change={changeSpeed}
      />
    </div>
  );
}

function Choice({
  label,
  value,
  choices,
  change,
}: {
  label: string;
  value: string;
  choices: string[][];
  change: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs text-muted-foreground">
      {label}
      <SelectField
        value={value}
        options={choices.map(([value, label]) => ({ value, label }))}
        onValueChange={(value) => {
          if (value) change(value);
        }}
        triggerProps={{ "aria-label": label }}
      />
    </label>
  );
}
