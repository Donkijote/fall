import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { Rank, Suit } from "@/domain/entities/Card";
import { Card } from "@/infrastructure/ui/components/card/Card";
import { TABLES_BACKGROUND } from "@/infrastructure/ui/constants/tables";

export const HomeScreen = () => {
  const [bg, setBg] = useState("");

  useEffect(() => {
    const random =
      TABLES_BACKGROUND[Math.floor(Math.random() * TABLES_BACKGROUND.length)];
    setBg(random);
  }, []);

  return (
    <div
      className="text-text-primary relative flex h-screen w-screen flex-col items-center justify-between"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="inset-0 bg-black/60 absolute" />

      {/* Top: Title */}
      <header className="mt-8 relative text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold text-accent-gold drop-shadow-[0_0_12px_rgba(255,200,0,0.8)]"
        >
          The Fall
        </motion.h1>
        <p className="text-sm opacity-80">Modern Edition</p>
      </header>

      {/* Floating Cards (decorative) */}
      <AnimatedBackground />

      {/* Middle: Actions */}
      <main className="gap-4 mb-24 relative flex flex-col items-center">
        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="gap-6 relative z-10 flex flex-col"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-6 text-xl font-bold text-black rounded-2xl shadow-lg bg-accent-gold cursor-pointer"
          >
            Play
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-base rounded-xl border-accent-red text-accent-red hover:bg-accent-red/10 cursor-pointer border transition"
          >
            Quick Match
          </motion.button>
        </motion.div>
      </main>

      {/* Bottom: Utilities */}
      <footer className="gap-6 mb-6 text-sm relative flex items-center justify-center opacity-70">
        <button>⚙️ Settings</button>
        <button>📜 Rules</button>
        <button>👤 Profile</button>
      </footer>
    </div>
  );
};

const cards = [
  { rank: 12, suit: "blades", x: 50, y: 80, delay: 0 },
  { rank: 12, suit: "cups", x: 50, y: 80, delay: 0 },
  { rank: 12, suit: "golds", x: 50, y: 80, delay: 0 },
  { rank: 12, suit: "clubs", x: 50, y: 80, delay: 0 },
  { rank: 11, suit: "clubs", x: 220, y: 160, delay: 0.3 },
  { rank: 11, suit: "blades", x: 220, y: 160, delay: 0.3 },
  { rank: 11, suit: "cups", x: 220, y: 160, delay: 0.3 },
  { rank: 11, suit: "golds", x: 220, y: 160, delay: 0.3 },
  { rank: 1, suit: "cups", x: 380, y: 240, delay: 0.6 },
  { rank: 1, suit: "blades", x: 380, y: 240, delay: 0.6 },
  { rank: 1, suit: "clubs", x: 380, y: 240, delay: 0.6 },
  { rank: 1, suit: "golds", x: 380, y: 240, delay: 0.6 },
];

const AnimatedBackground = () => {
  console.log("here");
  return (
    <div className="inset-0 absolute overflow-hidden">
      {cards.map((c, i) => (
        <motion.div
          key={c.rank + c.suit + i}
          className="absolute"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1], // subtle breathing effect
            y: [c.y, c.y + 10, c.y], // soft float up/down
            rotate: [0, 2, -2, 0], // gentle tilt
          }}
          transition={{
            duration: 10 + i * 2,
            delay: c.delay,
            ease: "easeInOut",
            repeat: Infinity, // loop forever
          }}
        >
          <Card rank={c.rank as Rank} size={"sm"} suit={c.suit as Suit} />
        </motion.div>
      ))}
    </div>
  );
};
