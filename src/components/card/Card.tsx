import { clsx } from "clsx";

import { SuitGlyph } from "@/components/card/SuitGlyph";
import { type Rank, type Suit, SUIT_COLOR } from "@/domain/entities/Card";

export type CardProps = {
  rank: Rank;
  suit: Suit;
  size?: "sm" | "md" | "lg";
  faceDown?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const sizeClass = {
  sm: "w-20",
  md: "w-28",
  lg: "w-36",
};

export const Card = ({
  rank,
  suit,
  size = "md",
  faceDown = false,
  selected = false,
  disabled = false,
  onClick,
  className,
}: CardProps) => {
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
    >
      {!faceDown ? (
        <div className="inset-0 p-2 absolute flex flex-col justify-between">
          {/* corners */}
          <div className="flex justify-start">
            <Corner rank={rank} suit={suit} size={size} />
          </div>

          {/* center content */}
          <SuitGlyph suit={suit} rank={rank} size={size} />

          {/* corners */}
          <div className="flex justify-end">
            <div className="rotate-180">
              <Corner rank={rank} suit={suit} size={size} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="inset-0 absolute"
          aria-hidden
          style={{
            background:
              "repeating-linear-gradient(135deg, #1f2937 0 6px, #111827 6px 12px)",
          }}
        />
      )}

      {/* subtle vignette */}
      <div className="inset-0 from-black/5 to-white/0 pointer-events-none absolute bg-gradient-to-br" />
    </button>
  );
};

const Corner = ({
  rank,
  suit,
  size,
}: {
  rank: number;
  suit: Suit;
  size: CardProps["size"];
}) => {
  const color = SUIT_COLOR[suit];
  return (
    <div className="flex flex-col items-center text-[10px] leading-none">
      <span
        className={clsx("font-semibold", {
          "text-lg": size === "lg",
          "text-sm": size === "md",
          "text-[10px]": size === "sm",
        })}
        style={{ color }}
      >
        {rank}
      </span>
    </div>
  );
};
