import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode, Ref } from "react";

import { NavigationButton } from "./NavigationButton";
import { NavigationGroup } from "./NavigationGroup";

export type NavigationItem = {
  id: string;
  label: string;
  icon: string | LucideIcon;
  disabled?: boolean;
  unavailableLabel?: string;
  onClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
  wrapButton?: (button: ReactElement<ComponentProps<typeof NavigationButton>>) => ReactNode;
};

export function Navigation({
  label,
  groups,
  className,
}: {
  label: string;
  className?: string;
  groups: { label: string; items: NavigationItem[] }[];
}) {
  return (
    <nav className={cn("game-navigation flex gap-1 sm:gap-2.5", className)} aria-label={label}>
      {groups.map((group) => (
        <NavigationGroup key={group.label} label={group.label}>
          {group.items.map(
            ({
              id,
              label: itemLabel,
              icon,
              disabled,
              unavailableLabel,
              onClick,
              ref,
              wrapButton,
            }) => {
              const accessibleLabel = disabled
                ? `${itemLabel} (${unavailableLabel ?? "unavailable"})`
                : itemLabel;

              const button = (
                <NavigationButton
                  ref={ref}
                  icon={icon}
                  disabled={disabled}
                  onClick={onClick}
                  aria-label={accessibleLabel}
                />
              );

              return (
                <li key={id} title={accessibleLabel}>
                  {wrapButton ? wrapButton(button) : button}
                </li>
              );
            },
          )}
        </NavigationGroup>
      ))}
    </nav>
  );
}
