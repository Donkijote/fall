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
    golds: ({ color }) => <GoldGlyph fill={color} />,
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color }) => <CupGlyph fill={color} />,
  },
  2: {
    golds: ({ color, size }) => (
      <>
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
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-3 left-2 ml-0.5 mt-0.5 h-[44px] w-[44px]": size === "sm",
            "-top-5 left-3 ml-0.5 mt-0.5 h-[64px] w-[64px]": size === "md",
            "-top-6 left-5 h-[86px] w-[86px]": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-3 left-2 ml-0.5 mb-0.5 h-[44px] w-[44px]": size === "sm",
            "-bottom-5 left-3 ml-0.5 mb-0.5 h-[64px] w-[64px]": size === "md",
            "-bottom-6 left-5 h-[86px] w-[86px]": size === "lg",
          })}
        />
      </>
    ),
  },
  3: {
    golds: ({ color, size }) => (
      <>
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
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 -left-1 h-[42px] w-[42px]": size === "sm",
            "-top-3 -left-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 -top-5 -left-1": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 -right-1 h-[42px] w-[42px]": size === "sm",
            "bottom-4 -right-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 bottom-6 -right-1": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 -left-1 h-[42px] w-[42px]": size === "sm",
            "-bottom-5 -left-1 h-[62px] w-[62px]": size === "md",
            "h-20 w-20 -bottom-6 -left-1": size === "lg",
          })}
        />
      </>
    ),
  },
  4: {
    golds: ({ color, size }) => (
      <>
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
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 -left-1 h-[38px] w-[38px]": size === "sm",
            "-top-3 -left-1 h-14 w-14": size === "md",
            "-top-3 -left-1 h-18 w-18": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 -right-1 h-[38px] w-[38px]": size === "sm",
            "-top-3 -right-1 h-14 w-14": size === "md",
            "-top-3 -right-1 h-18 w-18": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0 -left-1 h-[38px] w-[38px]": size === "sm",
            "-bottom-2 -left-1 h-14 w-14": size === "md",
            "-bottom-2 -left-1 h-18 w-18": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0 -right-1 h-[38px] w-[38px]": size === "sm",
            "-bottom-2 -right-1 h-14 w-14": size === "md",
            "-bottom-2 -right-1 h-18 w-18": size === "lg",
          })}
        />
      </>
    ),
  },
  5: {
    golds: ({ color, size }) => (
      <>
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
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 -left-0 h-8 w-8": size === "sm",
            "-top-4 left-0 h-12 w-12": size === "md",
            "-top-6 left-0 h-16 w-16": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 -right-0 h-8 w-8": size === "sm",
            "-top-4 right-0 h-12 w-12": size === "md",
            "-top-6 right-0 h-16 w-16": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-5 left-4 h-8 w-8": size === "sm",
            "bottom-6 left-6 h-12 w-12": size === "md",
            "bottom-8 left-8 h-16 w-16": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-0 h-8 w-8": size === "sm",
            "-bottom-4 left-0 h-12 w-12": size === "md",
            "-bottom-6 left-0 h-16 w-16": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-0 h-8 w-8": size === "sm",
            "-bottom-4 right-0 h-12 w-12": size === "md",
            "-bottom-6 right-0 h-16 w-16": size === "lg",
          })}
        />
      </>
    ),
  },
  6: {
    golds: ({ color, size }) => (
      <>
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
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-4 left-1 h-10 w-10": size === "md",
            "-top-6 left-1 h-14 w-14 mt-0.5": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-4 right-1 h-10 w-10": size === "md",
            "-top-6 right-1 h-14 w-14 mt-0.5": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-6 left-1 h-7 w-7": size === "sm",
            "bottom-7 left-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 left-1 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-6 right-1 h-7 w-7": size === "sm",
            "bottom-7 right-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-9 right-1 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-4 left-1 h-10 w-10": size === "md",
            "-bottom-6 left-1 h-14 w-14 mb-0.5": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-4 right-1 h-10 w-10": size === "md",
            "-bottom-6 right-1 h-14 w-14 mb-0.5": size === "lg",
          })}
        />
      </>
    ),
  },
  7: {
    golds: ({ color, size }) => (
      <>
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-3 left-1 h-10 w-10": size === "md",
            "-top-6 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-3 right-1 h-10 w-10": size === "md",
            "-top-6 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "top-3 left-4 ml-0.5 h-7 w-7": size === "sm",
            "top-3 left-7 h-10 w-10 mt-0.5": size === "md",
            "top-3 left-9 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 left-1 h-7 w-7": size === "sm",
            "bottom-4 left-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-6 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-4 right-1 h-7 w-7": size === "sm",
            "bottom-4 right-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-6 right-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-4 left-1 h-10 w-10": size === "md",
            "-bottom-6 left-1 h-14 w-14": size === "lg",
          })}
        />
        <GoldGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-4 right-1 h-10 w-10": size === "md",
            "-bottom-6 right-1 h-14 w-14": size === "lg",
          })}
        />
      </>
    ),
    clubs: ({ children }) => <div>{children}</div>,
    blades: ({ children }) => <div>{children}</div>,
    cups: ({ color, size }) => (
      <>
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 left-1 h-7 w-7": size === "sm",
            "-top-4 left-1 h-10 w-10": size === "md",
            "-top-6 left-1 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 right-1 h-7 w-7": size === "sm",
            "-top-4 right-1 h-10 w-10": size === "md",
            "-top-6 right-1 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "top-2 left-4 ml-0.5 h-7 w-7": size === "sm",
            "top-2 left-7 h-10 w-10 mt-0.5": size === "md",
            "top-3 left-9 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-5 left-1 h-7 w-7": size === "sm",
            "bottom-6 left-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-8 left-1 h-14 w-14 mb-0.5": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "bottom-5 right-1 h-7 w-7": size === "sm",
            "bottom-6 right-1 h-10 w-10 mb-0.5": size === "md",
            "bottom-8 right-1 h-14 w-14 mb-0.5": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 left-1 h-7 w-7": size === "sm",
            "-bottom-4 left-1 h-10 w-10": size === "md",
            "-bottom-6 left-1 h-14 w-14": size === "lg",
          })}
        />
        <CupGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 right-1 h-7 w-7": size === "sm",
            "-bottom-4 right-1 h-10 w-10": size === "md",
            "-bottom-6 right-1 h-14 w-14": size === "lg",
          })}
        />
      </>
    ),
  },
};

export const SuitGlyph = ({ suit, rank, size }: SuitGlyphProps) => {
  const color = SUIT_COLOR[suit];
  const Layout = LAYOUT[rank][suit];
  return (
    <div
      className={
        "relative flex h-full w-full flex-col items-center justify-center"
      }
    >
      <Layout color={color} size={size} />{" "}
    </div>
  );
};
