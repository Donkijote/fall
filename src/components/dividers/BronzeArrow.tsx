import { cn } from "cn";

import "./BronzeArrow.css";

export function BronzeArrow({
  className,
  direction = "right",
  tone = "standard",
}: {
  className?: string;
  direction?: "left" | "right" | "down";
  tone?: "standard" | "faded";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bronze-arrow block",
        direction === "down" ? "bronze-arrow-vertical min-h-4 w-2" : "h-2 min-w-4",
        direction === "left" && "-scale-x-100",
        tone === "faded" && "bronze-arrow-faded",
        className,
      )}
    />
  );
}
