import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";

import { faSkull, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type GameResult = "win" | "lose";

export interface GameOverStats {
  rounds?: number;
  turns?: number;
  durationMs?: number;
  mvp?: string;
  teamScore?: [number, number];
}

export interface GameOverModalProps {
  isOpen: boolean;
  result: GameResult;
  pointsToWin?: number;
  onReplay: () => void;
  onNewGame: () => void;
  onClose?: () => void;
  stats?: GameOverStats;
  children?: React.ReactNode;
}

const ICONS: Record<GameResult, typeof faSkull> = {
  win: faTrophy,
  lose: faSkull,
};

const msToClock = (ms?: number) => {
  if (!ms && ms !== 0) return undefined;
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  pointsToWin = 24,
  onReplay,
  onNewGame,
  onClose,
  stats,
  children,
}) => {
  const { title, message } = useMemo(() => {
    if (result === "win") {
      return {
        title: "You Win!",
        message: "Legendary play. Want to run it back?",
      } as const;
    }
    return {
      title: "Game Over",
      message: `They reached ${pointsToWin} points first. You'll get them next time!`,
    } as const;
  }, [result, pointsToWin]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
      if (e.key.toLowerCase() === "r") onReplay();
      if (e.key.toLowerCase() === "n") onNewGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onReplay, onNewGame]);

  const showConfetti = result === "win";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
          aria-describedby="game-over-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inset-0 bg-black/60 fixed z-50 flex items-center justify-center backdrop-blur-[4px]"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) onClose?.();
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="max-w-lg rounded-2xl bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-md border-white/10 relative w-[92%] overflow-hidden border"
          >
            <div
              className={clsx("left-0 right-0 top-0 h-1 absolute", {
                "bg-accent-green": result === "win",
                "bg-accent-red": result === "lose",
              })}
            />

            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -6, 0], opacity: [1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl text-text-primary"
                aria-hidden
              >
                <FontAwesomeIcon icon={ICONS[result]} />
              </motion.div>
            </div>

            <h2
              id="game-over-title"
              className="mb-2 text-2xl font-bold text-text-primary text-center"
            >
              {title}
            </h2>
            <p
              id="game-over-desc"
              className="mb-6 text-text-secondary text-center"
            >
              {message}
            </p>

            {(stats?.rounds ||
              stats?.turns ||
              stats?.durationMs ||
              stats?.teamScore) && (
              <div className="mb-6 gap-3 text-sm grid grid-cols-1">
                {typeof stats?.rounds === "number" && (
                  <StatPill label="Rounds" value={stats.rounds} />
                )}
                {typeof stats?.turns === "number" && (
                  <StatPill label="Turns" value={stats.turns} />
                )}
                {typeof stats?.durationMs === "number" && (
                  <StatPill
                    label="Duration"
                    value={msToClock(stats.durationMs)}
                  />
                )}
                {Array.isArray(stats?.teamScore) && (
                  <StatPill
                    label="Score"
                    value={`${stats!.teamScore[0]} - ${stats!.teamScore[1]}`}
                  />
                )}
              </div>
            )}

            {children}

            <div className="mt-2 gap-3 sm:grid-cols-2 grid grid-cols-1">
              <button
                onClick={onReplay}
                className="rounded-lg bg-accent-green px-4 py-2 font-semibold text-text-primary shadow-lg focus:ring-accent-green/60 cursor-pointer transition hover:brightness-110 focus:ring-2 focus:outline-none"
              >
                Replay
                <span className="sr-only"> (R)</span>
              </button>

              <button
                onClick={onNewGame}
                className="rounded-lg bg-accent-gold px-4 py-2 font-semibold text-background shadow-lg focus:ring-accent-gold/60 cursor-pointer transition hover:brightness-110 focus:ring-2 focus:outline-none"
                title="Open game modes"
              >
                New Game
                <span className="sr-only"> (N)</span>
              </button>
            </div>

            <button
              aria-label="Close"
              onClick={onClose}
              className="right-3 top-3 rounded-md border-white/10 bg-white/10 p-1.5 text-text-secondary hover:text-text-primary absolute cursor-pointer border transition"
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
              {showConfetti && <ConfettiController active={isOpen} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatPill: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg border-white/10 bg-white/5 px-3 py-2 border text-center">
    <div className="text-xs tracking-wide text-text-disabled uppercase">
      {label}
    </div>
    <div className="text-base font-semibold text-text-primary">
      {value ?? "—"}
    </div>
  </div>
);

type Side = "left" | "right";

const ConfettiController: React.FC<{ active: boolean }> = ({ active }) => {
  const [side, setSide] = React.useState<Side>("left");
  const [burstId, setBurstId] = React.useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSide((s) => (s === "left" ? "right" : "left"));
      setBurstId((n) => n + 1);
    }, 1700);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;
  return (
    <div
      aria-hidden
      className="inset-0 pointer-events-none absolute overflow-hidden"
    >
      <ConfettiBurst
        key={`${side}-${burstId}`}
        side={side}
        seed={burstId}
        count={28}
      />
    </div>
  );
};

const ConfettiBurst: React.FC<{ side: Side; seed: number; count?: number }> = ({
  side,
  seed,
  count = 28,
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <ConfettiPiece key={i} index={i} side={side} seed={seed} />
    ))}
  </>
);

const ConfettiPiece: React.FC<{ index: number; side: Side; seed: number }> = ({
  index,
  side,
  seed,
}) => {
  const pr = (n: number) => {
    const x = Math.sin((n + seed * 17) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const startX = side === "left" ? pr(index) * 12 : 92 + pr(index) * 4;
  const endX = pr(index + 1) * 100;
  const duration = 1.4 + pr(index + 3) * 0.8;
  const delay = pr(index + 4) * 0.1;
  const rotate = Math.floor(pr(index + 5) * 360);
  const spin = rotate + (side === "left" ? 180 : -180);
  const size = 6 + Math.floor(pr(index + 6) * 10);
  const hues = [
    "bg-accent-gold",
    "bg-accent-green",
    "bg-accent-blue",
    "bg-accent-red",
  ];
  const hue = hues[index % hues.length];
  const startTop = -10;
  const endTop = 110;

  return (
    <motion.span
      initial={{ left: `${startX}%`, top: `${startTop}%`, opacity: 1 }}
      animate={{
        left: [`${startX}%`, `${endX}%`],
        top: [`${startTop}%`, `${endTop}%`],
        opacity: [1, 1, 0.25],
        rotate: [rotate, spin],
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={`absolute block ${hue}`}
      style={{ width: size, height: size, borderRadius: 2 }}
    />
  );
};
