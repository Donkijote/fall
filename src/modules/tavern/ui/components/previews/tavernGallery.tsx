import { useState } from "react";

import { TavernFormatCard } from "../TavernFormatCard";
import { tavernFormats } from "../tavernFormats";
import { TavernRoom } from "../TavernRoom";

function FormatPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-3 [--tavern-card-height:14rem] landscape:grid-cols-3">
      {tavernFormats.map((format) => (
        <TavernFormatCard
          key={format.mode}
          {...format}
          selected={selected === format.mode}
          onTouchFocus={(focused) => setSelected(focused ? format.mode : null)}
          onActivate={() =>
            setSelected((previous) => (previous === format.mode ? null : format.mode))
          }
        />
      ))}
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
