import { useState } from "react";

import { PlayerPortrait } from "./PlayerPortrait";

export function ProfileButton({
  avatarUrl,
  fallbackAvatarUrl,
  onClick,
}: {
  avatarUrl?: string;
  fallbackAvatarUrl?: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <button
      type="button"
      aria-label="Player profile"
      onClick={onClick}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className="w-fit shrink-0 cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring"
    >
      <PlayerPortrait
        avatarUrl={avatarUrl}
        fallbackAvatarUrl={fallbackAvatarUrl}
        attention={hovered || focused}
        className="w-[var(--player-portrait-width,3rem)]"
      />
    </button>
  );
}
