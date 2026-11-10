import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router";

import help from "@/assets/lobby/card-hall/icons/help.svg";
import { GameIcon } from "@/components/game/GameIcon";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RULES_PATH, SINGS_SHEETS } from "@/routes/Routes";

import { useGSAP } from "@gsap/react";

import { cardHallIcons } from "./cardHallIcons";

const guides = [
  { to: RULES_PATH, label: "How to play", description: "Learn the rules and scoring." },
  { to: SINGS_SHEETS, label: "Sings reference", description: "Look up combinations and points." },
];

function HelpLinks() {
  const id = useId();
  const popup = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(popup.current, { opacity: 0, y: 4, duration: 0.16, ease: "power2.out" });
    });
    return () => motion.revert();
  });

  return (
    <PopoverContent
      side="top"
      align="start"
      sideOffset={8}
      ref={popup}
      aria-label="Help"
      className="max-h-[var(--available-height)] w-[min(21rem,var(--available-width),calc(100vw_-_var(--safe-area-left)_-_var(--safe-area-right)_-_2rem))] [scrollbar-width:none] gap-0 overflow-auto overscroll-contain data-open:animate-none data-closed:animate-none [&::-webkit-scrollbar]:hidden"
    >
      {guides.map(({ to, label, description }, index) => (
        <Link
          key={to}
          to={to}
          aria-labelledby={`${id}-label-${index}`}
          aria-describedby={`${id}-description-${index}`}
          className="flex min-h-16 items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <span className="grid gap-0.5">
            <span id={`${id}-label-${index}`} className="font-semibold">
              {label}
            </span>
            <span id={`${id}-description-${index}`} className="text-xs text-muted-foreground">
              {description}
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </PopoverContent>
  );
}

const buttonClassName =
  "min-h-11 min-w-11 bg-artwork-shadow/75 text-artwork-foreground transition-none hover:bg-artwork-shadow hover:text-artwork-foreground aria-expanded:bg-artwork-shadow aria-expanded:text-artwork-foreground sm:size-12";
const iconClassName = "size-6 bg-linear-to-b from-artwork-foreground to-gold sm:size-7";
const groupClassName = "flex gap-1";

export function HomeUtilities({ onSettings }: { onSettings: () => void }) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <nav aria-label="Utilities" className="ml-auto flex gap-1 sm:gap-2.5">
      <div role="group" aria-label="Communication" className={groupClassName}>
        <Button
          variant="ghost"
          size="icon"
          disabled
          aria-label="Messages (coming soon)"
          title="Messages (coming soon)"
          className={buttonClassName}
        >
          <GameIcon icon={cardHallIcons.messages} className={iconClassName} />
        </Button>
      </div>
      <div role="group" aria-label="Help and settings" className={groupClassName}>
        <Popover open={helpOpen} onOpenChange={setHelpOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Help"
                title="Help"
                className={buttonClassName}
              />
            }
          >
            <GameIcon icon={help} className={iconClassName} />
          </PopoverTrigger>
          {helpOpen && <HelpLinks />}
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          title="Settings"
          onClick={onSettings}
          className={buttonClassName}
        >
          <GameIcon icon={cardHallIcons.settings} className={iconClassName} />
        </Button>
      </div>
    </nav>
  );
}
