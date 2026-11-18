import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
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
  onClick?: ComponentProps<"button">["onClick"];
};

export function ResourceReadout({
  label,
  icon,
  iconClassName,
  value,
  maximum,
  onClick,
}: ResourceReadoutProps) {
  const surface = useRef<HTMLButtonElement>(null);
  useBorderGlint(surface, true, { orbitOnAttention: true });

  const available =
    value !== undefined &&
    Number.isFinite(value) &&
    value >= 0 &&
    (maximum === undefined || (Number.isFinite(maximum) && maximum > 0 && value <= maximum));
  const description = available
    ? fullFormat.format(value) + (maximum === undefined ? "" : ` of ${fullFormat.format(maximum)}`)
    : "Unavailable";

  return (
    <button
      type="button"
      ref={surface}
      onClick={onClick}
      aria-label={`${label}: ${description}`}
      title={`${label}: ${description}`}
      className="resource-readout relative isolate flex min-h-12 min-w-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md px-3 py-2 text-artwork-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4 lg:min-h-12 lg:min-w-22 lg:flex-row lg:gap-2 lg:px-4 compact-landscape:min-h-9 compact-landscape:min-w-16 compact-landscape:flex-row compact-landscape:gap-1 compact-landscape:px-3 compact-landscape:py-1"
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
    </button>
  );
}
