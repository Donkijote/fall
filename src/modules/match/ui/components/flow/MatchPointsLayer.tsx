import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

import { PointsBadge } from "@/components/cards/PointsBadge";
import type { ScoreAward } from "@/domain/entities/GameState";

import { scoreAwardLabel } from "../../../application/scorePresentation";

export function MatchPointsLayer({
  board,
  award,
  reducedMotion,
  returning,
  sideName,
  arrive,
}: {
  board: RefObject<HTMLDivElement | null>;
  award?: ScoreAward;
  reducedMotion: boolean;
  returning: boolean;
  sideName: (side: string) => string;
  arrive: (id: string, announcement: string) => void;
}) {
  const token = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ arrive, sideName });
  callbacks.current = { arrive, sideName };

  useLayoutEffect(() => {
    const root = board.current;
    const element = token.current;
    if (!root || !element || !award || returning) return;
    const destination = [...root.querySelectorAll<HTMLElement>("[data-score-side]")].find(
      (node) => node.dataset.scoreSide === award.side,
    );
    const selector = award.source === "hand" ? "[data-match-hand]" : "[data-collector]";
    const source =
      award.source === "table"
        ? undefined
        : [...root.querySelectorAll<HTMLElement>(selector)].find(
            (node) => (node.dataset.matchHand ?? node.dataset.collector) === award.player,
          );
    const finish = () =>
      callbacks.current.arrive(
        award.id,
        `${callbacks.current.sideName(award.side)} +${award.amount} points — ${scoreAwardLabel(award)}`,
      );
    if (reducedMotion || !destination) {
      finish();
      return;
    }
    const pose = { progress: 0 };
    // Read live rectangles during playback: resize, orientation and layout shifts
    // retarget the token without restarting the award or changing its identity.
    const position = () => {
      const bounds = root.getBoundingClientRect();
      const from = source?.getBoundingClientRect();
      const to = destination.getBoundingClientRect();
      const startX = from ? from.left + from.width / 2 : bounds.left + bounds.width / 2;
      const startY = from ? from.top + from.height / 2 : bounds.top + bounds.height * 0.48;
      const endX = to.left + to.width / 2;
      const endY = to.top + to.height / 2;
      const p = pose.progress;
      gsap.set(element, {
        x: startX + (endX - startX) * p - bounds.left,
        y:
          startY +
          (endY - startY) * p -
          bounds.top -
          Math.sin(p * Math.PI) * Math.min(80, bounds.height * 0.12),
      });
    };
    const context = gsap.context(() => {
      gsap.set(element, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.65 });
      position();
      gsap
        .timeline({ onComplete: finish })
        .to(element, { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(1.4)" })
        .to(
          pose,
          { progress: 1, duration: 0.65, ease: "power2.inOut", onUpdate: position },
          "+=0.35",
        )
        .to(element, { opacity: 0, scale: 0.45, duration: 0.14 })
        .fromTo(destination, { scale: 1.12 }, { scale: 1, duration: 0.2, ease: "sine.out" }, "<");
    }, root);
    return () => context.revert();
  }, [award, board, reducedMotion, returning]);

  if (!award || returning) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div
        ref={token}
        data-score-award={award.id}
        className="absolute top-0 left-0 grid justify-items-center gap-1 whitespace-nowrap"
      >
        <PointsBadge points={`+${award.amount}`} className="size-14" />
        <span className="rounded-md bg-background/90 px-2 py-1 text-xs text-foreground shadow-md">
          {scoreAwardLabel(award)}
        </span>
      </div>
    </div>
  );
}
