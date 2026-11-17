import { useEffect, useId, useRef } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";

import help from "@/assets/lobby/card-hall/icons/help.svg";
import logout from "@/assets/lobby/card-hall/icons/logout.svg";
import { Navigation, PopoverPanel } from "@/components";
import { BronzeArrow } from "@/components/dividers/BronzeArrow";
import { GuideLink } from "@/components/navigation/GuideLink";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { LOGIN_PATH, RULES_PATH, SINGS_SHEETS } from "@/routes/Routes";

import { cardHallIcons } from "./cardHallIcons";

const guides = [
  { to: RULES_PATH, label: "How to play", description: "Learn the rules and scoring." },
  { to: SINGS_SHEETS, label: "Sings reference", description: "Look up combinations and points." },
];

function HelpLinks() {
  const id = useId();

  return (
    <PopoverPanel
      side="top"
      align="start"
      sideOffset={8}
      aria-label="Help"
      initialFocus={(openType) => openType === "keyboard"}
      className="max-h-[var(--available-height)] w-[min(21rem,var(--available-width),calc(100vw_-_var(--safe-area-left)_-_var(--safe-area-right)_-_2rem))] [scrollbar-width:none] gap-0 overflow-auto overscroll-contain [&::-webkit-scrollbar]:hidden"
    >
      {guides.map(({ to, label, description }, index) => (
        <GuideLink
          key={to}
          to={to}
          aria-labelledby={`${id}-label-${index}`}
          aria-describedby={`${id}-description-${index}`}
          className="flex min-h-18 items-center justify-between gap-3 text-sm"
        >
          <span className="grid gap-0.5">
            <span id={`${id}-label-${index}`} className="font-semibold">
              {label}
            </span>
            <span id={`${id}-description-${index}`} className="text-xs opacity-75">
              {description}
            </span>
          </span>
          <BronzeArrow className="w-7 shrink-0" />
        </GuideLink>
      ))}
    </PopoverPanel>
  );
}

export function HomeUtilities({ onSettings }: { onSettings: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const helpRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // Reloads and history traversal can replay the guide's saved return state.
    if (navigationType !== "POP" && location.state?.focusHelp === true) {
      helpRef.current?.focus();
    }
  }, [location.key, location.state, navigationType]);
  return (
    <Navigation
      label="Utilities"
      className="ml-auto"
      groups={[
        {
          label: "Communication",
          items: [
            {
              id: "messages",
              label: "Messages",
              icon: cardHallIcons.messages,
              disabled: true,
              unavailableLabel: "coming soon",
            },
          ],
        },
        {
          label: "Help and settings",
          items: [
            {
              id: "help",
              label: "Help",
              icon: help,
              ref: helpRef,
              wrapButton: (button) => (
                <Popover>
                  <PopoverTrigger render={button} />
                  <HelpLinks />
                </Popover>
              ),
            },
            {
              id: "settings",
              label: "Settings",
              icon: cardHallIcons.settings,
              onClick: onSettings,
            },
          ],
        },
        {
          label: "Session",
          items: [
            {
              id: "logout",
              label: "Log out",
              icon: logout,
              onClick: () => navigate(LOGIN_PATH),
            },
          ],
        },
      ]}
    />
  );
}
