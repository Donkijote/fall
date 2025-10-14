import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

import AceOfCoins from "@/assets/cards/coins/AceOfCoins.svg";
import ElevenOfCoins from "@/assets/cards/coins/ElevenOfCoins.svg";
import FiveOfCoins from "@/assets/cards/coins/FiveOfCoins.svg";
import FourOfCoins from "@/assets/cards/coins/FourOfCoins.svg";
import SevenOfCoins from "@/assets/cards/coins/SevenOfCoins.svg";
import SixOfCoins from "@/assets/cards/coins/SixOfCoins.svg";
import TenOfCoins from "@/assets/cards/coins/TenOfCoins.svg";
import ThreeOfCoins from "@/assets/cards/coins/ThreeOfCoins.svg";
import TwelveOfCoins from "@/assets/cards/coins/TwelveOfCoins.svg";
import TwoOfCoins from "@/assets/cards/coins/TwoOfCoins.svg";
import AceOfCups from "@/assets/cards/cups/AceOfCups.svg";
import ElevenOfCups from "@/assets/cards/cups/ElevenOfCups.svg";
import FiveOfCups from "@/assets/cards/cups/FiveOfCups.svg";
import FourOfCups from "@/assets/cards/cups/FourOfCups.svg";
import SevenOfCups from "@/assets/cards/cups/SevenOfCups.svg";
import SixOfCups from "@/assets/cards/cups/SixOfCups.svg";
import TenOfCups from "@/assets/cards/cups/TenOfCups.svg";
import ThreeOfCups from "@/assets/cards/cups/ThreeOfCups.svg";
import TwelveOfCups from "@/assets/cards/cups/TwelveOfCups.svg";
import TwoOfCups from "@/assets/cards/cups/TwoOfCups.svg";
import { type Suit, SUIT_COLOR } from "@/domain/entities/Card";
import {
  AceOfClubsGlyph,
  ElevenOfClubs,
  GreenClubGlyph,
  RedClubGlyph,
  TenOfClubs,
  ThreeOfClubsGlyph,
  TwelveOfClubs,
  TwoOfClubsGlyph,
  YellowClubGlyph,
} from "@/infrastructure/ui/components/card/ClubGlyph";
import {
  AceOfSwordGlyph,
  ElevenOfSwordGlyph,
  SwordGlyph,
  SwordGlyphVariant,
  TenOfSwordGlyph,
  TwelveOfSwordGlyph,
} from "@/infrastructure/ui/components/card/SwordGlyph";

type SuitGlyphProps = {
  suit: Suit;
  rank: number;
  size: "sm" | "md" | "lg";
};

const LAYOUT: Record<
  number,
  Record<Suit, FC<PropsWithChildren<{ color: string; size: string }>>>
