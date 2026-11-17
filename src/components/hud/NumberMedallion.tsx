import { cn } from "cn";
import type { ReactNode } from "react";

import artwork from "@/assets/lobby/tavern-match/capture-bonus-coin.webp";

/** A number stamped into brass, without the points unit used by PointsBadge. */
export function NumberMedallion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative isolate inline-grid size-10 shrink-0 place-items-center font-serif text-xl leading-none text-artwork-shadow lining-nums tabular-nums",
        className,
      )}
    >
      <img src={artwork} alt="" className="pointer-events-none absolute inset-0 -z-10 size-full" />
      <span className="-translate-y-[0.08em]">{children}</span>
    </span>
  );
}
