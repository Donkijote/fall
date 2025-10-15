import type { FC, PropsWithChildren } from "react";

import AceOfClubs from "@/assets/cards/clubs/AceOfClubs.svg";
import ElevenOfClubs from "@/assets/cards/clubs/ElevenOfClubs.svg";
import FiveOfClubs from "@/assets/cards/clubs/FiveOfClubs.svg";
import FourOfClubs from "@/assets/cards/clubs/FourOfClubs.svg";
import SevenOfClubs from "@/assets/cards/clubs/SevenOfClubs.svg";
import SixOfClubs from "@/assets/cards/clubs/SixOfClubs.svg";
import TenOfClubs from "@/assets/cards/clubs/TenOfClubs.svg";
import ThreeOfClubs from "@/assets/cards/clubs/ThreeOfClubs.svg";
import TwelveOfClubs from "@/assets/cards/clubs/TwelveOfClubs.svg";
import TwoOfClubs from "@/assets/cards/clubs/TwoOfClubs.svg";
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
import AceOfSwords from "@/assets/cards/swords/AceOfSwords.svg";
import ElevenOfSwords from "@/assets/cards/swords/ElevenOfSwords.svg";
import FiveOfSwords from "@/assets/cards/swords/FiveOfSwords.svg";
import FourOfSwords from "@/assets/cards/swords/FourOfSwords.svg";
import SevenOfSwords from "@/assets/cards/swords/SevenOfSwords.svg";
import SixOfSwords from "@/assets/cards/swords/SixOfSwords.svg";
import TenOfSwords from "@/assets/cards/swords/TenOfSwords.svg";
import ThreeOfSwords from "@/assets/cards/swords/ThreeOfSwords.svg";
import TwelveOfSwords from "@/assets/cards/swords/TwelveOfSwords.svg";
import TwoOfSwords from "@/assets/cards/swords/TwoOfSwords.svg";
import { type Suit, SUIT_COLOR } from "@/domain/entities/Card";

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
    clubs: () => <img src={AceOfClubs} alt={"AceOfClubs"} />,
    blades: () => <img src={AceOfSwords} alt={"AceOfSwords"} />,
    cups: () => <img src={AceOfCups} alt={"AceOfCups"} />,
  },
  2: {
    golds: () => <img src={TwoOfCoins} alt={"TwoOfCoins"} />,
    clubs: () => <img src={TwoOfClubs} alt={"TwoOfClubs"} />,
    blades: () => <img src={TwoOfSwords} alt={"TwoOfSwords"} />,
    cups: () => <img src={TwoOfCups} alt={"TwoOfCups"} />,
  },
  3: {
    golds: () => <img src={ThreeOfCoins} alt={"ThreeOfCoins"} />,
    clubs: () => <img src={ThreeOfClubs} alt={"ThreeOfClubs"} />,
    blades: () => <img src={ThreeOfSwords} alt={"ThreeOfSwords"} />,
    cups: () => <img src={ThreeOfCups} alt={"ThreeOfCups"} />,
  },
  4: {
    golds: () => <img src={FourOfCoins} alt={"FourOfCoins"} />,
    clubs: () => <img src={FourOfClubs} alt={"FourOfClubs"} />,
    blades: () => <img src={FourOfSwords} alt={"FourOfSwords"} />,
    cups: () => <img src={FourOfCups} alt={"FourOfCups"} />,
  },
  5: {
    golds: () => <img src={FiveOfCoins} alt={"FiveOfCoins"} />,
    clubs: () => <img src={FiveOfClubs} alt={"FiveOfClubs"} />,
    blades: () => <img src={FiveOfSwords} alt={"FiveOfSwords"} />,
    cups: () => <img src={FiveOfCups} alt={"FiveOfCups"} />,
  },
  6: {
    golds: () => <img src={SixOfCoins} alt={"SixOfCoins"} />,
    clubs: () => <img src={SixOfClubs} alt={"SixOfClubs"} />,
    blades: () => <img src={SixOfSwords} alt={"SixOfSwords"} />,
    cups: () => <img src={SixOfCups} alt={"SixOfCups"} />,
  },
  7: {
    golds: () => <img src={SevenOfCoins} alt={"SevenOfCoins"} />,
    clubs: () => <img src={SevenOfClubs} alt={"SevenOfClubs"} />,
    blades: () => <img src={SevenOfSwords} alt={"SevenOfSwords"} />,
    cups: () => <img src={SevenOfCups} alt={"SevenOfCups"} />,
  },
  10: {
    golds: () => <img src={TenOfCoins} alt={"TenOfCoins"} />,
    clubs: () => <img src={TenOfClubs} alt={"TenOfClubs"} />,
    blades: () => <img src={TenOfSwords} alt={"TenOfSwords"} />,
    cups: () => <img src={TenOfCups} alt={"TenOfCups"} />,
  },
  11: {
    golds: () => <img src={ElevenOfCoins} alt={"ElevenOfCoins"} />,
    clubs: () => <img src={ElevenOfClubs} alt={"ElevenOfClubs"} />,
    blades: () => <img src={ElevenOfSwords} alt={"ElevenOfSwords"} />,
    cups: () => <img src={ElevenOfCups} alt={"ElevenOfCups"} />,
  },
  12: {
    golds: () => <img src={TwelveOfCoins} alt={"TwelveOfCoins"} />,
    clubs: () => <img src={TwelveOfClubs} alt={"TwelveOfClubs"} />,
    blades: () => <img src={TwelveOfSwords} alt={"TwelveOfSwords"} />,
    cups: () => <img src={TwelveOfCups} alt={"TwelveOfCups"} />,
  },
};

export const SuitGlyph = ({ suit, rank, size }: SuitGlyphProps) => {
  const color = SUIT_COLOR[suit];
  const Layout = LAYOUT[rank][suit];
  return <Layout color={color} size={size} />;
};
