import { Search } from "lucide-react";
import type { ComponentType } from "react";

import diamonds from "@/assets/lobby/card-hall/icons/cut-diamond.svg";
import energy from "@/assets/lobby/card-hall/icons/electric.svg";
import levelCrest from "@/assets/lobby/card-hall/icons/rank-1.svg";
import coins from "@/assets/lobby/card-hall/icons/two-coins.svg";
import traveller from "@/assets/lobby/card-hall/traveller.webp";
import {
  ArrowDivider,
  BronzeArrow,
  Callout,
  PlayerIdentity,
  ResourceReadout,
  TextInput,
} from "@/components";
import { DeclarationBadge } from "@/components/cards/DeclarationBadge";
import { EmptyCardSlot } from "@/components/cards/EmptyCardSlot";
import { PointsBadge } from "@/components/cards/PointsBadge";
import { BrassCheckbox } from "@/components/controls/BrassCheckbox";
import { BronzeSlider } from "@/components/controls/BronzeSlider";
import { WaxSwitch } from "@/components/controls/WaxSwitch";
import { NumberMedallion } from "@/components/hud/NumberMedallion";
import { ProfileButton } from "@/components/hud/ProfileButton";
import { GuideLink } from "@/components/navigation/GuideLink";
import { ParchmentFigure } from "@/components/surfaces/ParchmentFigure";
import { homeGallery } from "@/modules/home";
import { loginGallery } from "@/modules/login";
import { matchGallery } from "@/modules/match";
import { rulebookGallery } from "@/modules/rulebook";
import { singsGallery } from "@/modules/sings-reference";
import { tavernGallery } from "@/modules/tavern";

import {
  ActionPreview,
  ActivityPreview,
  ChoicePreview,
  FramePreview,
  ModalPreview,
  PopoverPreview,
  SelectPreview,
  TurnRingPreview,
} from "./ComponentPreviews";
import { gameIcons, GameIconPreview } from "./GameIconPreview";

type Entry = {
  name: string;
  variants: string;
  usage: string;
  source?: string;
  searchTerms?: readonly string[];
  Preview: ComponentType;
};

