import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export function ScoreTally({ score, reducedMotion }: { score: number; reducedMotion: boolean }) {
  const text = useRef<HTMLElement>(null);
  const value = useRef({ score });
  useLayoutEffect(() => {
    if (reducedMotion) {
      value.current.score = score;
      if (text.current) text.current.textContent = String(score);
      return;
    }
    const tween = gsap.to(value.current, {
      score,
      duration: 0.26,
      ease: "power2.out",
      onUpdate: () => {
        if (text.current) text.current.textContent = String(Math.round(value.current.score));
      },
    });
    return () => {
      tween.kill();
    };
  }, [score, reducedMotion]);
  return (
    <>
      <span className="sr-only">{score}</span>
      <strong
        ref={text}
        aria-hidden="true"
        className="pb-[12%] title-type text-sm font-normal text-artwork-shadow tabular-nums lg:text-xl"
      >
        {Math.round(value.current.score)}
      </strong>
    </>
  );
}
