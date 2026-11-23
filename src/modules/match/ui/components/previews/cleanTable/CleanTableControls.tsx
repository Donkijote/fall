import { SelectField } from "@/components";
import { Checkbox } from "@/components/ui/checkbox";
import type { GameMode } from "@/domain/entities/GameState";

import type { CleanTableCase, CleanTableSettings } from "../../../../application/cleanTablePreview";

export function CleanTableControls({
  settings,
  update,
  reduced,
  setReduced,
}: {
  settings: CleanTableSettings;
  update: (patch: Partial<CleanTableSettings>) => void;
  reduced: boolean;
  setReduced: (value: boolean) => void;
}) {
  const controls = [
    {
      label: "Format",
      value: settings.mode,
      options: ["1vs1", "1vs2", "2vs2"].map((value) => ({ value, label: value })),
      change: (mode: string) => update({ mode: mode as GameMode, player: 0 }),
    },
    {
      label: "Example",
      value: settings.example,
      options: [
        { value: "capture", label: "Single capture" },
        { value: "cascade", label: "Cascade clear" },
        { value: "fall", label: "Fall + clean table" },
        { value: "last-round", label: "Last round · no bonus" },
        { value: "no-clear", label: "Cards remain · no bonus" },
        { value: "winning", label: "Match-winning clear" },
      ],
      change: (example: string) => update({ example: example as CleanTableCase }),
    },
    {
      label: "Capturing seat",
      value: String(settings.player),
      options: Array.from(
        { length: settings.mode === "1vs1" ? 2 : settings.mode === "1vs2" ? 3 : 4 },
        (_, index) => ({
          value: String(index),
          label: index === 0 ? "You" : `Player ${index + 1}`,
        }),
      ),
      change: (player: string) => update({ player: Number(player) }),
    },
  ];
  return (
    <div className="flex flex-wrap items-end gap-3">
      {controls.map(({ label, value, options, change }) => (
        <label key={label} className="grid gap-1 text-xs text-muted-foreground">
          {label}
          <SelectField
            value={value}
            options={options}
            triggerProps={{ "aria-label": label }}
            onValueChange={(value) => {
              if (value) change(value);
            }}
          />
        </label>
      ))}
      <label className="flex min-h-9 items-center gap-2 text-sm">
        <Checkbox checked={reduced} onCheckedChange={(value) => setReduced(value === true)} />
        Reduce motion
      </label>
    </div>
  );
}
