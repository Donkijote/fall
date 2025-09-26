import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import bg from "@/assets/lobby/home_2.png";
import { BouncingCardAnimation } from "@/infrastructure/ui/components/animations/BounceCardAnimation";
import { FlipCardAnimation } from "@/infrastructure/ui/components/animations/FlipCardAnimation";
import { HangingCardAnimation } from "@/infrastructure/ui/components/animations/HangingCardAnimation";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomNavbar } from "@/infrastructure/ui/components/navbar/BottomNavbar";
import { useBreakpoint } from "@/infrastructure/ui/hooks/useBreakpoint";

export const HomeScreen = () => {
  const [animation, setAnimation] = useState<"flip" | "bounce">("flip");
  const { breakpoint, isMobile, orientation } = useBreakpoint();

  const handleComplete = useCallback(() => {
    setAnimation((prev) => (prev === "flip" ? "bounce" : "flip"));
  }, []);

  let secondThreadLongitude = 420;
  let thirdThreadLongitude = 820;

  if (
    breakpoint &&
    isMobile &&
    orientation === "landscape" &&
    breakpoint !== "sm"
  ) {
    secondThreadLongitude = 330;
    thirdThreadLongitude = 230;
  }

  return (
    <>
      <div
        className="text-text-primary relative flex h-screen w-screen flex-col items-center justify-between bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="inset-0 bg-black/20 absolute" />

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

        {animation === "flip" ? (
          <FlipCardAnimation onComplete={handleComplete} />
        ) : (
          <BouncingCardAnimation onComplete={handleComplete} />
        )}
        <HangingCardAnimation
          positionClassName={"left-30 md:left-20"}
          threadLongitude={100}
          card={{ rank: 1, suit: "blades" }}
        />
        <HangingCardAnimation
          positionClassName={"left-90 md:left-40"}
          threadLongitude={secondThreadLongitude}
          card={{ rank: 11, suit: "blades" }}
        />
        <HangingCardAnimation
          positionClassName={"right-90 md:right-40"}
          threadLongitude={thirdThreadLongitude}
          card={{ rank: 12, suit: "blades" }}
        />

        <BottomNavbar />
      </div>
      <WelcomeModal />
    </>
  );
};
