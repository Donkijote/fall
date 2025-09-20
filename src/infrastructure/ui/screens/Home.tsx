import { motion } from "framer-motion";

import bg from "@/assets/lobby/home_2.png";
import { FlipCardAnimation } from "@/infrastructure/ui/components/animations/FlipCardAnimation";
import { HangingCardAnimation } from "@/infrastructure/ui/components/animations/HangingCardAnimation";
import { IconButton } from "@/infrastructure/ui/components/buttons/IconButton";

import { faGear, faScroll, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const HomeScreen = () => {
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
      <div className="inset-0 bg-black/20 absolute" />

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
      <HangingCardAnimation
        positionClassName={"left-30"}
        threadLongitude={100}
        card={{ rank: 1, suit: "blades" }}
      />
      <HangingCardAnimation
        positionClassName={"left-90"}
        threadLongitude={420}
        card={{ rank: 11, suit: "blades" }}
      />
      <HangingCardAnimation
        positionClassName={"right-90"}
        threadLongitude={820}
        card={{ rank: 12, suit: "blades" }}
      />

      {/* Middle: Actions */}
      {/*
      <main className="gap-4 mb-24 relative flex flex-col items-center">
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
      */}

      {/* Bottom: Utilities */}
      <footer className="gap-6 mb-6 text-sm relative flex items-center justify-center opacity-90">
        <IconButton
          icon={<FontAwesomeIcon icon={faGear} className={"text-[3rem]"} />}
        />
        <IconButton
          icon={<FontAwesomeIcon icon={faScroll} className={"text-[3rem]"} />}
        />
        <IconButton
          icon={<FontAwesomeIcon icon={faUser} className={"text-[3rem]"} />}
        />
      </footer>
    </div>
  );
};