export const gallerySections: { title: string; folder: string; entries: Entry[] }[] = [
  {
    title: "Actions",
    folder: "actions",
    entries: [
      {
        name: "ActionButton",
        variants: "Primary, quiet, outline, icon-only, disabled",
        usage: "Login, Hall Settings, Tavern match overlays",
        Preview: ActionPreview,
      },
    ],
  },
  {
    title: "Controls",
    folder: "controls",
    entries: [
      {
        name: "BrassCheckbox",
        variants: "Unchecked, checked, disabled · brass recess and wax mark",
        usage: "Sings reference · Mandatory only filter",
        Preview: () => (
          <div className="flex flex-wrap gap-4">
            <BrassCheckbox aria-label="Unchecked example" />
            <BrassCheckbox aria-label="Checked example" defaultChecked />
            <BrassCheckbox aria-label="Disabled example" disabled />
            <BrassCheckbox aria-label="Disabled checked example" defaultChecked disabled />
          </div>
        ),
      },
      {
        name: "BronzeSlider",
        variants: "Adjustable, disabled",
        usage: "Hall Settings · card effects volume",
        Preview: () => (
          <div className="grid w-52 max-w-full">
            <BronzeSlider aria-label="Volume preview" defaultValue={[61]} />
            <BronzeSlider aria-label="Disabled volume preview" defaultValue={[35]} disabled />
          </div>
        ),
      },
      {
        name: "WaxSwitch",
        variants: "Off, on, disabled",
        usage: "Hall Settings · mute card effects",
        Preview: () => (
          <div className="flex flex-wrap items-center gap-6">
            <WaxSwitch aria-label="Mute preview" />
            <WaxSwitch aria-label="Muted preview" defaultChecked />
            <WaxSwitch aria-label="Disabled mute preview" disabled />
          </div>
        ),
      },
      {
        name: "ChoiceButton",
        variants: "Unselected, selected, disabled",
        usage: "Hall Settings",
        Preview: ChoicePreview,
      },
      {
        name: "TextInput",
        variants: "Empty, filled, search, disabled",
        usage: "Login, How to Play, Sings reference",
        Preview: () => (
          <div className="grid gap-2">
            <TextInput
              aria-label="Search example"
              type="search"
              leadingIcon={<Search />}
              placeholder="Search rules"
            />
            <TextInput aria-label="Filled input example" defaultValue="Traveller" />
            <TextInput aria-label="Disabled input example" defaultValue="Tavern" disabled />
          </div>
        ),
      },
      {
        name: "SelectField",
        variants: "Closed, open, highlighted option, selected value",
        usage: "Hall Settings, Sings reference, Animation playground, Component gallery",
        Preview: SelectPreview,
      },
    ],
  },
  {
    title: "Cards",
    folder: "cards",
    entries: [
      {
        name: "DeclarationBadge",
        variants: "Optional wax and mandatory brass plate",
        usage: "Sings reference, How to Play",
        Preview: () => (
          <div className="flex flex-wrap gap-4">
            <DeclarationBadge mandatory={false} />
            <DeclarationBadge mandatory />
          </div>
        ),
      },
      {
        name: "PointsBadge",
        variants: "Single, double, and bonus values",
        usage: "Sings reference, How to Play, match results",
        Preview: () => (
          <div className="flex flex-wrap gap-3">
            <PointsBadge points={1} />
            <PointsBadge points={12} />
            <PointsBadge points="+2" />
          </div>
        ),
      },
      {
        name: "EmptyCardSlot",
        variants: "Empty illustrated card recess",
        usage: "Tavern match · collected and draw piles",
        Preview: () => <EmptyCardSlot className="w-16" />,
      },
      {
        name: "ActivityCard",
        variants: "Idle, active, and unavailable across three modes",
        usage: "Card Hall activity picker",
        Preview: ActivityPreview,
      },
    ],
  },
  {
    title: "Dividers",
    folder: "dividers",
    entries: [
      {
        name: "BronzeArrow",
        variants: "Left, right, vertical, and faded",
        usage:
          "Login, ArrowDivider, How to Play’s Sings list, Sings Reference grid, and Hall Settings",
        Preview: () => (
          <div className="grid gap-3">
            <BronzeArrow className="w-14" />
            <BronzeArrow direction="left" className="w-full" />
            <BronzeArrow direction="down" className="h-14" />
            <BronzeArrow tone="faded" className="h-0.5 w-full" />
          </div>
        ),
      },
      {
        name: "ArrowDivider",
        variants: "Oak centerpiece and inline label",
        usage: "Login, How to Play illustrations and chapter footer, Sings reference",
        Preview: () => (
          <div className="grid gap-3">
            <ArrowDivider />
            <ArrowDivider>
              <span>Or continue with</span>
            </ArrowDivider>
          </div>
        ),
      },
    ],
  },
  {
    title: "Surfaces",
    folder: "surfaces",
    entries: [
      {
        name: "ParchmentFigure",
        variants: "Paper artwork, illustrated heading, and caption",
        usage: "How to Play · examples and diagrams",
        Preview: () => (
          <ParchmentFigure
            title="Match the rank"
            caption="Shared parchment artwork and live content."
          >
            <span className="font-serif text-3xl">4 + 4</span>
          </ParchmentFigure>
        ),
      },
      {
        name: "Callout",
        variants: "Note, tip, warning",
        usage: "How to Play · highlighted rules",
        Preview: () => (
          <div className="grid gap-2">
            <Callout>The rank you match determines how many points the Fall earns.</Callout>
            <Callout tone="tip">Look for consecutive ranks to extend a capture.</Callout>
            <Callout tone="warning">
              Clearing the table earns a bonus only while there are cards left in the deck.
            </Callout>
          </div>
        ),
      },
      {
        name: "FramedCard",
        variants: "Brass frame with header, content, and actions",
        usage: "Login, How to Play",
        Preview: FramePreview,
      },
      {
        name: "ModalContent",
        variants: "Open, dismissible",
        usage: "Hall Settings, Tavern leave match",
        Preview: ModalPreview,
      },
      {
        name: "PopoverPanel",
        variants: "Open, dismissible",
        usage: "Card Hall help",
        Preview: PopoverPreview,
      },
    ],
  },
  {
    title: "HUD",
    folder: "hud",
    entries: [
      {
        name: "PlayerPortrait",
        variants: "Portrait, initials, and highlighted turn ring",
        usage: "Card Hall, Tavern seats, match seats",
        Preview: TurnRingPreview,
      },
      {
        name: "NumberMedallion",
        variants: "Brass number token without a points unit",
        usage: "How to Play · quick-start steps",
        Preview: () => (
          <div className="flex gap-3">
            {[1, 2, 3].map((value) => (
              <NumberMedallion key={value}>{value}</NumberMedallion>
            ))}
          </div>
        ),
      },
      {
        name: "ProfileButton",
        variants: "Pointer hover, keyboard focus, static shine with reduced motion",
        usage: "Card Hall profile action; optional activation handler",
        Preview: () => <ProfileButton fallbackAvatarUrl={traveller} />,
      },
      {
        name: "PlayerIdentity",
        variants: "Traveller avatar, level crest, experience",
        usage: "Card Hall player HUD",
        Preview: () => (
          <PlayerIdentity
            name="Traveller"
            fallbackAvatarUrl={traveller}
            levelCrestUrl={levelCrest}
            level={4}
            experience={{ value: 60, maximum: 100 }}
          />
        ),
      },
      {
        name: "ResourceReadout",
        variants: "Count, capped count, unavailable; hover/focus orbit with pause and resume",
        usage: "Card Hall resource HUD",
        Preview: () => (
          <div className="flex flex-wrap gap-3">
            <ResourceReadout label="Coins" icon={coins} value={120} />
            <ResourceReadout label="Energy" icon={energy} value={8} maximum={10} />
            <ResourceReadout label="Diamonds" icon={diamonds} />
          </div>
        ),
      },
    ],
  },
  {
    title: "Navigation",
    folder: "navigation",
    entries: [
      {
        name: "GuideLink",
        variants: "Idle, hover, keyboard focus, current page",
        usage: "Card Hall Help, How to Play chapters and rule search",
        Preview: () => (
          <div className="grid gap-2">
            <GuideLink to="/rules">How to Play</GuideLink>
            <GuideLink to="/sings" aria-current="page">
              Sings reference
            </GuideLink>
          </div>
        ),
      },
    ],
  },
  {
    title: "Icons",
    folder: "icons",
    entries: [
      {
        name: "Icon",
        variants: "Game-icons SVGs and Lucide utility glyphs",
        searchTerms: gameIcons.map(({ name }) => name),
        usage: "Card Hall, Login, Tavern match, Rulebook",
        Preview: GameIconPreview,
      },
    ],
  },
  homeGallery,
  loginGallery,
  matchGallery,
  tavernGallery,
  rulebookGallery,
  singsGallery,
];
