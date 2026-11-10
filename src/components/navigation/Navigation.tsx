import type { LucideIcon } from "lucide-react";

import { NavigationButton } from "./NavigationButton";
import { NavigationGroup } from "./NavigationGroup";

export type NavigationItem = {
  id: string;
  label: string;
  icon: string | LucideIcon;
  disabled?: boolean;
  unavailableLabel?: string;
  onClick?: () => void;
};

export function Navigation({
  label,
  groups,
}: {
  label: string;
  groups: { label: string; items: NavigationItem[] }[];
}) {
  return (
    <nav className="game-navigation flex gap-1 sm:gap-2.5" aria-label={label}>
      {groups.map((group) => (
        <NavigationGroup key={group.label} label={group.label}>
          {group.items.map(
            ({ id, label: itemLabel, icon, disabled, unavailableLabel, onClick }) => {
              const accessibleLabel = disabled
                ? `${itemLabel} (${unavailableLabel ?? "unavailable"})`
                : itemLabel;

              return (
                <li key={id} title={accessibleLabel}>
                  <NavigationButton
                    icon={icon}
                    disabled={disabled}
                    onClick={onClick}
                    aria-label={accessibleLabel}
                  />
                </li>
              );
            },
          )}
        </NavigationGroup>
      ))}
    </nav>
  );
}
