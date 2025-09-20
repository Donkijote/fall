import { clsx } from "clsx";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

import type { Card as ICard } from "@/domain/entities/Card";

import { Card } from "../card/Card";

type HangingCardAnimationProps = {
  positionClassName: string;
  threadLongitude: number;
  card: ICard;
};

export const HangingCardAnimation = ({
  positionClassName,
  threadLongitude,
  card: { rank, suit },
}: HangingCardAnimationProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const runAnimation = async () => {
      const container = scope.current;

      await Promise.all([
        // Step 1 + 2 + 3: Drop + Bounce + elastic rope stretch
        animate(
          container,
          {
            y: [-1000, 0, -50, 0, -25, 0],
            scaleY: [1, 1.1, 1, 1.05, 1], // simulate rope stretch
          },
          {
            duration: 1.2,
            ease: "easeInOut",
            delay: Math.floor(Math.random() * 2.75),
          },
        ),

        // Step 4: Infinite sway (rope, knot, and card together)
        animate(
          container,
          { rotateZ: [-6, 6, -6] },
          {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.floor(Math.random() * 2.365),
          },
        ),
      ]);
    };

    runAnimation().then();
  }, [animate, scope]);

  return (
    <div className={clsx("absolute", positionClassName)}>
      <motion.div ref={scope} className="flex origin-top flex-col items-center">
        {/* Rope */}
        <div
          className="bg-gray-400"
          style={{ width: "2px", height: `${threadLongitude}px` }}
        />

        {/* Knot */}
        <div className="w-3 h-3 bg-gray-500 shadow-md -mt-1 z-10 rounded-full" />

        {/* Card with delayed infinite flip */}
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.6, // slight delay after rope bounce
          }}
          className="origin-top"
        >
          <Card rank={rank} suit={suit} faceDown={false} />
        </motion.div>
      </motion.div>
    </div>
  );
};
