import gsap from "gsap";
import { useRef, type ReactNode } from "react";

import { useGSAP } from "@gsap/react";

export function MatchHandCard({
  children,
  canPlay,
  reducedMotion,
  play,
}: {
  children: ReactNode;
  canPlay: boolean;
  reducedMotion: boolean;
  play: () => void;
}) {
  const visual = useRef<HTMLSpanElement>(null);
  const tween = useRef<gsap.core.Tween>(null);
  const { contextSafe } = useGSAP(
    () => {
      if (reducedMotion && visual.current) gsap.set(visual.current, { clearProps: "transform" });
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  const highlight = contextSafe((active: boolean) => {
    if (!canPlay || reducedMotion || !visual.current) return;
    tween.current = gsap.to(visual.current, {
      scale: active ? 1.12 : 1,
      y: active ? -5 : 0,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  return (
    <button
      type="button"
      aria-disabled={!canPlay}
      className="relative grid min-h-11 min-w-8 place-items-center rounded-md p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-artwork-foreground aria-[disabled=false]:pointer-events-auto aria-[disabled=false]:cursor-pointer"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") highlight(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.matches(":focus-visible"))
          highlight(false);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) highlight(true);
      }}
      onBlur={() => highlight(false)}
      onClick={() => {
        if (!canPlay) return;
        tween.current?.pause();
        play();
      }}
    >
      <span ref={visual} className="block">
        {children}
      </span>
    </button>
  );
}
