import gsap from "gsap";
import { useRef, type RefObject } from "react";

import { useGSAP } from "@gsap/react";

function readPose(card: HTMLElement) {
  const bounds = card.getBoundingClientRect();
  return {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2,
    angle: parseFloat(getComputedStyle(card).rotate) || 0,
  };
}

export function useHandReflow(
  hand: RefObject<HTMLUListElement | null>,
  cardKeys: string,
  reducedMotion: boolean,
) {
  const previous = useRef(new Map<string, ReturnType<typeof readPose>>());

  useGSAP(
    () => {
      const cards = [...(hand.current?.querySelectorAll<HTMLElement>("[data-hand-card]") ?? [])];
      const next = new Map(cards.map((card) => [card.dataset.handCard!, readPose(card)]));

      if (!reducedMotion) {
        for (const card of cards) {
          const key = card.dataset.handCard!;
          const from = previous.current.get(key);
          const to = next.get(key)!;
          if (!from) continue;

          const dx = from.x - to.x;
          const dy = from.y - to.y;
          const rotation = from.angle - to.angle;
          if (Math.abs(dx) + Math.abs(dy) < 0.5 && !rotation) continue;

          // CSS applies the fan rotation before the GSAP transform.
          const angle = (to.angle * Math.PI) / 180;
          gsap.fromTo(
            card,
            {
              x: dx * Math.cos(angle) + dy * Math.sin(angle),
              y: dy * Math.cos(angle) - dx * Math.sin(angle),
              rotation,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.26,
              ease: "power2.out",
              clearProps: "transform",
            },
          );
        }
      }

      previous.current = next;
      function refresh() {
        previous.current = new Map(cards.map((card) => [card.dataset.handCard!, readPose(card)]));
      }
      window.addEventListener("resize", refresh);
      return () => window.removeEventListener("resize", refresh);
    },
    { scope: hand, dependencies: [cardKeys, reducedMotion], revertOnUpdate: true },
  );
}
