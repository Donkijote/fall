import { useState } from "react";

import duel from "@/assets/lobby/tavern/duel.webp";

import { TavernFormatCard } from "../TavernFormatCard";
import { TavernRoom } from "../TavernRoom";

function FormatPreview() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="mx-auto max-w-52 [--tavern-card-height:14rem]">
      <TavernFormatCard
        mode="1vs1"
        title="Duel"
        players="2 players"
        description="Face one opponent."
        artwork={duel}
        selected={selected}
        onTouchFocus={setSelected}
        onActivate={() => setSelected((previous) => !previous)}
      />
    </div>
  );
}

export const tavernGallery = {
  title: "Tavern picker",
  folder: "tavern",
  entries: [
    {
      name: "TavernFormatCard",
      source: "src/modules/tavern/ui/components/TavernFormatCard.tsx",
      variants: "Illustrated format, selected, hover and focus",
      usage: "Tavern format picker",
      Preview: FormatPreview,
    },
    {
      name: "TavernRoom",
      source: "src/modules/tavern/ui/components/TavernRoom.tsx",
      variants: "Illustrated backdrop and ambient motion",
      usage: "Tavern format picker",
      Preview: () => (
        <div className="relative isolate h-52">
          <TavernRoom />
        </div>
      ),
    },
  ],
};
