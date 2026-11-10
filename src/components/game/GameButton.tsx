import { cn } from "cn";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export type GameButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
  tone?: "primary" | "quiet";
  iconOnly?: boolean;
};

export function GameButton({
  className,
  tone = "quiet",
  iconOnly = false,
  ...props
}: GameButtonProps) {
  return (
    <Button
      {...props}
      variant={tone === "primary" ? "default" : "ghost"}
      size={iconOnly ? "icon" : "default"}
      data-tone={tone}
      className={cn(
        "game-button h-auto min-h-11 min-w-11 gap-2.5 rounded-lg px-4 py-2.5 text-base motion-reduce:transition-none compact-landscape:text-sm",
        tone === "primary" &&
          "min-h-12 border-border text-[clamp(1rem,1.65vw,1.5rem)] font-semibold compact-landscape:min-h-11 compact-landscape:text-sm",
        iconOnly &&
          "game-button-icon p-2.5 [&_svg:not([class*='size-'])]:size-[clamp(22px,1.9vw,30px)] [&_svg]:stroke-[1.5]",
        className,
      )}
    />
  );
}
