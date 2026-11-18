import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

import { Icon } from "../icons/Icon";
import { useBorderGlint } from "../surfaces/useBorderGlint";
import "./ResourceReadout.css";

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
  const surface = useRef<HTMLDivElement>(null);
  useBorderGlint(surface);

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
      ref={surface}
      role="group"
      aria-label={label}
      title={`${label}: ${description}`}
      className="resource-readout relative isolate flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 px-3 py-2 text-artwork-foreground sm:px-4 lg:min-h-12 lg:min-w-22 lg:flex-row lg:gap-2 lg:px-4 compact-landscape:min-h-9 compact-landscape:min-w-16 compact-landscape:flex-row compact-landscape:gap-1 compact-landscape:px-3 compact-landscape:py-1"
    >
      <span
        aria-hidden="true"
        className="resource-readout-frame [container-type:size] pointer-events-none absolute inset-0 -z-10"
      />
      <Icon
        icon={icon}
        className={cn(
          "size-5 shrink-0 text-gold sm:size-6 compact-landscape:size-4",
          iconClassName,
        )}
      />
      <span
        aria-hidden="true"
        className="text-xs leading-tight font-semibold lining-nums tabular-nums sm:text-sm"
      >
        {available ? fullFormat.format(value) : "—"}
        {available && maximum !== undefined && `/${fullFormat.format(maximum)}`}
      </span>
      <span className="sr-only">{description}</span>
    </div>
  );
}
