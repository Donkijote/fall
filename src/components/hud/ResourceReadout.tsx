import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

import { Icon } from "../icons/Icon";

const fullFormat = new Intl.NumberFormat();

export type ResourceReadoutProps = {
  label: string;
  icon: string | LucideIcon;
  iconClassName?: string;
  value?: number;
  maximum?: number;
};

export function ResourceReadout({
  label,
  icon,
  iconClassName,
  value,
  maximum,
}: ResourceReadoutProps) {
  const available =
    value !== undefined &&
    Number.isFinite(value) &&
    value >= 0 &&
    (maximum === undefined || (Number.isFinite(maximum) && maximum > 0 && value <= maximum));
  const description = available
    ? fullFormat.format(value) + (maximum === undefined ? "" : ` of ${fullFormat.format(maximum)}`)
    : "Unavailable";

  return (
    <div
      role="group"
      aria-label={label}
      title={`${label}: ${description}`}
      className="grid min-w-8 justify-items-center gap-0.5 px-0.5 py-1 sm:min-w-12 sm:px-1 compact-landscape:py-0.5"
    >
      <Icon
        icon={icon}
        className={cn("size-5 text-gold sm:size-7 compact-landscape:size-5", iconClassName)}
      />
      <span
        aria-hidden="true"
        className="text-xs leading-tight font-semibold tabular-nums sm:text-sm"
      >
        {available ? fullFormat.format(value) : "—"}
        {available && maximum !== undefined && `/${fullFormat.format(maximum)}`}
      </span>
      <span className="sr-only">{description}</span>
    </div>
  );
}
