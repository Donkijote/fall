import { useState } from "react";

import { HomeSettings } from "../../HomeSettings";
import { HomeUtilities } from "../../HomeUtilities";

function UtilitiesPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-start">
      <HomeUtilities onSettings={() => setOpen(true)} />
      <HomeSettings open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const homeGallery = {
  title: "Card Hall",
  folder: "home",
  entries: [
    {
      name: "HomeUtilities",
      source: "src/modules/home/ui/HomeUtilities.tsx",
      variants: "Joined utility dock, disabled messages, help menu, settings and session actions",
      usage: "Card Hall · upper dock",
      Preview: UtilitiesPreview,
    },
  ],
};
