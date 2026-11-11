import { cn } from "cn";

import "./CardBorderGlint.css";

export function CardBorderGlint({ active, className }: { active: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-card-border-glint=""
      data-active={active}
      className={cn(
        "card-border-glint pointer-events-none absolute -inset-px rounded-[inherit] opacity-0",
        className,
      )}
    />
  );
}
