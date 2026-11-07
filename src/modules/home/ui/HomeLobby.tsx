import { useState } from "react";
import { useSearchParams } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomSidebar } from "@/infrastructure/ui/components/navbar/BottomSidebar";

import { HomeHud } from "./HomeHud";
import { HomeSettings } from "./HomeSettings";
import { LivingTownScene } from "./LivingTownScene";
import "./home.css";

export function HomeLobby() {
  const [searchParams] = useSearchParams();
  const [player, setPlayer] = useState(() => StorageService.get<User>(StorageKeys.FALL_USER));
  const [panel, setPanel] = useState<"play" | "settings" | null>(() =>
    searchParams.get("bottomSidebar") ? "play" : null,
  );

  return (
    <main className="home-screen h-dvh overflow-x-hidden overflow-y-auto overscroll-contain text-foreground motion-reduce:**:transition-none">
      <HomeHud
        player={{
          name: player?.name || player?.username || "Traveller",
          avatarUrl: player?.avatar,
        }}
        onSettings={() => setPanel("settings")}
        scene={<LivingTownScene canPlay={Boolean(player)} onPlay={() => setPanel("play")} />}
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
