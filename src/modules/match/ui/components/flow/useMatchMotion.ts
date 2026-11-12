import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

import cardBack from "@/assets/cards/back.svg";
import { captureBend, captureGesture } from "@/components/cards/motion/captureGesture";
import { countingArrival, countingProgress } from "@/components/cards/motion/cardCounting";
import { cardFlights } from "@/components/cards/motion/cardFlights";

import { useGSAP } from "@gsap/react";

import { localPlayerId, type MatchMotion } from "../../../application/localMatch";

export function useMatchMotion(
  scope: RefObject<HTMLDivElement | null>,
  motion: MatchMotion | undefined,
  reducedMotion: boolean,
  returning: boolean,
  complete: () => void,
) {
  const previousHand = useRef(new Map<string, DOMRect>());
  useGSAP(
    () => {
      const root = scope.current;
      if (!motion || returning || !root) return;
      if (reducedMotion) {
        complete();
        return;
      }

      const overlay = root.querySelector<HTMLElement>("[data-card-flights]")!;
      const find = (attribute: string, value: string) =>
        root.querySelector<HTMLElement>(`[data-${attribute}="${value}"]`);
      const timeline = gsap.timeline({ onComplete: complete });
      const center = (rect: DOMRect) => ({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });

      function fly(
        card: HTMLElement,
        from: Element | DOMRect,
        to: Element,
        at: number,
        duration: number,
        kind: "deal" | "play" | "collect" | "count",
        index = 0,
        startsFaceUp = false,
      ) {
        const image = card.querySelector("img");
        if (!image) return;
        const rect = image.getBoundingClientRect();
        const start = center(from instanceof Element ? from.getBoundingClientRect() : from);
        const end = center(to.getBoundingClientRect());
        const clone = image.cloneNode() as HTMLImageElement;
        const face = image.getAttribute("src") ?? image.src;
        const padding = getComputedStyle(image).padding;
        Object.assign(clone.style, {
          position: "fixed",
          left: "0",
          top: "0",
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          padding,
          visibility: "hidden",
        });
        overlay.append(clone);

        const positionX = gsap.quickSetter(clone, "x", "px");
        const positionY = gsap.quickSetter(clone, "y", "px");
        const rotation = gsap.quickSetter(clone, "rotation", "deg");
        const scaleX = gsap.quickSetter(clone, "scaleX");
        const scaleY = gsap.quickSetter(clone, "scaleY");
        const progress = { value: 0 };
        const sourceBack = kind === "deal" || (kind === "play" && !startsFaceUp);
        if (kind !== "count")
          timeline.set(card, { visibility: "hidden" }, kind === "collect" ? at : 0);
        timeline.set(clone, { visibility: "visible" }, at);
        timeline.to(
          progress,
          {
            value: 1,
            duration,
            ease:
              kind === "collect"
                ? "none"
                : kind === "deal"
                  ? cardFlights.deal.ease
                  : cardFlights.play.ease,
            onUpdate() {
              const t = progress.value;
              const gesture = captureGesture(t, index + 2, 0.4);
              const travel = kind === "collect" ? gesture.travel : t;
              const bend = captureBend(start, end, gesture.side * 75);
              const flip = kind === "collect" ? t > 0.5 : sourceBack && t < 0.5;
              if (clone.getAttribute("src") !== (flip ? cardBack : face))
                clone.src = flip ? cardBack : face;
              clone.style.padding = flip ? "0" : padding;
              positionX(start.x + (end.x - start.x) * travel - rect.width / 2 + bend.x);
              positionY(
                start.y + (end.y - start.y) * travel - rect.height / 2 - gesture.lift * 44 + bend.y,
              );
              const shrink = 1 - 0.86 * travel;
              const edgeOn = Math.max(0.08, Math.abs(Math.cos(Math.PI * t)));
              scaleX(kind === "count" ? shrink : sourceBack || kind === "collect" ? edgeOn : 1);
              scaleY(
                kind === "count"
                  ? shrink
                  : kind === "collect"
                    ? 1 - 0.35 * travel
                    : 1 + gesture.lift * 0.26,
              );
              rotation(gesture.yaw * 60);
            },
          },
          at,
        );
        timeline.set(clone, { visibility: "hidden" }, at + duration);
        if (kind === "deal" || kind === "play")
          timeline.set(card, { visibility: "visible" }, at + duration);
      }

      if (motion.kind === "deal") {
        const origin = find("draw-pile", motion.dealer)?.firstElementChild;
        if (origin)
          motion.cards.forEach((key, index) => {
            const table = find("table-card", key);
            const card = table ?? find("hand-card", key);
            if (card)
              fly(
                card,
                origin,
                card.querySelector("img") ?? card,
                (index * cardFlights.deal.stagger) / 3,
                table ? cardFlights.deal.table : cardFlights.deal.hand,
                "deal",
                index,
              );
          });
      } else if (motion.kind === "play") {
        const card = find("table-card", motion.card);
        const hand = find("match-hand", motion.player);
        const origin = previousHand.current.get(motion.card) ?? hand?.firstElementChild ?? hand;
        if (card && origin)
          fly(
            card,
            origin,
            card,
            0,
            cardFlights.play.duration,
            "play",
            0,
            motion.player === localPlayerId,
          );
      } else if (motion.kind === "collect") {
        const pile = find("collector", motion.player)?.firstElementChild;
        if (pile)
          motion.cards.forEach((key, index) => {
            const card = find("table-card", key);
            if (card)
              fly(card, card, pile, index * 0.085, cardFlights.collect.duration, "collect", index);
          });
      } else {
        for (const group of motion.groups) {
          const label = find("count-side", String(group.side));
          if (!label) continue;
          let countedCards = 0;
          for (const pile of motion.piles.filter(({ side }) => side === group.side)) {
            const stack = find("collector", pile.player)?.firstElementChild;
            if (!stack || !(stack instanceof HTMLElement)) continue;
            for (let i = 0; i < pile.cards; i++) {
              const duration = 0.24;
              const arrival = countingArrival(countedCards++, group.quota) * 0.48;
              fly(stack, stack, label, arrival - duration, duration, "count", i);
            }
          }
          const clock = { seconds: 0 };
          const end = group.cards ? countingArrival(group.cards - 1, group.quota) : 0;
          timeline.to(
            clock,
            {
              seconds: end,
              duration: end * 0.48,
              ease: "none",
              onUpdate() {
                const { counted, points } = countingProgress(
                  clock.seconds,
                  group.cards,
                  group.quota,
                );
                label.textContent = `${counted}/${group.cards} cards · +${points}`;
              },
            },
            0,
          );
        }
        timeline.to({}, { duration: 0.65 });
      }
      if (!timeline.duration()) complete();

      // Settle the current flight if the board moves to a new layout.
      const finishOnResize = () => complete();
      window.addEventListener("resize", finishOnResize);
      return () => {
        window.removeEventListener("resize", finishOnResize);
        overlay.replaceChildren();
      };
    },
    { scope, dependencies: [motion, reducedMotion, returning], revertOnUpdate: true },
  );

  useLayoutEffect(() => {
    if (motion || !scope.current) return;
    const root = scope.current;
    const measure = () => {
      previousHand.current = new Map(
        [...root.querySelectorAll<HTMLElement>("[data-hand-card]")].map((card) => [
          card.dataset.handCard!,
          card.getBoundingClientRect(),
        ]),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });
}
