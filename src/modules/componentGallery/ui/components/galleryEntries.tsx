import { Coins, Swords } from "lucide-react";
import type { ComponentType } from "react";

import { ContextStrip, PlayerIdentity, ResourceReadout, TextInput } from "@/components";
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
  IconPreview,
  ModalPreview,
  NavigationPreview,
  PopoverPreview,
  SelectPreview,
} from "./ComponentPreviews";

type Entry = {
  name: string;
  variants: string;
  usage: string;
  source?: string;
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
        variants: "Empty, filled, disabled",
        usage: "Login, How to Play, Sings reference",
        Preview: () => (
          <div className="grid gap-2">
            <TextInput aria-label="Empty input example" placeholder="Search rules" />
            <TextInput aria-label="Disabled input example" defaultValue="Tavern" disabled />
          </div>
        ),
      },
      {
        name: "SelectTrigger",
        variants: "Closed, expanded, selected value",
        usage: "Hall Settings, Sings reference, Animation playground",
        Preview: SelectPreview,
      },
      {
        name: "SelectPanel",
        variants: "Open, highlighted option, selected option",
        usage: "Hall Settings, Sings reference",
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
    title: "Navigation",
    folder: "navigation",
    entries: [
      {
        name: "NavigationButton",
        variants: "Icon, joined, disabled",
        usage: "Card Hall docks",
        Preview: NavigationPreview,
      },
      {
        name: "NavigationGroup",
        variants: "Joined controls with rounded outer corners",
        usage: "Card Hall docks",
        Preview: NavigationPreview,
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
        name: "ContextStrip",
        variants: "Icon, label, detail",
        usage: "Available shared component",
        Preview: () => <ContextStrip icon={Swords} label="Tavern" detail="Local match" />,
      },
      {
        name: "PlayerIdentity",
        variants: "Fallback avatar, level, experience",
        usage: "Card Hall player HUD",
        Preview: () => (
          <PlayerIdentity name="Traveller" level={4} experience={{ value: 60, maximum: 100 }} />
        ),
      },
      {
        name: "ResourceReadout",
        variants: "Count, capped count, unavailable",
        usage: "Card Hall resource HUD",
        Preview: () => (
          <div className="flex gap-3">
            <ResourceReadout label="Coins" icon={Coins} value={120} />
            <ResourceReadout label="Capped coins" icon={Coins} value={8} maximum={10} />
            <ResourceReadout label="Unavailable coins" icon={Coins} />
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
        variants: "Lucide icon",
        usage: "NavigationButton, PlayerIdentity, ResourceReadout",
        Preview: IconPreview,
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
