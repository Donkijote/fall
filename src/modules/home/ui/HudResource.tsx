import type { LucideIcon } from "lucide-react";

export type HudResourceProps = {
  label: string;
  icon: LucideIcon;
  value?: number;
  maximum?: number;
  bounded?: boolean;
};

const numberFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });

export function HudResource({
  label,
  icon: Icon,
  value,
  maximum,
  bounded = false,
}: HudResourceProps) {
  const hasValue = value !== undefined && Number.isFinite(value) && value >= 0;
  const hasMaximum = maximum !== undefined && Number.isFinite(maximum) && maximum > 0;
  const available = hasValue && (!bounded || (hasMaximum && value <= maximum));
  const amount = available ? numberFormat.format(value) : "—";
  const capacity = bounded ? ` / ${available ? numberFormat.format(maximum!) : "—"}` : "";

  return (
    <div
      role="group"
      aria-label={label}
      className="hud-resource grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 px-2 py-1.5"
      data-resource={bounded ? "energy" : "coins"}
    >
      <span
        className="hud-resource-emblem flex size-9 items-center justify-center"
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <span className="hud-resource-label block text-[0.625rem] leading-tight tracking-widest uppercase">
          {label}
        </span>
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
            className="hud-resource-track mt-0.5 h-1 overflow-hidden rounded-full"
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
