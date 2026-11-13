import wingfoot from "@/assets/branding/wingfoot.svg";
import cardDraw from "@/assets/icons/card-draw.svg";
import crossMark from "@/assets/icons/cross-mark.svg";
import openPalm from "@/assets/icons/open-palm.svg";
import sparkles from "@/assets/icons/sparkles.svg";
import trophy from "@/assets/icons/trophy.svg";
import woodenDoor from "@/assets/icons/wooden-door.svg";
import cardPick from "@/assets/lobby/card-hall/icons/card-pick.svg";
import cog from "@/assets/lobby/card-hall/icons/cog.svg";
import cutDiamond from "@/assets/lobby/card-hall/icons/cut-diamond.svg";
import electric from "@/assets/lobby/card-hall/icons/electric.svg";
import envelope from "@/assets/lobby/card-hall/icons/envelope.svg";
import rank1 from "@/assets/lobby/card-hall/icons/rank-1.svg";
import scales from "@/assets/lobby/card-hall/icons/scales.svg";
import scrollUnfurled from "@/assets/lobby/card-hall/icons/scroll-unfurled.svg";
import threeFriends from "@/assets/lobby/card-hall/icons/three-friends.svg";
import twoCoins from "@/assets/lobby/card-hall/icons/two-coins.svg";
import visoredHelm from "@/assets/lobby/card-hall/icons/visored-helm.svg";
import woodenChair from "@/assets/lobby/tavern-match/wooden-chair.svg";
import crossedSwords from "@/assets/login/icons/crossed-swords.svg";
import jeweledChalice from "@/assets/login/icons/jeweled-chalice.svg";
import padlock from "@/assets/login/icons/padlock.svg";
import plainArrow from "@/assets/login/icons/plain-arrow.svg";
import woodClub from "@/assets/login/icons/wood-club.svg";
import { Icon } from "@/components/icons/Icon";

// Catalog of the credited Game-icons assets used by app screens.
export const gameIcons = [
  {
    name: "Card Draw",
    icon: cardDraw,
    source: "src/assets/icons/card-draw.svg",
    usage: "Capture count and Rulebook scoring examples",
  },
  {
    name: "Card Pick",
    icon: cardPick,
    source: "src/assets/lobby/card-hall/icons/card-pick.svg",
    usage: "Card Hall collection and Tavern opening deal",
  },
  {
    name: "Cog",
    icon: cog,
    source: "src/assets/lobby/card-hall/icons/cog.svg",
    usage: "Card Hall Settings shortcut",
  },
  {
    name: "Cross Mark",
    icon: crossMark,
    source: "src/assets/icons/cross-mark.svg",
    usage: "Modal close and TextInput search clear",
  },
  {
    name: "Crossed Swords",
    icon: crossedSwords,
    source: "src/assets/login/icons/crossed-swords.svg",
    usage: "Login suit decorations",
  },
  {
    name: "Cut Diamond",
    icon: cutDiamond,
    source: "src/assets/lobby/card-hall/icons/cut-diamond.svg",
    usage: "Card Hall diamond readout",
  },
  {
    name: "Electric",
    icon: electric,
    source: "src/assets/lobby/card-hall/icons/electric.svg",
    usage: "Card Hall energy readout",
  },
  {
    name: "Envelope",
    icon: envelope,
    source: "src/assets/lobby/card-hall/icons/envelope.svg",
    usage: "Card Hall messages and Login email field",
  },
  {
    name: "Jeweled Chalice",
    icon: jeweledChalice,
    source: "src/assets/login/icons/jeweled-chalice.svg",
    usage: "Login suit decorations",
  },
  {
    name: "Open Palm",
    icon: openPalm,
    source: "src/assets/icons/open-palm.svg",
    usage: "Tavern opening deal order",
  },
  {
    name: "Padlock",
    icon: padlock,
    source: "src/assets/login/icons/padlock.svg",
    usage: "Login password field",
  },
  {
    name: "Plain Arrow",
    icon: plainArrow,
    source: "src/assets/login/icons/plain-arrow.svg",
    usage: "Login primary action",
  },
  {
    name: "Rank 1",
    icon: rank1,
    source: "src/assets/lobby/card-hall/icons/rank-1.svg",
    usage: "Card Hall player level crest",
  },
  {
    name: "Scroll Unfurled",
    icon: scrollUnfurled,
    source: "src/assets/lobby/card-hall/icons/scroll-unfurled.svg",
    usage: "Card Hall journal",
  },
  {
    name: "Scales",
    icon: scales,
    source: "src/assets/lobby/card-hall/icons/scales.svg",
    usage: "Card Hall market",
  },
  {
    name: "Sparkles",
    icon: sparkles,
    source: "src/assets/icons/sparkles.svg",
    usage: "Tavern capture bonus",
  },
  {
    name: "Three Friends",
    icon: threeFriends,
    source: "src/assets/lobby/card-hall/icons/three-friends.svg",
    usage: "Card Hall guild",
  },
  {
    name: "Trophy",
    icon: trophy,
    source: "src/assets/icons/trophy.svg",
    usage: "Rulebook winning score example",
  },
  {
    name: "Two Coins",
    icon: twoCoins,
    source: "src/assets/lobby/card-hall/icons/two-coins.svg",
    usage: "Card Hall coin readout, Login suit decorations, and Tavern capture bonus",
  },
  {
    name: "Visored Helm",
    icon: visoredHelm,
    source: "src/assets/lobby/card-hall/icons/visored-helm.svg",
    usage: "Card Hall hero",
  },
  {
    name: "Wingfoot",
    icon: wingfoot,
    source: "src/assets/branding/wingfoot.svg",
    usage: "Card Hall and Login wordmarks",
  },
  {
    name: "Wood Club",
    icon: woodClub,
    source: "src/assets/login/icons/wood-club.svg",
    usage: "Login suit decorations",
  },
  {
    name: "Wooden Chair",
    icon: woodenChair,
    source: "src/assets/lobby/tavern-match/wooden-chair.svg",
    usage: "Tavern waiting sign and open seat marker",
  },
  {
    name: "Wooden Door",
    icon: woodenDoor,
    source: "src/assets/icons/wooden-door.svg",
    usage: "Tavern match leave control",
  },
];

export function GameIconPreview() {
  return (
    <ul aria-label="Game-icons used in Fall" className="flex flex-wrap gap-x-5 gap-y-4">
      {gameIcons.map(({ name, icon, source, usage }) => (
        <li
          key={source}
          className="grid w-20 justify-items-center gap-1.5 text-center text-xs"
          title={`${usage}
${source}`}
        >
          <Icon icon={icon} className="size-8 text-gold" />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}
