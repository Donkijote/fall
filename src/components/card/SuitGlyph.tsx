import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { CupGlyph } from "@/components/card/CupGlyph";
import { GoldGlyph } from "@/components/card/GoldGlyph";
import { type Suit, SUIT_COLOR } from "@/domain/entities/Card";

type SuitGlyphProps = {
  suit: Suit;
  rank: number;
  size: "sm" | "md" | "lg";
  className?: string;
};

const LAYOUT: Record<
  number,
  Record<Suit, FC<PropsWithChildren<{ color: string; size: string }>>>
> = {
  1: {
    golds: ({ color }) => (
      <div
        className={"flex h-full w-full flex-row items-center justify-center"}
      >
        <GoldGlyph fill={color} />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color }) => (
      <div
        className={"flex h-full w-full flex-row items-center justify-center"}
      >
        <CupGlyph fill={color} />
      </div>
    ),
  },
  2: {
    golds: ({ color, size }) => (
      <div
        className={
          "relative flex h-full w-full flex-col items-center justify-center"
        }
      >
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 -left-1 h-[52px] w-[52px]": size === "sm",
            "-top-3 -left-1 h-[70px] w-[70px]": size === "md",
            "h-24 w-24 -top-6 -left-1": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 -right-1 h-[52px] w-[52px]": size === "sm",
            "-bottom-3 -right-1 h-[70px] w-[70px]": size === "md",
            "h-24 w-24 -bottom-6 -right-1": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
  3: {
    golds: ({ color, size }) => (
      <div
        className={
          "relative flex h-full w-full flex-col items-center justify-center"
        }
      >
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 -left-1 h-[42px] w-[42px]": size === "sm",
            "-top-3 -left-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 -top-5 -left-1": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 -right-1 h-[42px] w-[42px]": size === "sm",
            "bottom-4 -right-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 bottom-6 -right-1": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 -left-1 h-[42px] w-[42px]": size === "sm",
            "-bottom-5 -left-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 -bottom-6 -left-1": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
  4: {
    golds: ({ color, size }) => (
      <div className={"relative flex h-full w-full"}>
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0 -left-1 h-[38px] w-[38px]": size === "sm",
            "-top-2 -left-1 h-14 w-14": size === "md",
            "-top-2 -left-1 h-18 w-18": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0 -right-1 h-[38px] w-[38px]": size === "sm",
            "-top-2 -right-1 h-14 w-14": size === "md",
            "-top-2 -right-1 h-18 w-18": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0 -left-1 h-[38px] w-[38px]": size === "sm",
            "-bottom-2 -left-1 h-14 w-14": size === "md",
            "-bottom-2 -left-1 h-18 w-18": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0 -right-1 h-[38px] w-[38px]": size === "sm",
            "-bottom-2 -right-1 h-14 w-14": size === "md",
            "-bottom-2 -right-1 h-18 w-18": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
  5: {
    golds: ({ color, size }) => (
      <div className={"relative flex h-full w-full"}>
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-3 left-1 h-10 w-10": size === "md",
            "-top-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-3 right-1 h-10 w-10": size === "md",
            "-top-4 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 mb-0.5 left-3 h-10 w-10": size === "sm",
            "bottom-4 left-4 mb-0.5 h-16 w-16": size === "md",
            "bottom-6 left-6 h-20 w-20": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-3 left-1 h-10 w-10": size === "md",
            "-bottom-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-3 right-1 h-10 w-10": size === "md",
            "-bottom-4 right-1 h-14 w-14": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
  6: {
    golds: ({ color, size }) => (
      <div className={"relative flex h-full w-full"}>
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-3 left-1 h-10 w-10": size === "md",
            "-top-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-3 right-1 h-10 w-10": size === "md",
            "-top-4 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-6 left-1 h-7 w-7": size === "sm",
            "bottom-7 left-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-6 right-1 h-7 w-7": size === "sm",
            "bottom-7 right-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-3 left-1 h-10 w-10": size === "md",
            "-bottom-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-3 right-1 h-10 w-10": size === "md",
            "-bottom-4 right-1 h-14 w-14": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
  7: {
    golds: ({ color, size }) => (
      <div className={"relative flex h-full w-full"}>
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-3 left-1 h-10 w-10": size === "md",
            "-top-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-3 right-1 h-10 w-10": size === "md",
            "-top-4 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "top-3 left-4 ml-0.5 h-7 w-7": size === "sm",
            "top-3 left-7 h-10 w-10 mt-0.5": size === "md",
            "-top-4 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 left-1 h-7 w-7": size === "sm",
            "bottom-4 left-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 right-1 h-7 w-7": size === "sm",
            "bottom-4 right-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-4 left-1 h-10 w-10": size === "md",
            "-bottom-4 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-4 right-1 h-10 w-10": size === "md",
            "-bottom-4 right-1 h-14 w-14": size === "lg",
          })}
        />
      </div>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ children }) => <div>{children}</div>,
  },
};

export const SuitGlyph = ({ suit, rank, size }: SuitGlyphProps) => {
  const color = SUIT_COLOR[suit];
  const Layout = LAYOUT[rank][suit];
  return <Layout color={color} size={size} />;
};
