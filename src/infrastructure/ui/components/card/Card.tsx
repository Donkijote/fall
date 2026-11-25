import { cn } from "cn";
import type { CSSProperties } from "react";

import { SuitGlyph } from "@/components/cards/SuitGlyph";
import { useDeckArtwork } from "@/components/cards/useDeckArtwork";
import { type Rank, type Suit } from "@/domain/entities/Card";

export type CardProps = {
  rank: Rank;
  suit: Suit;
  size?: "sm" | "md" | "lg";
  faceDown?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

const sizeClass = {
  sm: "w-20",
  md: "w-28",
  lg: "w-36",
};

export const Card = ({
  rank,
  suit,
  size,
  faceDown = false,
  selected = false,
  disabled = false,
  onClick,
  className,
  style,
}: CardProps) => {
  const { back } = useDeckArtwork();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md relative isolate aspect-[63/88]",
        "drop-shadow-sm focus-visible:outline-ring focus-visible:outline-2",
        selected && "ring-ring ring-2 ring-offset-2 ring-offset-background",
        className,
        {
          "w-14 lg:w-22": faceDown && !size,
          "w-16 lg:w-24": !faceDown && !size,
          "md:max-lg:w-22 lg:w-24": !size,
          [sizeClass[size as keyof typeof sizeClass]]: Boolean(size),
        },
      )}
      style={style}
      aria-label={faceDown ? "Face-down card" : `${rank} of ${suit}`}
      aria-pressed={selected}
    >
      {faceDown ? (
        <img
          src={back}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-contain"
        />
      ) : (
        <div className="h-full w-full [&_img]:size-full [&_img]:object-contain">
          <SuitGlyph suit={suit} rank={rank} />
        </div>
      )}
    </button>
  );
};
