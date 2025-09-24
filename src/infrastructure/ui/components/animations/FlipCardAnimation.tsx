import { animate, stagger } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { createDeck } from "@/domain/rules/deck";
import { Card } from "@/infrastructure/ui/components/card/Card";

const numCards = 3;

export const FlipCardAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [faceDown, setFaceDown] = useState<boolean[]>(Array(3).fill(true));
  const deck = createDeck();

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = Array.from(containerRef.current.querySelectorAll(".card"));
    const lastThreeCards = cards.slice(37);

    (async () => {
      if (!containerRef.current) return;

      await animate(
        containerRef.current.querySelector(".cardContainer")!,
        { y: [1500, 0] },
        { duration: 0.8, delay: 2, ease: "easeOut" },
      );

      await Promise.all([
        await animate(
          lastThreeCards[2],
          { x: "-140%", y: "-280%" },
          { duration: 0.6, ease: "easeInOut" },
        ),
        await animate(
          lastThreeCards[1],
          { x: 0, y: "-280%" },
          { duration: 0.6, ease: "easeInOut" },
        ),
        await animate(
          lastThreeCards[0],
          { x: "140%", y: "-280%" },
          { duration: 0.6, ease: "easeInOut" },
        ),
      ]);

      for (let i = 0; i <= numCards - 1; i++) {
        setTimeout(
          () =>
            setFaceDown((prevState) => {
              const updatedState = [...prevState];
              updatedState[i] = false;
              return updatedState;
            }),
          500,
        );
        await animate(
          lastThreeCards[numCards - 1 - i],
          { rotateY: [0, 180] },
          { duration: 1, ease: "easeInOut" },
        );
      }

      const collapseBackAnimations = lastThreeCards.map((card) =>
        animate(card, { x: "-140%" }, { duration: 1, ease: "easeInOut" }),
      );

      await Promise.all(collapseBackAnimations);

      const flipBackAnimations = lastThreeCards.map((card) =>
        animate(
          card,
          { rotateY: [-180, 0] },
          { duration: 0.5, ease: "easeInOut" },
        ),
      );

      setTimeout(() => setFaceDown([true, true, true]), 0.5 * 500);
      await Promise.all(flipBackAnimations);

      await Promise.all([
        animate(
          cards.slice(0, 37),
          {
            y: [0, -30],
            x: [0, 10],
          },
          { duration: 0.3, ease: "easeOut" },
        ),
        animate(cards[0].firstElementChild!, {
          boxShadow: [
            "0px 0px 0px rgba(0,0,0,0)",
            "15px 20px 20px rgba(0,0,0,0.5)",
          ],
        }),
      ]);

      const slideBackCardAnimations = lastThreeCards.map((card) =>
        animate(
          card,
          { y: 0, x: 0, zIndex: 0 },
          { duration: 0.6, delay: stagger(0.2), ease: "easeIn" },
        ),
      );
      await Promise.all(slideBackCardAnimations);

      await Promise.all([
        animate(
          cards,
          {
            y: [-30, 0],
            x: [10, 0],
          },
          { duration: 0.3, ease: "easeOut" },
        ),
        animate(cards[0].firstElementChild!, {
          boxShadow: [
            "15px 20px 20px rgba(0,0,0,0.5)",
            "0px 0px 0px rgba(0,0,0,0)",
          ],
        }),
      ]);
    })();
  }, []);

  return (
    <div ref={containerRef} className="bottom-130 absolute left-[50%]">
      <div className={"cardContainer"}>
        {deck.map((card, index) => (
          <div
            key={index}
            className={"card absolute"}
            style={{ zIndex: index }}
          >
            <Card
              rank={card.rank}
              suit={card.suit}
              faceDown={
                index === deck.length - 1 ||
                index === deck.length - 2 ||
                index === deck.length - 3
                  ? faceDown[deck.length - index - 1]
                  : true
              }
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
