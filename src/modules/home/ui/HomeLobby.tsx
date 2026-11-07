import { ArrowRight, Swords } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { Button } from "@/components/ui/button";
import type { User } from "@/domain/entities/User";
import { WelcomeModal } from "@/infrastructure/ui/components/modal/WelcomeModal";
import { BottomSidebar } from "@/infrastructure/ui/components/navbar/BottomSidebar";

import { HomeHud } from "./HomeHud";
import { HomeSettings } from "./HomeSettings";
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
      >
        <section
          aria-labelledby="home-title"
          className="home-arrival flex flex-col items-center gap-3 text-center landscape:gap-2"
        >
          <span
            aria-hidden="true"
            className="home-arrival-mark flex size-12 items-center justify-center rounded-full lg:size-16 max-lg:landscape:hidden"
          >
            <Swords className="size-5 lg:size-7" />
          </span>
          <h1
            id="home-title"
            className="font-heading text-2xl font-bold tracking-wide sm:text-3xl lg:text-4xl"
          >
            The Hearth
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            A moment of rest. Another hand awaits.
          </p>
          <Button
            type="button"
            aria-label="Play"
            disabled={!player}
            onClick={() => setPanel("play")}
            className="home-play pointer-events-auto mt-1 min-h-11 gap-3 px-6 font-heading text-xs font-bold lg:min-h-12"
          >
            Play Caída
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </section>
      </HomeHud>
      <BottomSidebar isOpen={Boolean(player) && panel === "play"} onClose={() => setPanel(null)} />
      <HomeSettings
        open={Boolean(player) && panel === "settings"}
        onOpenChange={(open) => setPanel(open ? "settings" : null)}
      />
      <WelcomeModal onSave={setPlayer} />
    </main>
  );
}
