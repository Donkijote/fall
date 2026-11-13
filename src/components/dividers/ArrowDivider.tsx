import { cn } from "cn";
import type { ReactNode } from "react";

import oakSprig from "@/assets/ui/dividers/oak-sprig.webp";

import { BronzeArrow } from "./BronzeArrow";

export function ArrowDivider({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 sm:gap-3", className)}>
      <BronzeArrow className="flex-1" />
      {children ?? <img src={oakSprig} alt="" className="h-5 w-auto shrink-0" />}
      <BronzeArrow direction="left" className="flex-1" />
    </div>
  );
}
