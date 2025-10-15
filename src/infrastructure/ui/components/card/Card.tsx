import { clsx } from "clsx";
import type { CSSProperties } from "react";

import { type Rank, type Suit } from "@/domain/entities/Card";
import { SuitGlyph } from "@/infrastructure/ui/components/card/SuitGlyph";
import { useBreakpoint } from "@/infrastructure/ui/hooks/useBreakpoint";

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
  size: cardSize,
  faceDown = false,
  selected = false,
  disabled = false,
  onClick,
  className,
  style,
}: CardProps) => {
  const { breakpoint, isMobile, orientation } = useBreakpoint();
  let size: "sm" | "md" | "lg" = cardSize ?? "sm";

  if (
    breakpoint &&
    !isMobile &&
    !cardSize &&
    (breakpoint === "md" || breakpoint === "lg")
  ) {
    if (orientation === "portrait") {
      size = "md";
    } else if (orientation === "landscape") {
      size = "sm";
    }
  }

  if (
    breakpoint &&
    !isMobile &&
    !cardSize &&
    (breakpoint === "2xl" || breakpoint === "3xl")
  ) {
    size = "lg";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-xl relative isolate aspect-[63/88]",
        sizeClass[size],
        "bg-zinc-50 ring-zinc-200 shadow-sm ring-1",
        "transition-transform duration-150 will-change-transform",
        !disabled && "hover:-translate-y-0.5 active:translate-y-0",
        selected && "ring-amber-400 ring-2 ring-offset-2",
        "overflow-hidden",
        className,
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
        <div className="p-2 h-full w-full [&_img]:h-full">
          <SuitGlyph suit={suit} rank={rank} />
        </div>
      )}

      {/* subtle vignette */}
      <div className="inset-0 from-black/5 to-white/0 pointer-events-none absolute bg-gradient-to-br" />
    </button>
  );
};
