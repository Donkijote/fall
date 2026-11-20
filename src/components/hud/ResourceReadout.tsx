import { cn } from "cn";
import gsap from "gsap";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

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

  const amount = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const changed = previous.current !== value;
      previous.current = value;
      if (!amount.current || !available || !changed || reduced) return;
      const pulse = gsap.fromTo(
        amount.current,
        { filter: "brightness(1.8)" },
        {
          filter: "brightness(1)",
          duration: 0.3,
          ease: "power2.out",
          clearProps: "filter",
        },
      );
      return () => {
        pulse.kill();
      };
    },
    { dependencies: [value, available, reduced], revertOnUpdate: true },
  );

  return (
    <button
      type="button"
      ref={surface}
      onClick={onClick}
      aria-label={`${label}: ${description}`}
      title={`${label}: ${description}`}
      className="resource-readout relative isolate flex min-h-9 min-w-16 cursor-pointer flex-row items-center justify-center gap-1 rounded-md px-3 py-1 text-artwork-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:min-h-12 lg:min-w-22 lg:flex-row lg:gap-2 lg:px-4 lg:py-2"
    >
      <span
        aria-hidden="true"
        className="resource-readout-frame [container-type:size] pointer-events-none absolute inset-0 -z-10"
      />
      <Icon icon={icon} className={cn("shrink-0 text-gold size-4 lg:size-6", iconClassName)} />
      <span
        aria-hidden="true"
        ref={amount}
        className="text-xs leading-tight font-semibold lining-nums tabular-nums sm:text-sm"
      >
        {available ? fullFormat.format(value) : "—"}
        {available && maximum !== undefined && `/${fullFormat.format(maximum)}`}
      </span>
    </button>
  );
}
