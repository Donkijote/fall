import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

import { ActionButton } from "../actions/ActionButton";
import type { ActionButtonProps } from "../actions/ActionButton";
import { Icon } from "../icons/Icon";

export function NavigationButton({
  icon,
  className,
  ...props
}: Omit<ActionButtonProps, "iconOnly" | "tone" | "children"> & {
  icon: string | LucideIcon;
}) {
  return (
    <ActionButton
      {...props}
      iconOnly
      className={cn(
        "game-navigation-item relative rounded-none border-gold/50 bg-transparent p-1.5 text-artwork-foreground shadow-[inset_0_0_0_2px_var(--artwork-shadow)] hover:text-artwork-foreground focus-visible:z-10 disabled:opacity-70 aria-expanded:text-artwork-foreground sm:size-12 compact-landscape:size-11",
        className,
      )}
    >
      {typeof icon === "string" ? (
        <Icon
          icon={icon}
          className="size-6 bg-linear-to-b from-artwork-foreground to-gold sm:size-7 compact-landscape:size-6"
        />
      ) : (
        <Icon
          icon={icon}
          className="size-6 text-artwork-foreground sm:size-7 compact-landscape:size-6"
        />
      )}
    </ActionButton>
  );
}