> = {
  1: {
    golds: () => <img src={AceOfCoins} alt={"AceOfCoins"} />,
    clubs: ({ size }) => (
      <AceOfClubsGlyph
        className={clsx("absolute", {
          "-top-1 h-22 -rotate-5": size === "sm",
          "-top-2 -left-4 h-31 -rotate-6": size === "md",
          "-top-4 -left-5 h-42 -rotate-8": size === "lg",
        })}
      />
    ),
    blades: ({ size }) => (
      <AceOfSwordGlyph
        className={clsx("absolute", {
          "-top-1 -left-2.5 h-23": size === "sm",
          "-top-2 -left-4 h-33": size === "md",
          "-top-4 -left-5 h-44": size === "lg",
        })}
      />
    ),
    cups: () => <img src={AceOfCups} alt={"AceOfCups"} />,
  },
  2: {
    golds: () => <img src={TwoOfCoins} alt={"TwoOfCoins"} />,
    clubs: ({ color, size }) => (
      <TwoOfClubsGlyph
        fill={color}
        className={clsx("absolute", {
          "-top-1 -left-3 h-21": size === "sm",
          "-top-2 -left-4 h-30": size === "md",
          "-top-4 -left-5 h-40": size === "lg",
        })}
      />
    ),
    blades: ({ color, size }) => (
      <div className={"[&_svg]:last:rotate-180"}>
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1.5 left-2 h-22": size === "sm",
            "-top-3.5 left-2.5 h-32": size === "md",
            "-top-4.5 left-2.5 h-42": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-bottom-1.5 right-1.5 h-22": size === "sm",
            "-bottom-3.5 right-2.5 h-32": size === "md",
            "-bottom-4.5 right-2.5 h-42": size === "lg",
          })}
        />
      </div>
    ),
    cups: () => <img src={TwoOfCups} alt={"TwoOfCups"} />,
  },
  3: {
    golds: () => <img src={ThreeOfCoins} alt={"ThreeOfCoins"} />,
    clubs: ({ color, size }) => (
      <ThreeOfClubsGlyph
        fill={color}
        className={clsx("absolute", {
          "-top-1.5 -left-2.5 h-24": size === "sm",
          "-top-3 -left-1.5 h-32": size === "md",
          "-top-4 -left-2 h-42": size === "lg",
        })}
      />
    ),
    blades: ({ color, size }) => (
      <>
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1.5 left-1 h-22": size === "sm",
            "-top-3 left-1.5 h-32": size === "md",
            "-top-4 left-1.5 h-42": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute rotate-180", {
            "-top-1.5 -left-11 h-22": size === "sm",
            "-top-3 -left-16 h-32": size === "md",
            "-top-4 -left-21 h-42": size === "lg",
          })}
        />
        <SwordGlyph
          fill={color}
          className={clsx("absolute", {
            "-top-1.5 left-10 h-22": size === "sm",
            "-top-3 left-15.5 h-32": size === "md",
            "-top-4 left-21 h-42": size === "lg",
          })}
        />
      </>
    ),
    cups: () => <img src={ThreeOfCups} alt={"ThreeOfCups"} />,
  },
  4: {
    golds: () => <img src={FourOfCoins} alt={"FourOfCoins"} />,
    clubs: ({ size }) => (
      <>
        <GreenClubGlyph
          className={clsx("absolute -rotate-6", {
            "-top-0.5 -right-3 h-20": size === "sm",
            "-top-2 -right-3 h-28": size === "md",
            "-top-2 -right-2 h-40": size === "lg",
          })}
          translate={clsx({
            "translate(40,0)": size !== "lg",
            "translate(50,0)": size === "lg",
          })}
          scale={"scale(-0.170000,0.170000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-6", {
            "-top-0.5 -right-1.5 h-20": size === "sm",
            "-top-2 -right-1 h-28": size === "md",
            "-top-2 -right-3 h-40": size === "lg",
          })}
          translate={"translate(80,0)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-6", {
            "-bottom-1 -right-0.5 h-20": size === "sm",
            "-bottom-2 -right-1 h-28": size === "md",
            "-bottom-3 -right-1 h-40": size === "lg",
          })}
          translate={clsx({
            "translate(30,100)": size !== "md",
            "translate(25,100)": size === "md",
          })}
          scale={"scale(0.180000,-0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute -rotate-6", {
            "-bottom-1 -right-0.5 h-20": size === "sm",
            "-bottom-2 -right-3.5 h-28": size === "md",
            "-bottom-3 -right-5 h-40": size === "lg",
          })}
          translate={clsx({
            "translate(60,100)": size === "sm",
            "translate(50,100)": size === "md",
            "translate(51,100)": size === "lg",
          })}
          scale={"scale(0.170000,-0.170000)"}
        />
      </>
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
    cups: () => <img src={FourOfCups} alt={"FourOfCups"} />,
  },
  5: {
    golds: () => <img src={FiveOfCoins} alt={"FiveOfCoins"} />,
    clubs: ({ size }) => (
      <>
        <GreenClubGlyph
          className={clsx("absolute rotate-60", {
            "top-0.5 right-2 h-20": size === "sm",
            "top-0.5 right-3 h-28": size === "md",
            "top-0.5 right-4 h-40": size === "lg",
          })}
          translate={"translate(0,50)"}
          scale={"scale(0.170000,-0.170000)"}
        />
        <RedClubGlyph
          className={clsx("absolute -rotate-60", {
            "-top-2 -right-2 h-20": size === "sm",
            "-top-3 -right-3 h-28": size === "md",
            "-top-4.5 -right-4 h-40": size === "lg",
          })}
          translate={"translate(70,70)"}
          scale={"scale(0.180000,-0.180000)"}
        />
        <YellowClubGlyph
          className={clsx("absolute rotate-90", {
            "-top-2 left-2 h-20": size === "sm",
            "-top-4 left-4 h-28": size === "md",
            "-top-7.5 left-3 h-40": size === "lg",
          })}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-120", {
            "-bottom-2 -right-1.5 h-20": size === "sm",
            "-bottom-3 -right-1.5 h-28": size === "md",
            "-bottom-4.5 -right-2.5 h-40": size === "lg",
          })}
          translate={"translate(70,70)"}
          scale={"scale(0.180000,-0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute rotate-60", {
            "-bottom-4.5 right-3 h-20": size === "sm",
            "-bottom-7 right-4.5 h-28": size === "md",
            "-bottom-10 right-7 h-40": size === "lg",
          })}
          translate={"translate(100,0)"}
          scale={"scale(-0.170000,0.170000)"}
        />
      </>
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
    cups: () => <img src={FiveOfCups} alt={"FiveOfCups"} />,
  },
  6: {
    golds: () => <img src={SixOfCoins} alt={"SixOfCoins"} />,
    clubs: ({ size }) => (
      <>
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "top-0 -left-3.5 h-20": size === "sm",
            "-top-1.5 right-0.5 h-28": size === "md",
            "-top-1.5 -right-0.5 h-40": size === "lg",
          })}
          translate={"translate(30,10)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-top-0.5 right-0.5 h-20": size === "sm",
            "-top-2.5 right-1 h-28": size === "md",
            "-top-2.5 right-1 h-40": size === "lg",
          })}
          translate={"translate(40,50)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "top-0 left-7 h-20": size === "sm",
            "-top-1.5 left-11 h-28": size === "md",
            "-top-1.5 left-13.5 h-40": size === "lg",
          })}
          translate={"translate(30,10)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-bottom-4.5 right-0 h-20": size === "sm",
            "-bottom-7 right-1 h-28": size === "md",
            "-bottom-10 right-0 h-40": size === "lg",
          })}
          translate={"translate(85,25)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "-bottom-3 left-1.5 h-20": size === "sm",
            "-bottom-5 left-3.5 h-28": size === "md",
            "-bottom-7 left-3.5 h-40": size === "lg",
          })}
          translate={"translate(55,55)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-bottom-4.5 left-6.5 h-20": size === "sm",
            "-bottom-7 left-11 h-28": size === "md",
            "-bottom-10 left-13.5 h-40": size === "lg",
          })}
          translate={"translate(85,25)"}
          scale={"scale(-0.180000,0.180000)"}
        />
      </>
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
    cups: () => <img src={SixOfCups} alt={"SixOfCups"} />,
  },
  7: {
    golds: () => <img src={SevenOfCoins} alt={"SevenOfCoins"} />,
    clubs: ({ size }) => (
      <>
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "-top-0.5 -left-3.5 h-19": size === "sm",
            "-top-1.5 right-1 h-28": size === "md",
            "-top-2.5 right-2 h-37": size === "lg",
          })}
          translate={"translate(30,10)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-top-0.5 right-0.5 h-19": size === "sm",
            "-top-2.5 right-0.5 h-28": size === "md",
            "-top-3 right-2 h-37": size === "lg",
          })}
          translate={"translate(40,50)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "-top-0.5 left-7.5 h-19": size === "sm",
            "-top-1.5 left-12 h-28": size === "md",
            "-top-2.5 left-16 h-37": size === "lg",
          })}
          translate={"translate(30,10)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <YellowClubGlyph
          className={clsx("absolute -rotate-90", {
            "top-1.5 -left-6 h-20": size === "sm",
            "top-1 -left-7 h-28": size === "md",
            "top-1 -left-10 h-37": size === "lg",
          })}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-bottom-4.5 right-0.5 h-19": size === "sm",
            "-bottom-7 right-1 h-28": size === "md",
            "-bottom-10 right-2 h-37": size === "lg",
          })}
          translate={"translate(85,25)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <GreenClubGlyph
          className={clsx("absolute rotate-30", {
            "-bottom-3 left-2.5 h-19": size === "sm",
            "-bottom-5 left-4 h-28": size === "md",
            "-bottom-7.5 left-5 h-37": size === "lg",
          })}
          translate={"translate(55,55)"}
          scale={"scale(-0.180000,0.180000)"}
        />
        <RedClubGlyph
          className={clsx("absolute rotate-155", {
            "-bottom-4.5 left-7.5 h-19": size === "sm",
            "-bottom-7 left-12 h-28": size === "md",
            "-bottom-10 left-16 h-37": size === "lg",
          })}
          translate={"translate(85,25)"}
          scale={"scale(-0.180000,0.180000)"}
        />
      </>
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
    cups: () => <img src={SevenOfCups} alt={"SevenOfCups"} />,
  },
  10: {
    golds: () => <img src={TenOfCoins} alt={"TenOfCoins"} />,
    clubs: ({ color, size }) => (
      <TenOfClubs
        fill={color}
        className={clsx("absolute", {
          "-bottom-3 left-3.5 h-24.5": size === "sm",
          "-bottom-5 left-5 h-34.5": size === "md",
          "-bottom-7 left-7 h-44.5": size === "lg",
        })}
      />
    ),
    blades: ({ color, size }) => (
      <TenOfSwordGlyph
        fill={color}
        className={clsx("absolute", {
          "-bottom-2 left-3 h-22.5": size === "sm",
          "-bottom-4 left-4.5 h-32.5": size === "md",
          "-bottom-5 left-6.5 h-42.5": size === "lg",
        })}
      />
    ),
    cups: () => <img src={TenOfCups} alt={"TenOfCups"} />,
  },
  11: {
    golds: () => <img src={ElevenOfCoins} alt={"ElevenOfCoins"} />,
    clubs: ({ color, size }) => (
      <ElevenOfClubs
        fill={color}
        className={clsx("absolute", {
          "-bottom-2 left-0 h-23": size === "sm",
          "-bottom-3 left-0 h-33": size === "md",
          "-bottom-5 left-0 h-43": size === "lg",
        })}
      />
    ),
    blades: ({ color, size }) => (
      <ElevenOfSwordGlyph
        fill={color}
        className={clsx("absolute", {
          "-bottom-2 left-0 h-22.5": size === "sm",
          "-bottom-3.5 left-0.5 h-32.5": size === "md",
          "-bottom-5 left-0.5 h-42.5": size === "lg",
        })}
      />
    ),
    cups: () => <img src={ElevenOfCups} alt={"ElevenOfCups"} />,
  },
  12: {
    golds: () => <img src={TwelveOfCoins} alt={"TwelveOfCoins"} />,
    clubs: ({ color, size }) => (
      <TwelveOfClubs
        fill={color}
        className={clsx("absolute", {
          "-bottom-2 left-2 h-22": size === "sm",
          "-bottom-3.5 left-3 h-32": size === "md",
          "-bottom-5 left-4 h-42": size === "lg",
        })}
      />
    ),
    blades: ({ color, size }) => (
      <TwelveOfSwordGlyph
        fill={color}
        className={clsx("absolute", {
          "-bottom-2 left-2 h-22": size === "sm",
          "-bottom-3.5 left-3 h-32": size === "md",
          "-bottom-5 left-4 h-42": size === "lg",
        })}
      />
    ),
    cups: () => <img src={TwelveOfCups} alt={"TwelveOfCups"} />,
  },
};

export const SuitGlyph = ({ suit, rank, size }: SuitGlyphProps) => {
  const color = SUIT_COLOR[suit];
  const Layout = LAYOUT[rank][suit];
  return <Layout color={color} size={size} />;
};
