import { cn } from "cn";
import type { ReactNode } from "react";

import mandatoryArtwork from "@/assets/sings-reference/combination-mandatory.webp";
import optionalArtwork from "@/assets/sings-reference/combination-optional.webp";

export function DeclarationBadge({
  mandatory,
  className,
  children,
}: {
  mandatory: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "relative isolate inline-grid min-h-6 w-[clamp(4.5rem,17cqw,6rem)] place-items-center px-2 font-serif text-xs leading-none font-semibold",
        mandatory ? "text-artwork-shadow portrait:min-w-24" : "text-artwork-foreground italic",
        className,
      )}
    >
      <img
        src={mandatory ? mandatoryArtwork : optionalArtwork}
        alt=""
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2",
          mandatory ? "h-5" : "h-6",
        )}
      />
      <span className="-translate-y-px">{mandatory ? "Mandatory" : "Optional"}</span>
      {children}
    </span>
  );
}
