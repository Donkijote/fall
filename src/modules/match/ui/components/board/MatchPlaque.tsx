import { cn } from "cn";
import type { ComponentProps } from "react";

import "./MatchPlaque.css";

export function MatchPlaque({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "match-plaque relative isolate inline-flex min-w-0 items-center justify-center px-2 py-1 title-type leading-none whitespace-nowrap text-artwork-foreground",
        className,
      )}
    />
  );
}
