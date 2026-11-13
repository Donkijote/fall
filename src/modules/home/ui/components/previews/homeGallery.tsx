import { useState } from "react";

import { HomeSettings } from "../../HomeSettings";
import { HomeUtilities } from "../../HomeUtilities";
import { PlayerSystemsDock } from "../navigation/PlayerSystemsDock";

function NavigationPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid justify-items-start gap-4 overflow-x-auto">
      <div className="grid gap-2">
        <h4 className="text-sm">Utility dock</h4>
        <HomeUtilities onSettings={() => setOpen(true)} />
      </div>
      <div className="grid gap-2">
        <h4 className="text-sm">Player systems dock</h4>
        <PlayerSystemsDock />
      </div>
      <HomeSettings open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const homeGallery = {
  title: "Card Hall",
  folder: "home",
  entries: [
    {
      name: "Card Hall navigation",
      source: "src/components/navigation/Navigation.tsx",
      variants:
        "NavigationButton and NavigationGroup · joined icon buttons, disabled destinations, help popover and settings",
      usage: "Card Hall · utility and player systems docks",
      Preview: NavigationPreview,
    },
  ],
};
