import { cn } from "cn";
import type { ComponentProps } from "react";

import { ToggleGroupItem } from "@/components/ui/toggle-group";

export function ChoiceButton({ className, ...props }: ComponentProps<typeof ToggleGroupItem>) {
  return (
    <ToggleGroupItem
      {...props}
      className={cn(
        "min-h-11 min-w-11 cursor-pointer rounded-md transition-none aria-pressed:border-gold aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:shadow-sm aria-pressed:hover:bg-primary/90 aria-pressed:hover:text-primary-foreground",
        className,
      )}
    />
  );
}
