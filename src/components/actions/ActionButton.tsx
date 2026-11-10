import { cn } from "cn";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export type ActionButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
  tone?: "primary" | "quiet" | "outline";
  iconOnly?: boolean;
};

const buttonVariants = { primary: "default", quiet: "ghost", outline: "outline" } as const;

export function ActionButton({
  className,
  tone = "quiet",
  iconOnly = false,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      {...props}
      variant={buttonVariants[tone]}
      size={iconOnly ? "icon" : "default"}
      data-tone={tone}
      className={cn(
        "game-button h-auto min-h-11 min-w-11 gap-2.5 rounded-md px-4 py-2.5 text-sm transition-none active:not-aria-[haspopup]:translate-y-0 compact-landscape:text-sm",
        tone === "primary" &&
          "min-h-12 border-gold/55 bg-primary text-primary-foreground shadow-sm shadow-artwork-shadow/25 hover:bg-primary/90 text-base font-semibold compact-landscape:min-h-11",
        tone === "outline" && "border-gold/55",
        iconOnly &&
          "game-button-icon p-2.5 [&_svg:not([class*='size-'])]:size-[clamp(22px,1.9vw,30px)] [&_svg]:stroke-[1.5]",
        className,
      )}
    />
  );
}
