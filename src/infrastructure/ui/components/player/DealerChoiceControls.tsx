import clsx from "clsx";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import type { GameState } from "@/domain/entities/GameState";

import {
  faArrowDown91,
  faArrowUp91,
  faCirclePlay,
  faTable,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DealerChoiceControlsProps = {
  isOpen: boolean;
};

export const DealerChoiceControls = ({ isOpen }: DealerChoiceControlsProps) => {
  const [dealOrder, setDealOrder] = useState<
    GameState["config"]["dealOrder"] | null
  >(null);
  const [tablePattern, setTablePattern] = useState<
    GameState["config"]["tablePattern"] | null
  >(null);

  const { dealerChoose } = useGameStoreService();

  const ready = dealOrder !== null && tablePattern !== null;

  const handleConfirm = () => {
    if (!ready) return;
    dealerChoose(dealOrder!, tablePattern!);
  };

  const bubbleVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={bubbleVariants}
          transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute -top-32 left-1/2 z-50 flex -translate-x-1/2 items-end justify-center"
        >
          <div className="relative flex h-[120px] w-[220px] items-end justify-center">
            <motion.button
              variants={itemVariants}
              onClick={() => setDealOrder("playersThenTable")}
              className={clsx(
                "absolute left-6 top-6 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                dealOrder === "playersThenTable"
                  ? "bg-accent-gold border-yellow-400 text-black"
                  : "border-white/20 bg-black/30 text-white",
              )}
              title="Players → Table"
            >
              <FontAwesomeIcon icon={faUsers} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setDealOrder("tableThenPlayers")}
              className={clsx(
                "absolute left-16 top-2 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                dealOrder === "tableThenPlayers"
                  ? "bg-accent-gold border-yellow-400 text-black"
                  : "border-white/20 bg-black/30 text-white",
              )}
              title="Table → Players"
            >
              <FontAwesomeIcon icon={faTable} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setTablePattern("inc")}
              className={clsx(
                "absolute right-16 top-2 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                tablePattern === "inc"
                  ? "bg-accent-blue border-blue-400 text-black"
                  : "border-white/20 bg-black/30 text-white",
              )}
              title="Incremental"
            >
              <FontAwesomeIcon icon={faArrowUp91} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setTablePattern("dec")}
              className={clsx(
                "absolute right-6 top-6 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                tablePattern === "dec"
                  ? "bg-accent-blue border-blue-400 text-black"
                  : "border-white/20 bg-black/30 text-white",
              )}
              title="Decremental"
            >
              <FontAwesomeIcon icon={faArrowDown91} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={handleConfirm}
              disabled={!ready}
              className={clsx(
                "absolute top-14 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border text-2xl transition",
                ready
                  ? "border-green-600 bg-green-500 text-white hover:bg-green-400"
                  : "cursor-not-allowed border-white/20 bg-black/30 text-white/50",
              )}
              title="Confirm"
            >
              <FontAwesomeIcon icon={faCirclePlay} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
