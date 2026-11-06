import clsx from "clsx";
import { motion } from "framer-motion";

import type { GameState } from "@/domain/entities/GameState";

import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PlayerChipProps = {
  name: string;
  score: GameState["scores"]["values"];
  avatar?: string;
  team?: number;
  isMainPlayer?: boolean;
  isDealer: boolean;
};

const teamColors = {
  1: "border-blue-500",
  2: "border-red-500",
  3: "border-green-500",
};

const teamBgColors = {
  1: "bg-blue-600/30",
  2: "bg-red-600/30",
  3: "bg-green-600/30",
};

export const PlayerChip = ({
  name,
  score,
  avatar,
  team,
  isMainPlayer,
  isDealer,
}: PlayerChipProps) => {
  const teamId = (team ?? 1) as keyof typeof teamColors;
  const borderColor = teamColors[teamId];
  const bgColor = teamBgColors[teamId];
  const scoreValue = score[teamId.toString()] ?? 0;
  const isBot = name.toLowerCase().includes("bot");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          className={clsx(
            "xl:w-18 xl:h-18 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-4 shadow-md md:h-14 md:w-14 landscape:h-10 landscape:w-10 landscape:lg:h-12 landscape:lg:w-12",
            borderColor,
            isMainPlayer && "ring-accent-gold ring-4",
          )}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={clsx(
                "flex h-full w-full items-center justify-center",
                bgColor,
              )}
            >
              <span className="text-sm text-white/70 xl:text-xl">
                {isBot ? (
                  <FontAwesomeIcon icon={faRobot} />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </span>
            </div>
          )}
        </div>

        {isDealer && (
          <div
            className={
              "absolute -right-1 -top-1 flex items-center justify-center"
            }
          >
            <motion.div
              initial={{ scale: 1, boxShadow: "0 0 0 rgba(255, 215, 0, 0)" }}
              animate={{
                scale: [1, 1.11, 1],
                boxShadow: [
                  "0 0 1px rgba(255, 215, 0, 0)",
                  "0 0 8px rgba(255, 215, 0, 0.7)",
                  "0 0 1px rgba(255, 215, 0, 0)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-accent-gold absolute h-5 w-5 rounded-full"
            />

            <span className="relative z-10 text-xs font-bold text-black">
              D
            </span>
          </div>
        )}
      </div>

      <div className="text-center text-xs md:text-base landscape:text-[10px] landscape:lg:text-base">
        <p className="text-sm font-semibold text-white">{name}</p>
        <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs text-white backdrop-blur-sm landscape:text-[10px] landscape:lg:text-xs">
          {scoreValue} pts
        </span>
      </div>
    </div>
  );
};
