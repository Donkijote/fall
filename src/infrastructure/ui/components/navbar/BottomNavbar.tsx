import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { BottomSidebar } from "@/infrastructure/ui/components/navbar/BottomSidebar";
import { SINGS_SHEETS } from "@/routes/Routes";

import {
  faCirclePlay,
  faGear,
  faGift,
  faScroll,
  faTrophy,
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

      <div className="bottom-0 px-4 pb-3 pt-2 bg-white/5 backdrop-blur-md border-white/10 fixed z-50 w-full border-t shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-2xl relative mx-auto flex items-center justify-between">
          {/* Left Items */}
          <div className="gap-4 sm:gap-12 flex items-center">
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
          <div className="-top-12 absolute left-1/2 -translate-x-1/2 transform">
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
                className="text-white text-4xl drop-shadow-xl"
              />
            </button>
            <div className="w-24 h-6 bg-yellow-300/20 blur-xl absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </div>

          {/* Right Items */}
          <div className="gap-4 sm:gap-12 flex items-center">
            <NavItem
              icon={<FontAwesomeIcon icon={faTrophy} />}
              label="Rank"
              active={active === "Rank"}
              onClick={() => setActive("Rank")}
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
      className={`text-xs relative flex cursor-pointer flex-col items-center transition duration-200 ${
        active ? "text-white" : "text-white/70 hover:text-white"
      }`}
    >
      <div
        className={`px-2.5 lg:px-3 py-2 shadow-inner backdrop-blur-sm rounded-full border transition-transform duration-200 ${
          active
            ? "bg-white/20 border-white/40 shadow-md scale-110"
            : "bg-white/10 border-white/10 hover:scale-105"
        }`}
      >
        <span className="text-sm landscape:lg:text-lg">{icon}</span>
      </div>
      <span className="mt-1 landscape:lg:block hidden">{label}</span>
    </button>
  );
};
