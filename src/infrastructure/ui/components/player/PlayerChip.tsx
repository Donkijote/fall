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
    <div className="gap-2 flex flex-col items-center">
      <div className="relative">
        <div
          className={clsx(
            "shadow-md w-12 h-12 md:w-14 md:h-14 text-xs lg:w-18 lg:h-18 lg:text-base flex items-center justify-center overflow-hidden rounded-full border-4",
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
              <span className="text-white/70 text-sm xl:text-xl">
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
              "-top-1 -right-1 absolute flex items-center justify-center"
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
              className="h-5 w-5 bg-accent-gold absolute rounded-full"
            />

            <span className="text-xs font-bold text-black relative z-10">
              D
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-white">{name}</p>
        <span className="px-2 py-0.5 text-xs text-white bg-white/30 backdrop-blur-sm rounded-full">
          {scoreValue} pts
        </span>
      </div>
    </div>
  );
};
