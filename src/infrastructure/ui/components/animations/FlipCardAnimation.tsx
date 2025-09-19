import { animate, stagger } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Rank } from "@/domain/entities/Card";
import { Card } from "@/infrastructure/ui/components/card/Card";

const numCards = 3;
const spreadDistance = 120;
const flipDirection = "right";

export const FlipCardAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [faceDown, setFaceDown] = useState<boolean[]>(Array(3).fill(true));

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = Array.from(containerRef.current.querySelectorAll(".card"));

    (async () => {
      // Step 1: Fade in stacked
      const fadeInAnimations = cards.map((card) =>
        animate(
          card,
          { opacity: [0, 1], y: [-150, 0] },
          { duration: 0.8, delay: 2, ease: "easeOut" },
        ),
      );
      await Promise.all(fadeInAnimations);

      // Step 2: Spread
      const spreadAnimations = cards.map((card, i) =>
        animate(
          card,
          { x: (i + 1 - Math.floor(numCards / 2)) * spreadDistance },
          { duration: 1, ease: "easeInOut" },
        ),
      );
      await Promise.all(spreadAnimations);

      // Step 3: Flip (update faceDown state halfway through)
      setTimeout(() => setFaceDown(Array(numCards).fill(false)), 3 * 500);
      const flipAnimations = cards.map((card) =>
        animate(
          card,
          { rotateY: flipDirection === "right" ? [0, 180] : [0, -180] },
          { duration: 3, ease: "easeInOut" },
        ),
      );
      await Promise.all(flipAnimations);

      // Step 4: Collapse back
      const collapseAnimations = cards.map((card) =>
        animate(card, { x: 0 }, { duration: 1, ease: "easeInOut" }),
      );
      await Promise.all(collapseAnimations);

      // Step 5: Slide out
      const slideOutAnimations = cards.map((card) =>
        animate(
          card,
          { y: 800, opacity: 0 },
          { duration: 0.8, delay: stagger(0.2), ease: "easeIn" },
        ),
      );
      await Promise.all(slideOutAnimations);

      // Reset for reuse
      setFaceDown(Array(numCards).fill(true));
      cards.forEach((card) => {
        (card as HTMLElement).style.transform = "";
        (card as HTMLElement).style.opacity = "0";
      });
    })();
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      {[1, 11, 12].map((rank, i) => (
        <div key={i} className="card absolute">
          <Card rank={rank as Rank} suit={"golds"} faceDown={faceDown[i]} />
        </div>
      ))}
    </div>
  );
};
