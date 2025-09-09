import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import { ClubGlyph } from "@/components/card/ClubGlyph";
import { CupGlyph } from "@/components/card/CupGlyph";
import { GoldGlyph } from "@/components/card/GoldGlyph";
import { SwordGlyph, SwordGlyphVariant } from "@/components/card/SwordGlyph";
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
    clubs: ({ color }) => <ClubGlyph fill={color} />,
    blades: ({ color }) => <SwordGlyph fill={color} />,
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
    clubs: ({ color, size }) => (
      <div className={"[&_svg]:last:rotate-180"}>
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "top-0 -left-5.5 h-20 w-20": size === "sm",
            "-top-2 -left-8 h-30 w-30": size === "md",
            "-top-2.5 -left-10 h-38 w-38": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "bottom-0 -right-5.5 h-20 w-20": size === "sm",
            "-bottom-2 -right-8 h-30 w-30": size === "md",
            "-bottom-2.5 -right-10 h-38 w-38": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ color, size }) => (
      <div className={"[&_svg]:first:rotate-180"}>
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 -left-5.5 h-20 w-20": size === "sm",
            "-top-3 -left-9 h-32 w-32": size === "md",
            "-top-4 -left-11 h-40 w-40": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1 -right-5.5 h-20 w-20": size === "sm",
            "-bottom-3 -right-9 h-32 w-32": size === "md",
            "-bottom-4 -right-11 h-40 w-40": size === "lg",
          })}
        />
      </div>
    ),
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
    clubs: ({ color, size }) => (
      <div
        className={
          "[&_svg]:first:rotate-180 [&_svg]:nth-2:rotate-32 [&_svg]:nth-3:-rotate-32"
        }
      >
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-2 -left-3.5 h-[92px] w-[92px]": size === "sm",
            "-top-5 -right-5 mt-0.5 h-[136px] w-[136px]": size === "md",
            "-bottom-6 -right-7 mr-1 h-[180px] w-[180px]": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1.5 -left-4 h-[92px] w-[92px]": size === "sm",
            "-top-4 -left-6 h-[136px] w-[136px]": size === "md",
            "-top-6 -left-8 h-[180px] w-[180px]": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["golds"]}
          className={clsx("absolute", {
            "-top-1.5 -right-3.5 h-[92px] w-[92px]": size === "sm",
            "-bottom-5 -right-6 h-[136px] w-[136px]": size === "md",
            "-bottom-7 -right-7 h-[180px] w-[180px]": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ color, size }) => (
      <div className={"[&_svg]:odd:rotate-180"}>
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0 -left-7 h-20 w-20": size === "sm",
            "-top-3 -left-10 h-30 w-30": size === "md",
            "-top-4 -left-14 h-40 w-40": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1 -right-1.5 h-20 w-20": size === "sm",
            "-bottom-2 -right-2.5 h-30 w-30": size === "md",
            "-bottom-4 -right-3.5 h-40 w-40": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1 -right-7 h-20 w-20": size === "sm",
            "-bottom-2 -right-11 h-30 w-30": size === "md",
            "-bottom-4 -right-15 h-40 w-40": size === "lg",
          })}
        />
      </div>
    ),
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
    clubs: ({ color, size }) => (
      <div
        className={
          "[&_svg]:first:-rotate-38 [&_svg]:nth-2:rotate-38 [&_svg]:nth-3:-rotate-142 [&_svg]:nth-4:rotate-142"
        }
      >
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0.5 -left-0 h-9 w-9": size === "sm",
            "-top-2 -left-0 h-14 w-14": size === "md",
            "-top-3 -left-1 h-20 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-0.5 -right-0 h-9 w-9": size === "sm",
            "-top-2 -right-0 h-14 w-14": size === "md",
            "-top-3 -right-1 h-20 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-bottom-0.5 -left-0 h-9 w-9": size === "sm",
            "-bottom-2 -left-0 h-14 w-14": size === "md",
            "-bottom-3 -left-1 h-20 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0.5 -right-0 h-9 w-9": size === "sm",
            "-bottom-2 -right-0 h-14 w-14": size === "md",
            "-bottom-3 -right-1 h-20 w-20": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ size }) => (
      <>
        <div
          className={clsx({
            "[&_svg]:rotate-150": size === "sm",
            "[&_svg]:rotate-146": size === "md",
            "[&_svg]:rotate-148": size === "lg",
          })}
        >
          <SwordGlyphVariant
            className={clsx("absolute", {
              "-top-2 -left-0 h-10 w-10": size === "sm",
              "-top-4 left-0.5 h-14 w-14": size === "md",
              "-top-5 -left-0 h-20 w-20": size === "lg",
            })}
          />
        </div>
        <div
          className={clsx({
            "[&_svg]:-rotate-154": size === "sm",
            "[&_svg]:-rotate-151": size === "md",
            "[&_svg]:-rotate-152": size === "lg",
          })}
        >
          <SwordGlyphVariant
            className={clsx("absolute", {
              "-top-1.5 -right-1 h-10 w-10": size === "sm",
              "-top-3.5 -right-1 h-14 w-14": size === "md",
              "-top-4 -right-1 h-20 w-20": size === "lg",
            })}
          />
        </div>
        <div
          className={clsx({
            "[&_svg]:rotate-32": size === "sm",
            "[&_svg]:rotate-29": size === "md",
            "[&_svg]:rotate-30": size === "lg",
          })}
        >
          <SwordGlyphVariant
            className={clsx("absolute", {
              "-bottom-1.5 -left-1 h-10 w-10": size === "sm",
              "-bottom-3 -left-0 h-14 w-14": size === "md",
              "-bottom-5 -left-1 h-20 w-20": size === "lg",
            })}
          />
        </div>
        <div
          className={clsx({
            "[&_svg]:-rotate-32": size === "sm" || size === "md",
            "[&_svg]:-rotate-34": size === "lg",
          })}
        >
          <SwordGlyphVariant
            className={clsx("absolute", {
              "-bottom-2 right-0 h-10 w-10": size === "sm",
              "-bottom-3.5 -right-0 h-14 w-14": size === "md",
              "-bottom-6 right-0 h-20 w-20": size === "lg",
            })}
          />
        </div>
      </>
    ),
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
    clubs: ({ color, size }) => (
      <div
        className={
          "[&_svg]:first:-rotate-150 [&_svg]:nth-2:rotate-150 [&_svg]:nth-3:-rotate-27 [&_svg]:nth-4:rotate-27 [&_svg]:nth-5:rotate-90"
        }
      >
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-2 -left-0.5 h-10 w-10": size === "sm",
            "-top-5 -left-2 h-16 w-16": size === "md",
            "-top-7 -left-3 h-22 w-22": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-2 -right-0.5 h-10 w-10": size === "sm",
            "-top-5 -right-2 h-16 w-16": size === "md",
            "-top-7 -right-3 h-22 w-22": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-bottom-2 -left-0.5 h-10 w-10": size === "sm",
            "-bottom-5 -left-2 h-16 w-16": size === "md",
            "-bottom-7 -left-3 h-22 w-22": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-2 -right-0.5 h-10 w-10": size === "sm",
            "-bottom-5 -right-2 h-16 w-16": size === "md",
            "-bottom-7 -right-3 h-22 w-22": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["golds"]}
          className={clsx("absolute", {
            "top-4.5 left-2.5 h-10 w-10": size === "sm",
            "top-4.5 left-4 h-16 w-16": size === "md",
            "top-5 left-4 h-22 w-22": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ size }) => (
      <div
        className={
          "[&_svg]:first:rotate-180 [&_svg]:nth-2:rotate-180 [&_svg]:nth-3:-rotate-90"
        }
      >
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -left-1 h-10 w-10": size === "sm",
            "-top-3 -left-2 w-14 h-14": size === "md",
            "-top-5 -left-3 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -right-2 h-10 w-10": size === "sm",
            "-top-3 -right-3 w-14 h-14": size === "md",
            "-top-5 -right-4.5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "top-5 left-3 h-10 w-10": size === "sm",
            "top-6.5 left-4.5 w-14 h-14": size === "md",
            "top-7.5 left-6 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -left-2 h-10 w-10": size === "sm",
            "-bottom-3 -left-3.5 w-14 h-14": size === "md",
            "-bottom-5 -left-5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -right-1 h-10 w-10": size === "sm",
            "-bottom-3 -right-1.5 w-14 h-14": size === "md",
            "-bottom-5 -right-2.5 h-20 w-20": size === "lg",
          })}
        />
      </div>
    ),
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
    clubs: ({ color, size }) => (
      <div className={"[&_svg]:even:rotate-180"}>
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0 -left-2 h-8 w-9": size === "sm",
            "-top-2 -left-3 w-14 h-[54px]": size === "md",
            "-top-3 -left-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-0 left-3.5 h-8 w-9": size === "sm",
            "-top-2 left-5 w-14 h-[54px]": size === "md",
            "-top-3 left-6 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-0 -right-2 h-8 w-9": size === "sm",
            "-top-2 -right-3 w-14 h-[54px]": size === "md",
            "-top-3 -right-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-bottom-0 -left-2 h-8 w-9": size === "sm",
            "-bottom-2 -left-3 w-14 h-[54px]": size === "md",
            "-bottom-3 -left-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-0 left-3.5 h-8 w-9": size === "sm",
            "-bottom-2 left-5 w-14 h-[54px]": size === "md",
            "-bottom-3 left-6 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-bottom-0 -right-2 h-8 w-9": size === "sm",
            "-bottom-2 -right-3 w-14 h-[54px]": size === "md",
            "-bottom-3 -right-4 h-18 w-20": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ size }) => (
      <div className={"[&_svg]:nth-[-n+3]:rotate-180"}>
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -left-1 h-10 w-10": size === "sm",
            "-top-4 -left-2 w-14 h-14": size === "md",
            "-top-6 -left-3 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 left-3.5 h-10 w-10": size === "sm",
            "-top-4 left-6 w-14 h-14": size === "md",
            "-top-6 left-7.5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -right-2 h-10 w-10": size === "sm",
            "-top-4 -right-3.5 w-14 h-14": size === "md",
            "-top-6 -right-5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -left-2 h-10 w-10": size === "sm",
            "-bottom-4 -left-3.5 w-14 h-14": size === "md",
            "-bottom-6 -left-5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 left-2.5 h-10 w-10": size === "sm",
            "-bottom-4 left-4.5 w-14 h-14": size === "md",
            "-bottom-6 left-5.5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -right-1 h-10 w-10": size === "sm",
            "-bottom-4 -right-2 w-14 h-14": size === "md",
            "-bottom-6 -right-3 h-20 w-20": size === "lg",
          })}
        />
      </div>
    ),
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
    clubs: ({ color, size }) => (
      <div
        className={
          "[&_svg]:nth-2:rotate-180 [&_svg]:nth-4:rotate-90 [&_svg]:nth-5:rotate-180 [&_svg]:nth-7:rotate-180"
        }
      >
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-1 -left-2 h-9 w-9": size === "sm",
            "-top-3 -left-3 w-14 h-[54px]": size === "md",
            "-top-4 -left-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1 left-3.5 h-9 w-9": size === "sm",
            "-top-3 left-5 w-14 h-[54px]": size === "md",
            "-top-4 left-6 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-top-1 -right-2 h-9 w-9": size === "sm",
            "-top-3 -right-3 w-14 h-[54px]": size === "md",
            "-top-4 -right-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["golds"]}
          className={clsx("absolute", {
            "top-5 left-3 h-9 w-9": size === "sm",
            "top-6 left-5 w-14 h-[54px]": size === "md",
            "top-7 left-5 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1 -left-2 h-9 w-9": size === "sm",
            "-bottom-3 -left-3 w-14 h-[54px]": size === "md",
            "-bottom-4 -left-4 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={SUIT_COLOR["cups"]}
          className={clsx("absolute", {
            "-bottom-1 left-3.5 h-9 w-9": size === "sm",
            "-bottom-3 left-5 w-14 h-[54px]": size === "md",
            "-bottom-4 left-6 h-18 w-20": size === "lg",
          })}
        />
        <ClubGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1 -right-2 h-9 w-9": size === "sm",
            "-bottom-3 -right-3 w-14 h-[54px]": size === "md",
            "-bottom-4 -right-4 h-18 w-20": size === "lg",
          })}
        />
      </div>
    ),
    blades: ({ size }) => (
      <div className={"[&_svg]:nth-4:-rotate-90 [&_svg]:nth-[-n+3]:rotate-180"}>
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -left-1 h-10 w-10": size === "sm",
            "-top-4 -left-2 w-14 h-14": size === "md",
            "-top-6 -left-3 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 left-3.5 h-10 w-10": size === "sm",
            "-top-4 left-6 w-14 h-14": size === "md",
            "-top-6 left-7.5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-top-2 -right-2 h-10 w-10": size === "sm",
            "-top-4 -right-3.5 w-14 h-14": size === "md",
            "-top-6 -right-5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "top-5 left-3 h-10 w-10": size === "sm",
            "top-6 left-5 w-14 h-14": size === "md",
            "top-7 left-6 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -left-2 h-10 w-10": size === "sm",
            "-bottom-4 -left-3.5 w-14 h-14": size === "md",
            "-bottom-6 -left-5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 left-2.5 h-10 w-10": size === "sm",
            "-bottom-4 left-4.5 w-14 h-14": size === "md",
            "-bottom-6 left-5.5 h-20 w-20": size === "lg",
          })}
        />
        <SwordGlyphVariant
          className={clsx("absolute", {
            "-bottom-2 -right-1 h-10 w-10": size === "sm",
            "-bottom-4 -right-2 w-14 h-14": size === "md",
            "-bottom-6 -right-3 h-20 w-20": size === "lg",
          })}
        />
      </div>
    ),
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
