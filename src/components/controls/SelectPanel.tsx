import { cn } from "cn";
import type { ComponentProps } from "react";

import { SelectContent } from "@/components/ui/select";

export function SelectPanel({ className, ...props }: ComponentProps<typeof SelectContent>) {
  return (
    <SelectContent
      {...props}
      className={cn(
        "rounded-md p-1 data-open:animate-none data-closed:animate-none [&_[data-slot=select-item]]:rounded-sm",
        className,
      )}
    />
  );
}
