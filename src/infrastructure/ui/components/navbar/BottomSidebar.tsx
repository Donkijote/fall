import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { StorageKeys, StorageService } from "@/application/services/StorageService";
import OneVsOne from "@/assets/lobby/1vs1.webp";
import OneVsOneVsOne from "@/assets/lobby/1vs2.webp";
import TwoVsTwo from "@/assets/lobby/2vs2.webp";
import type { GameMode } from "@/domain/entities/GameState";
import type { User } from "@/domain/entities/User";
import { GAME_PATH } from "@/routes/Routes";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BottomSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const gameModes = [
  {
    id: "1vs1" as GameMode,
    title: "1 vs 1",
    description: "Classic duel",
    bg: OneVsOne,
    hover: "from-accent-gold/40 to-yellow-500/40",
  },
  {
    id: "1vs2" as GameMode,
    title: "1 vs 2",
    description: "Battle royale style",
    bg: OneVsOneVsOne,
    hover: "from-accent-red/40 to-red-500/40",
  },
  {
    id: "2vs2" as GameMode,
    title: "2 vs 2",
    description: "Team match",
    bg: TwoVsTwo,
    hover: "from-accent-blue to-blue-500/40",
  },
];

export const BottomSidebar = ({ isOpen, onClose }: BottomSidebarProps) => {
  const gameStoreService = useGameStoreService();
  const navigate = useNavigate();

  const onSelectGameMode = (gameMode: GameMode) => {
    const user = StorageService.get<User>(StorageKeys.FALL_USER);
    if (!user) {
      throw new Error("User not found in storage");
    }
    gameStoreService.setupGame(user.id, gameMode);
    navigate(GAME_PATH);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 right-0 bottom-0 left-0 z-40 flex flex-col bg-black/60 backdrop-blur-md"
        >
          {/* Close button */}
          <div className="absolute top-4 right-10 z-100">
            <button
              onClick={() => onClose()}
              className="cursor-pointer text-white/70 transition hover:text-white active:text-white"
            >
              <FontAwesomeIcon icon={faClose} className={"text-3xl"} />
            </button>
          </div>

          <div className="flex flex-1">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                className={clsx(
                  "group border-white/20 shadow-lg relative flex-1 cursor-pointer overflow-hidden border-r last:border-r-0",
                )}
                onClick={() => onSelectGameMode(mode.id)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110 group-active:scale-110"
                  style={{ backgroundImage: `url(${mode.bg})` }}
                />

                <div className="absolute inset-0 bg-black/60 transition group-hover:bg-black/30 group-active:bg-black/30" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-3xl font-bold text-white drop-shadow transition-transform duration-300 group-hover:scale-110 group-active:scale-110 md:text-4xl">
                    {mode.title}
                  </h3>
                  <p className="mt-2 text-white/80 transition-transform duration-300 group-hover:scale-105 group-active:scale-105">
                    {mode.description}
                  </p>
                </div>

                <div
                  className={clsx(
                    "rounded-lg blur-2xl group-hover:active-100 absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r opacity-0 transition group-hover:opacity-100",
                    mode.hover,
                  )}
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
