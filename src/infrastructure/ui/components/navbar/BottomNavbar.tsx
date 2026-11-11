import { CirclePlay, Gift, Scale, ScrollText, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { Button } from "@/components/ui/button";
import type { User } from "@/domain/entities/User";
import { ThemeToggle } from "@/infrastructure/ui/components/theme/ThemeToggle";
import { TavernPicker } from "@/modules/tavern";
import { RULES_PATH, SINGS_SHEETS } from "@/routes/Routes";

export const BottomNavbar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(Boolean(searchParams.get("bottomSidebar")));

  return (
    <>
      <TavernPicker
        open={isOpen}
        canPlay={Boolean(StorageService.get<User>(StorageKeys.FALL_USER)?.id)}
        onClose={() => {
          setIsOpen(false);
          setActive("");
        }}
      />
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-sidebar-border bg-sidebar px-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sidebar-foreground"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center justify-around gap-1">
            <NavItem
              icon={<UserRound />}
              label="Profile"
              active={active === "Profile"}
              onClick={() => setActive("Profile")}
            />
            <NavItem
              icon={<Gift />}
              label="Daily"
              active={active === "Daily"}
              onClick={() => setActive("Daily")}
            />
            <ThemeToggle />
          </div>
          <Button
            size="icon"
            className="-mt-8 size-20 rounded-full shadow-lg"
            aria-label="Play"
            onClick={() => {
              setActive("Play");
              setIsOpen(true);
            }}
          >
            <CirclePlay className="size-10" />
          </Button>
          <div className="flex items-center justify-around gap-1">
            <NavItem icon={<Scale />} label="Rules" onClick={() => navigate(RULES_PATH)} />
            <NavItem icon={<ScrollText />} label="Sings" onClick={() => navigate(SINGS_SHEETS)} />
            <NavItem
              icon={<Settings />}
              label="Settings"
              active={active === "Settings"}
              onClick={() => setActive("Settings")}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={active ? "secondary" : "ghost"}
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className="h-auto flex-col gap-1 px-2 py-2 sm:px-4"
  >
    {icon}
    <span className="hidden text-xs sm:block">{label}</span>
  </Button>
);
