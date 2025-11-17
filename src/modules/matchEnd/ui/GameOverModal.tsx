import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { useMatchEnd } from "@/modules/matchEnd/application/useMatchEnd";
import { TEXTS } from "@/modules/matchEnd/domain/texts";
import { ICONS } from "@/modules/matchEnd/entities/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConfettiController } from "./components/Confetti";
import { StatPill } from "./components/StatPill";

export const GameOverModal = () => {
  const { isFinished, gameResult, stats, onExit, onNewGame, onReplay } =
    useMatchEnd();

  return (
    <AnimatePresence>
      {isFinished && gameResult && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
          aria-describedby="game-over-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[4px]"
          data-testid={"gameOverModal"}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="relative w-[92%] max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
          >
            <div
              className={clsx("absolute left-0 right-0 top-0 h-1", {
                "bg-accent-green": gameResult === "win",
                "bg-accent-red": gameResult === "lose",
              })}
            />

            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -6, 0], opacity: [1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-text-primary text-6xl"
                aria-hidden
              >
                <FontAwesomeIcon icon={ICONS[gameResult]} />
              </motion.div>
            </div>

            <h2
              id="game-over-title"
              className="text-text-primary mb-2 text-center text-2xl font-bold"
              data-testid={`gameOverModal-title-${gameResult}`}
            >
              {TEXTS[gameResult].title}
            </h2>
            <p
              id="game-over-desc"
              className="text-text-secondary mb-6 text-center"
            >
              {TEXTS[gameResult].message}
            </p>

            {stats?.teamScore && (
              <div className="mb-6 grid grid-cols-1 gap-3 text-sm">
                <StatPill label="Score" value={stats.teamScore} />
              </div>
            )}

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={onReplay}
                className="bg-accent-green text-text-primary focus:ring-accent-green/60 cursor-pointer rounded-lg px-4 py-2 font-semibold shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2"
              >
                Replay <span className="sr-only"> (R)</span>
              </button>

              <button
                onClick={onNewGame}
                className="bg-accent-gold text-background focus:ring-accent-gold/60 cursor-pointer rounded-lg px-4 py-2 font-semibold shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2"
                title="Open game modes"
              >
                New Game <span className="sr-only"> (N)</span>
              </button>
            </div>

            <button
              aria-label="Close"
              onClick={onExit}
              className="text-text-secondary hover:text-text-primary absolute right-3 top-3 cursor-pointer rounded-md border border-white/10 bg-white/10 p-1.5 transition"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <AnimatePresence>
              {gameResult === "win" && (
                <ConfettiController active={isFinished} />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
