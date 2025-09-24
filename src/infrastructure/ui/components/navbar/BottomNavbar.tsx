import type { ReactNode } from "react";

import {
  faCirclePlay,
  faGear,
  faGift,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BottomNavbar = () => {
  return (
    <div className="bottom-0 px-4 pb-3 pt-2 bg-white/5 backdrop-blur-md border-white/10 fixed z-50 w-full border-t shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-2xl relative mx-auto flex items-center justify-between">
        {/* Left Items */}
        <div className="gap-4 sm:gap-12 flex items-center">
          <NavItem icon={<FontAwesomeIcon icon={faUser} />} label="Profile" />
          <NavItem icon={<FontAwesomeIcon icon={faGift} />} label="Daily" />
        </div>

        {/* Center Play Button */}
        <div className="-top-12 absolute left-1/2 -translate-x-1/2 transform">
          <button className="px-4 py-5 bg-accent-gold hover:bg-yellow-500 shadow-xl border-white relative z-10 cursor-pointer rounded-full border-4 transition-all duration-300">
            <FontAwesomeIcon
              icon={faCirclePlay}
              className="text-white text-4xl drop-shadow-xl"
            />
          </button>
          <div className="w-24 h-6 bg-yellow-300/20 blur-xl z-0l absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        {/* Right Items */}
        <div className="gap-4 sm:gap-12 flex items-center">
          <NavItem icon={<FontAwesomeIcon icon={faTrophy} />} label="Rank" />
          <NavItem icon={<FontAwesomeIcon icon={faGear} />} label="Settings" />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }: { icon: ReactNode; label: string }) => {
  return (
    <button className="text-xs text-white/80 hover:text-white relative flex cursor-pointer flex-col items-center transition duration-200">
      <div className="bg-white/10 px-2.5 lg:px-3 py-2 shadow-inner border-white/10 backdrop-blur-sm rounded-full border">
        <span className="text-sm landscape:lg:text-lg">{icon}</span>
      </div>
      <span className="mt-1 landscape:lg:block hidden">{label}</span>
    </button>
  );
};
