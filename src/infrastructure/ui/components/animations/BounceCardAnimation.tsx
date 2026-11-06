import { useAnimate } from "framer-motion";
import { useEffect } from "react";

import { createDeck } from "@/domain/rules/deck";

import { Card } from "../card/Card";

export const BouncingCardAnimation = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const deck = createDeck();

  useEffect(() => {
    const runAnimation = async () => {
      const card = scope.current;
      if (!card) return;

      let rotation = 0;
      let duration = 0.3;
      const growth = 1.25;

      const bounce = async (
        x: string,
        y: string,
        rotation: number,
        duration: number,
      ) => {
        animate(card, { rotate: rotation }, { duration, ease: "linear" });

        await Promise.all([
          animate(
            card.firstElementChild,
            { boxShadow: "none" },
            { duration, ease: "easeInOut" },
          ),

          animate(
            card,
            { left: x, top: y, transformOrigin: "50% 50%" },
            { duration, ease: "easeInOut" },
          ),

          animate(
            card,
            { scaleY: [0.85, 1], scaleX: [1.15, 1] },
            { duration, ease: "easeInOut" },
          ),
        ]);
      };

      await Promise.all([
        animate(
          card,
          {
            top: ["60vh", "66vh"],
            left: ["50vw", "60vw"],
            rotate: -30,
            transformOrigin: "0% 100%",
          },
          { duration: 0.8, ease: "easeOut" },
        ).finished,
        animate(
          card.firstElementChild,
          {
            boxShadow: "0px 20px 30px rgba(0,0,0,0.5)",
          },
          { duration: 0.4, ease: "easeOut" },
        ).finished,
      ]);

      while (duration < 1.2) {
        for (const [x, y] of [
          ["1vw", "45vh"],
          ["45vw", "1vh"],
          ["93vw", "45vh"],
          ["50vw", "80vh"],
        ]) {
          rotation += 360;
          await bounce(x, y, rotation, duration);
          duration *= growth;
        }
      }

      const finalAngle = rotation + Math.random() * 180;
      await animate(
        card,
        { rotate: finalAngle, top: "80vh" },
        { duration: 0.8, ease: "easeOut" },
      ).finished;

      await animate(
        card,
        { rotate: Math.round(finalAngle / 180) * 180, top: "60vh" },
        { duration: 0.8, ease: "easeOut", delay: 1 },
      ).finished;

      onComplete();
    };

    runAnimation().then();
  }, [scope, animate, onComplete]);

  return (
    <div className="absolute inset-0">
      <div
        ref={scope}
        className="absolute top-[60vh] left-1/2 -translate-x-1/2"
        style={{ zIndex: 40 }}
      >
        <Card
          rank={1}
          suit={"coins"}
          faceDown={true}
          style={{
            zIndex: 40,
            top: 40 * 0.25,
          }}
        />
      </div>
      <div className="absolute top-[60vh] left-1/2 -translate-x-1/2">
        {deck.slice(0, 39).map((card, index) => (
          <div
            key={card.suit + card.rank}
            className={"card absolute left-1/2 -translate-x-1/2"}
            style={{ zIndex: index }}
          >
            <Card
              rank={card.rank}
              suit={card.suit}
              faceDown={true}
              style={{
                zIndex: index,
                top: index * 0.25,
                transform: "rotateY(180deg)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
