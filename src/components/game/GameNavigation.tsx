import type { LucideIcon } from "lucide-react";

import { GameButton } from "./GameButton";
import { GameIcon } from "./GameIcon";

export type GameNavigationItem = {
  id: string;
  label: string;
  icon: string | LucideIcon;
  disabled?: boolean;
  unavailableLabel?: string;
  onClick?: () => void;
};

export function GameNavigation({
  label,
  groups,
}: {
  label: string;
  groups: { label: string; items: GameNavigationItem[] }[];
}) {
  return (
    <nav className="game-navigation flex gap-1 sm:gap-2.5" aria-label={label}>
      {groups.map((group) => (
        <ul
          key={group.label}
          aria-label={group.label}
          className="flex list-none -space-x-px rounded-sm bg-linear-to-b from-artwork-shadow/75 to-artwork-shadow shadow-md ring-1 shadow-artwork-shadow/60 ring-artwork-shadow"
        >
          {group.items.map(
            ({ id, label: itemLabel, icon, disabled, unavailableLabel, onClick }) => {
              const accessibleLabel = disabled
                ? `${itemLabel} (${unavailableLabel ?? "unavailable"})`
                : itemLabel;

              return (
                <li
                  key={id}
                  title={accessibleLabel}
                  className="first:[&>button]:rounded-l-sm last:[&>button]:rounded-r-sm"
                >
                  <GameButton
                    className="game-navigation-item relative rounded-none border-gold/50 p-1.5 text-artwork-foreground shadow-[inset_0_0_0_2px_var(--artwork-shadow)] hover:border-gold hover:bg-gold/20 hover:text-artwork-foreground focus-visible:z-10 disabled:opacity-70 sm:size-12 dark:hover:bg-gold/20 compact-landscape:size-11"
                    disabled={disabled}
                    onClick={onClick}
                    iconOnly
                    aria-label={accessibleLabel}
                  >
                    <GameIcon
                      icon={icon}
                      className="size-6 bg-linear-to-b from-artwork-foreground to-gold sm:size-7 compact-landscape:size-6"
                    />
                  </GameButton>
                </li>
              );
            },
          )}
        </ul>
      ))}
    </nav>
  );
}
