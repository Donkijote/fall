import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

import { ActionButton } from "../actions/ActionButton";
import type { ActionButtonProps } from "../actions/ActionButton";
import { Icon } from "../icons/Icon";
import "./NavigationButton.css";

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
        "game-navigation-item p-1.5 text-artwork-foreground hover:text-artwork-foreground focus-visible:z-10 rounded-none disabled:opacity-100 disabled:[&>[aria-hidden]]:opacity-75 aria-expanded:text-artwork-foreground sm:size-12 compact-landscape:size-11",
        className,
      )}
    >
      <span aria-hidden="true" className="game-navigation-icon-corners" />
      <Icon
        icon={icon}
        className={cn(
          "size-6 drop-shadow-[0_1px_1px_var(--artwork-shadow)] sm:size-7 compact-landscape:size-6",
          typeof icon === "string" ? "bg-gold" : "text-gold",
        )}
      />
    </ActionButton>
  );
}
