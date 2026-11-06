import { motion } from "framer-motion";

import bg from "@/assets/lobby/home_2.png";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomNavbar } from "@/infrastructure/ui/components/navbar/BottomNavbar";

export const HomeScreen = () => {
  return (
    <>
      <div
        className="relative flex h-screen w-screen flex-col items-center justify-between bg-cover bg-center text-text-primary"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <header className="relative mt-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-6xl font-bold text-accent-gold drop-shadow-[0_0_12px_rgba(255,200,0,0.8)]"
          >
            The Fall
          </motion.h1>
          <p className="text-sm opacity-80">Modern Edition</p>
        </header>

        <BottomNavbar />
      </div>
      <WelcomeModal />
    </>
  );
};
