import clsx from "clsx";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useState } from "react";

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
  onChoose: (
    dealOrder: GameState["config"]["dealOrder"],
    tablePattern: GameState["config"]["tablePattern"],
  ) => void;
};

export const DealerChoiceControls = ({
  isOpen,
  onChoose,
}: DealerChoiceControlsProps) => {
  const [dealOrder, setDealOrder] = useState<
    GameState["config"]["dealOrder"] | null
  >(null);
  const [tablePattern, setTablePattern] = useState<
    GameState["config"]["tablePattern"] | null
  >(null);

  const ready = dealOrder !== null && tablePattern !== null;

  const handleConfirm = () => {
    if (!ready) return;
    onChoose(dealOrder!, tablePattern!);
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
          className="-top-32 absolute left-1/2 z-50 flex -translate-x-1/2 items-end justify-center"
        >
          <div className="relative flex h-[120px] w-[220px] items-end justify-center">
            <motion.button
              variants={itemVariants}
              onClick={() => setDealOrder("playersThenTable")}
              className={clsx(
                "left-6 top-6 w-10 h-10 absolute flex transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                dealOrder === "playersThenTable"
                  ? "bg-accent-gold text-black border-yellow-400"
                  : "bg-black/30 text-white border-white/20",
              )}
              title="Players → Table"
            >
              <FontAwesomeIcon icon={faUsers} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setDealOrder("tableThenPlayers")}
              className={clsx(
                "left-16 top-2 w-10 h-10 absolute flex transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                dealOrder === "tableThenPlayers"
                  ? "bg-accent-gold text-black border-yellow-400"
                  : "bg-black/30 text-white border-white/20",
              )}
              title="Table → Players"
            >
              <FontAwesomeIcon icon={faTable} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setTablePattern("inc")}
              className={clsx(
                "right-16 top-2 w-10 h-10 absolute flex transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                tablePattern === "inc"
                  ? "bg-accent-blue text-black border-blue-400"
                  : "bg-black/30 text-white border-white/20",
              )}
              title="Incremental"
            >
              <FontAwesomeIcon icon={faArrowUp91} />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setTablePattern("dec")}
              className={clsx(
                "right-6 top-6 w-10 h-10 absolute flex transform cursor-pointer items-center justify-center rounded-full border transition hover:scale-110",
                tablePattern === "dec"
                  ? "bg-accent-blue text-black border-blue-400"
                  : "bg-black/30 text-white border-white/20",
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
                "top-14 w-12 h-12 text-2xl absolute flex cursor-pointer items-center justify-center rounded-full border transition",
                ready
                  ? "bg-green-500 hover:bg-green-400 text-white border-green-600"
                  : "bg-black/30 text-white/50 border-white/20 cursor-not-allowed",
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
