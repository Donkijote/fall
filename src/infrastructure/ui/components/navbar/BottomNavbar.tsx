import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { BottomSidebar } from "@/infrastructure/ui/components/navbar/BottomSidebar";
import { RULES_PATH, SINGS_SHEETS } from "@/routes/Routes";

import {
  faCirclePlay,
  faGear,
  faGift,
  faScaleBalanced,
  faScroll,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BottomNavbar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(
    Boolean(searchParams.get("bottomSidebar")),
  );

  return (
    <>
      <BottomSidebar
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setActive("");
        }}
      />

      <div className="fixed bottom-0 z-50 w-full border-t border-white/10 bg-white/5 px-4 pt-2 pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="relative mx-auto flex max-w-2xl items-center justify-between">
          {/* Left Items */}
          <div className="flex items-center gap-4 sm:gap-12">
            <NavItem
              icon={<FontAwesomeIcon icon={faUser} />}
              label="Profile"
              active={active === "Profile"}
              onClick={() => setActive("Profile")}
            />
            <NavItem
              icon={<FontAwesomeIcon icon={faGift} />}
              label="Daily"
              active={active === "Daily"}
              onClick={() => setActive("Daily")}
            />
          </div>

          {/* Center Play Button */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
            <button
              onClick={() => {
                setActive("Play");
                setIsOpen(true);
              }}
              className={clsx(
                "px-4 py-5 bg-accent-gold hover:bg-yellow-500 shadow-xl border-white relative z-10 cursor-pointer rounded-full border-4 transition-all duration-300",
                {
                  "shadow-yellow-400/40 scale-110": active === "Play",
                },
              )}
            >
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-4xl text-white drop-shadow-xl"
              />
            </button>
            <div className="absolute top-1/2 left-1/2 z-0 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/20 blur-xl" />
          </div>

          {/* Right Items */}
          <div className="flex items-center gap-4 sm:gap-12">
            <NavItem
              icon={<FontAwesomeIcon icon={faScaleBalanced} />}
              label="Rules"
              active={active === "Rules"}
              onClick={() => {
                setActive("Rules");
                navigate(RULES_PATH);
              }}
            />
            <NavItem
              icon={<FontAwesomeIcon icon={faScroll} />}
              label="Sings"
              active={active === "Sings"}
              onClick={() => {
                setActive("Sings");
                navigate(SINGS_SHEETS);
              }}
            />
            <NavItem
              icon={<FontAwesomeIcon icon={faGear} />}
              label="Settings"
              active={active === "Settings"}
              onClick={() => setActive("Settings")}
            />
          </div>
        </div>
      </div>
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
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col items-center text-xs transition duration-200 ${
        active ? "text-white" : "text-white/70 hover:text-white"
      }`}
    >
      <div
        className={`rounded-full border px-2.5 py-2 shadow-inner backdrop-blur-sm transition-transform duration-200 lg:px-3 ${
          active
            ? "scale-110 border-white/40 bg-white/20 shadow-md"
            : "border-white/10 bg-white/10 hover:scale-105"
        }`}
      >
        <span className="text-sm landscape:lg:text-lg">{icon}</span>
      </div>
      <span className="mt-1 hidden landscape:lg:block">{label}</span>
    </button>
  );
};
