import { Search } from "lucide-react";
import type { ComponentType } from "react";

import levelCrest from "@/assets/lobby/card-hall/icons/rank-1.svg";
import coins from "@/assets/lobby/card-hall/icons/two-coins.svg";
import traveller from "@/assets/lobby/card-hall/traveller.webp";
import { PlayerIdentity, ResourceReadout, TextInput } from "@/components";
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
        name: "ActivityCard",
        variants: "Selected, unavailable and disabled",
        usage: "Card Hall activity picker",
        Preview: ActivityPreview,
      },
    ],
  },
  {
    title: "Surfaces",
    folder: "surfaces",
    entries: [
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
        variants: "Count, capped count, unavailable",
        usage: "Card Hall resource HUD",
        Preview: () => (
          <div className="flex gap-3">
            <ResourceReadout label="Coins" icon={coins} value={120} />
            <ResourceReadout label="Capped coins" icon={coins} value={8} maximum={10} />
            <ResourceReadout label="Unavailable coins" icon={coins} />
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
