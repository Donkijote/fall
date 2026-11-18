import { cn } from "cn";
import { UserRound } from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { usePortraitTurnMotion } from "./usePortraitTurnMotion";
import "./PlayerPortrait.css";

export function PlayerPortrait({
  avatarUrl,
  fallbackAvatarUrl,
  fallback = <UserRound aria-hidden="true" />,
  className,
  highlighted = false,
  attention = false,
}: {
  avatarUrl?: string;
  fallbackAvatarUrl?: string;
  fallback?: ReactNode;
  className: string;
  highlighted?: boolean;
  attention?: boolean;
}) {
  const portrait = useRef<HTMLSpanElement>(null);
  usePortraitTurnMotion(portrait, highlighted, !highlighted && attention);

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
      data-highlighted={highlighted || undefined}
      className={cn(
        "game-player-avatar relative isolate grid aspect-square shrink-0 place-items-center rounded-full bg-artwork-shadow text-muted-foreground [&_svg]:size-1/2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="game-player-turn-ring pointer-events-none absolute inset-0 z-1"
      />
      <span className="game-player-portrait absolute inset-[4%] grid place-items-center overflow-hidden rounded-full">
        {source ? (
          <img
            src={source}
            draggable={false}
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
