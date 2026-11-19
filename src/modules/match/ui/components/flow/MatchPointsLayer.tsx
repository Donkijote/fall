import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

import { PointsBadge } from "@/components/cards/PointsBadge";
import type { ScoreAward } from "@/domain/entities/GameState";

import { scoreAwardLabel } from "../../../application/scorePresentation";
import { pointsFlight } from "./pointsFlight";

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
  const caption = useRef<HTMLSpanElement>(null);
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
    const pose = { progress: 0, reveal: 0.65 };
    // Read live rectangles during playback: resize, orientation and layout shifts
    // retarget the token without restarting the award or changing its identity.
    const position = () => {
      const flight = pointsFlight({
        bounds: root.getBoundingClientRect(),
        source: source?.getBoundingClientRect(),
        destination: destination.getBoundingClientRect(),
        badge: { width: element.offsetWidth || 56, height: element.offsetHeight || 56 },
        caption: {
          width: caption.current?.offsetWidth ?? 0,
          height: caption.current?.offsetHeight ?? 0,
        },
        progress: pose.progress,
        reveal: pose.reveal,
      });
      gsap.set(element, { x: flight.x, y: flight.y, scale: flight.scale });
      if (caption.current) gsap.set(caption.current, { opacity: flight.captionOpacity });
    };
    const context = gsap.context(() => {
      gsap.set(element, { xPercent: -50, yPercent: -50, opacity: 0 });
      position();
      gsap
        .timeline({ onComplete: finish })
        .to(element, { opacity: 1, duration: 0.18 })
        .to(pose, { reveal: 1, duration: 0.18, ease: "back.out(1.4)", onUpdate: position }, 0)
        .to(
          pose,
          { progress: 1, duration: 0.65, ease: "power2.inOut", onUpdate: position },
          "+=0.35",
        )
        .to(element, { opacity: 0, duration: 0.14 })
        .fromTo(destination, { scale: 1.12 }, { scale: 1, duration: 0.2, ease: "sine.out" }, "<");
    }, root);
    window.addEventListener("resize", position);
    const observer =
      typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(position);
    observer?.observe(root);
    return () => {
      window.removeEventListener("resize", position);
      observer?.disconnect();
      context.revert();
    };
  }, [award, board, reducedMotion, returning]);

  if (!award || returning) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div
        ref={token}
        data-score-award={award.id}
        className="absolute top-0 left-0 grid justify-items-center whitespace-nowrap"
      >
        <PointsBadge points={`+${award.amount}`} className="size-14 @2xl:size-14" />
        <span
          ref={caption}
          className="absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-md bg-background/90 px-2 py-1 text-xs text-foreground shadow-md"
        >
          {scoreAwardLabel(award)}
        </span>
      </div>
    </div>
  );
}
