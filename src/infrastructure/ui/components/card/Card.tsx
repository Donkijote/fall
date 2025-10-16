import { clsx } from "clsx";
import type { CSSProperties } from "react";

import { type Rank, type Suit } from "@/domain/entities/Card";
import { SuitGlyph } from "@/infrastructure/ui/components/card/SuitGlyph";

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
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-xl relative isolate aspect-[63/88]",
        "bg-zinc-50 ring-zinc-200 shadow-sm ring-1",
        "transition-transform duration-150 will-change-transform",
        !disabled && "hover:-translate-y-0.5 active:translate-y-0",
        selected && "ring-amber-400 ring-2 ring-offset-2",
        "overflow-hidden",
        className,
        {
          "w-16 landscape:w-14 landscape:lg:w-22": faceDown && !size,
          "w-18 landscape:w-16 landscape:lg:w-24": !faceDown && !size,
          "md:max-lg:w-22 lg:w-24": !size,
          [sizeClass[size as keyof typeof sizeClass]]: Boolean(size),
        },
      )}
      style={style}
    >
      {faceDown ? (
        <div
          className="inset-0 absolute"
          aria-hidden
          style={{
            background:
              "repeating-linear-gradient(135deg, #1f2937 0 6px, #111827 6px 12px)",
          }}
        />
      ) : (
        <div className="p-2 landscape:p-1.5 landscape:lg:p-2 h-full w-full [&_img]:h-full">
          <SuitGlyph suit={suit} rank={rank} />
        </div>
      )}

      {/* subtle vignette */}
      <div className="inset-0 from-black/5 to-white/0 pointer-events-none absolute bg-gradient-to-br" />
    </button>
  );
};
