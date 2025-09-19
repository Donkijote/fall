import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { FlipCardAnimation } from "@/infrastructure/ui/components/animations/FlipCardAnimation";
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
      <FlipCardAnimation />

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
