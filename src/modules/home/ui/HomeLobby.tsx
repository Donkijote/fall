import { useState } from "react";
import { useSearchParams } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomSidebar } from "@/infrastructure/ui/components/navbar/BottomSidebar";

import { CardHall } from "./CardHall";
import { HomeSettings } from "./HomeSettings";

const hudPreview = import.meta.env.MODE === "development";
const previewProgress = { level: 12, experience: { value: 680, maximum: 1000 } };
const previewResources = { energy: { value: 78, maximum: 120 }, coins: 1240, diamonds: 85 };

export function HomeLobby() {
  const [searchParams] = useSearchParams();
  const [player, setPlayer] = useState(() => StorageService.get<User>(StorageKeys.FALL_USER));
  const [panel, setPanel] = useState<"play" | "settings" | null>(() =>
    searchParams.get("bottomSidebar") ? "play" : null,
  );

  return (
    <main className="home-screen h-dvh overflow-x-hidden overflow-y-auto overscroll-contain">
      <CardHall
        player={{
          name: player?.name || player?.username || "Traveller",
          avatarUrl: player?.avatar,
          ...(hudPreview ? previewProgress : undefined),
        }}
        resources={hudPreview ? previewResources : undefined}
        onSettings={() => setPanel("settings")}
        canPlay={Boolean(player)}
        onPlay={() => setPanel("play")}
      />
      <BottomSidebar isOpen={Boolean(player) && panel === "play"} onClose={() => setPanel(null)} />
      <HomeSettings
        open={Boolean(player) && panel === "settings"}
        onOpenChange={(open) => setPanel(open ? "settings" : null)}
      />
      <WelcomeModal onSave={setPlayer} />
    </main>
  );
}
