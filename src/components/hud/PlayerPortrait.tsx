import { cn } from "cn";
import gsap from "gsap";
import { UserRound } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./PlayerPortrait.css";

export function PlayerPortrait({
  avatarUrl,
  fallbackAvatarUrl,
  fallback = <UserRound aria-hidden="true" />,
  className,
}: {
  avatarUrl?: string;
  fallbackAvatarUrl?: string;
  fallback?: ReactNode;
  className: string;
}) {
  const portrait = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(
    () => {
      const element = portrait.current;
      if (!element || reducedMotion) return;

      const angle = gsap.utils.random(0, 360);
      gsap
        .timeline({ repeat: -1, repeatDelay: 5, delay: 1.4 })
        .fromTo(
          element,
          { "--portrait-glint-angle": `${angle}deg` },
          {
            "--portrait-glint-angle": `${angle + 110}deg`,
            duration: 1.8,
            ease: "none",
          },
          0,
        )
        .fromTo(
          element,
          { "--portrait-glint": 0 },
          {
            "--portrait-glint": 0.72,
            duration: 0.65,
            ease: "sine.out",
          },
          0,
        )
        .to(element, { "--portrait-glint": 0, duration: 1.15, ease: "sine.in" }, 0.65);
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  const [failedAvatar, setFailedAvatar] = useState<string>();
  const [failedFallback, setFailedFallback] = useState<string>();
  const avatarAvailable = avatarUrl && avatarUrl !== failedAvatar;
  const source = avatarAvailable
    ? avatarUrl
    : fallbackAvatarUrl !== failedFallback
      ? fallbackAvatarUrl
      : undefined;
  return (
    <span
      ref={portrait}
      className={cn(
        "game-player-avatar relative isolate grid aspect-square shrink-0 place-items-center rounded-full bg-artwork-shadow text-muted-foreground [&_svg]:size-1/2",
        className,
      )}
    >
      <span className="game-player-portrait absolute inset-[4%] grid place-items-center overflow-hidden rounded-full">
        {source ? (
          <img
            src={source}
            className="size-full object-cover"
            alt=""
            referrerPolicy="no-referrer"
            onError={() => (avatarAvailable ? setFailedAvatar(source) : setFailedFallback(source))}
          />
        ) : (
          fallback
        )}
      </span>
    </span>
  );
}
