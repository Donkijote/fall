import { Navigation, type NavigationItem } from "@/components";

import { cardHallIcons } from "../../cardHallIcons";

const playerSystems: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Character and progress",
    items: [
      { id: "hero", label: "Hero", icon: cardHallIcons.hero },
      { id: "collection", label: "Collection", icon: cardHallIcons.collection },
      { id: "journal", label: "Journal", icon: cardHallIcons.journal },
    ],
  },
  {
    label: "Guild and trade",
    items: [
      { id: "guild", label: "Guild", icon: cardHallIcons.guild },
      { id: "market", label: "Market", icon: cardHallIcons.market },
    ],
  },
].map(({ label, items }) => ({
  label,
  items: items.map((item) => ({ ...item, disabled: true, unavailableLabel: "coming soon" })),
}));

export function PlayerSystemsDock() {
  return <Navigation label="Player systems" groups={playerSystems} />;
}
