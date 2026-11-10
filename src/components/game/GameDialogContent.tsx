import { cn } from "cn";
import type { ComponentProps } from "react";

import { DialogContent } from "@/components/ui/dialog";

export function GameDialogContent({ className, ...props }: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      {...props}
      className={cn(
        "game-dialog border-border bg-popover text-popover-foreground [&_[data-slot=dialog-close]]:min-h-11 [&_[data-slot=dialog-close]]:min-w-11",
        className,
      )}
    />
  );
}
