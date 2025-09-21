import { useAnimate } from "framer-motion";
import { useEffect } from "react";

import { Card } from "@/infrastructure/ui/components/card/Card";

export const CutShuffleCardAnimation = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!scope.current) return;

      const allCards = Array.from(
        scope.current.querySelectorAll(".shuffle-card"),
      ) as HTMLElement[];

      for (let round = 0; round < 3; round++) {
        if (!mounted) return;

        // STEP 1 — pick a random slice in the middle
        const mid = Math.floor(allCards.length / 2);
        const cutSize = Math.floor(5 + Math.random() * 8); // 5–12 cards
        const start = mid - Math.floor(cutSize / 2);
        const cut = allCards.slice(start, start + cutSize);

        // STEP 2 — lift + move right
        await Promise.all(
          cut.map(
            (c, i) =>
              animate(
                c,
                {
                  x: 60,
                  y: -30 - i * 2,
                  boxShadow: "0px 8px 15px rgba(0,0,0,0.4)",
                },
                { duration: 0.4, delay: i * 0.05 },
              ).finished,
          ),
        );

        if (!mounted) return;

        // STEP 3 — close the gap (collapse top & bottom piles)
        const above = allCards.slice(0, start);
        const below = allCards.slice(start + cutSize);

        // push down the "above" pile to meet the "below"
        await Promise.all(
          above.map(
            (c, i) =>
              animate(
                c,
                { y: cutSize * 2 }, // move up by card thickness * count
                { duration: 0.3 },
              ).finished,
          ),
        );

        if (!mounted) return;

        // STEP 4 — move cut pile above deck
        await animate(
          cut,
          { x: 0, y: -(allCards.length * 1.5), zIndex: 100 },
          { duration: 0.5 },
        ).finished;

        // STEP 5 — drop onto top
        await animate(
          cut,
          { y: -allCards.length, zIndex: 0 },
          { duration: 0.3 },
        ).finished;

        // Reset boxShadow
        cut.forEach((c) => (c.style.boxShadow = "none"));

        // STEP 6 — reorder DOM so cut cards are on top
        cut.forEach((c) => scope.current?.appendChild(c));

        // reset transform for all cards
        allCards.forEach((c) => (c.style.transform = ""));

        // small pause
        await new Promise((r) => setTimeout(r, 300));
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [scope, animate]);

  return (
    <div ref={scope} className="relative h-[400px] w-[300px]">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="shuffle-card absolute"
          style={{
            top: i * 2,
            left: 0,
            zIndex: 100 - i,
          }}
        >
          <Card faceDown={true} rank={1} suit={"golds"} />
        </div>
      ))}
    </div>
  );
};
