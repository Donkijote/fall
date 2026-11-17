import { cn } from "cn";

import "./EmptyCardSlot.css";

/** Decorative empty recess; the containing pile provides its accessible label. */
export function EmptyCardSlot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "empty-card-slot relative isolate block aspect-[63/88] w-full rounded-md",
        className,
      )}
    />
  );
}
