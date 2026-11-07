import type { LucideIcon } from "lucide-react";

export type HudResourceProps = {
  label: string;
  icon: LucideIcon;
  value?: number;
  maximum?: number;
  bounded?: boolean;
  appearance?: "energy" | "coins" | "diamonds";
};

const numberFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });

export function HudResource({
  label,
  icon: Icon,
  value,
  maximum,
  bounded = false,
  appearance = bounded ? "energy" : "coins",
}: HudResourceProps) {
  const hasValue = value !== undefined && Number.isFinite(value) && value >= 0;
  const hasMaximum = maximum !== undefined && Number.isFinite(maximum) && maximum > 0;
  const available = hasValue && (!bounded || (hasMaximum && value <= maximum));
  const amount = available ? numberFormat.format(value) : "—";
  const capacity = bounded ? ` / ${available ? numberFormat.format(maximum!) : "—"}` : "";

  return (
    <div role="group" aria-label={label} className="hud-resource" data-resource={appearance}>
      <span className="hud-resource-emblem" aria-hidden="true">
        <Icon />
      </span>
      <div className="hud-resource-details min-w-0">
        <span
          className="hud-resource-amount block truncate text-sm leading-snug font-semibold tabular-nums"
          aria-hidden="true"
        >
          {amount}
          {capacity}
        </span>
        <span className="sr-only">
          {available
            ? `${amount}${bounded ? ` of ${numberFormat.format(maximum!)}` : ""}`
            : "Not available yet"}
        </span>
        {bounded && (
          <div
            className="hud-resource-track h-1 overflow-hidden rounded-full"
            role={available ? "meter" : undefined}
            aria-label={available ? `${label} reserve` : undefined}
            aria-valuemin={available ? 0 : undefined}
            aria-valuemax={available ? maximum : undefined}
            aria-valuenow={available ? value : undefined}
            aria-hidden={available ? undefined : true}
          >
            {available && (
              <span
                className="block h-full rounded-full"
                style={{ width: `${(value / maximum!) * 100}%` }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
