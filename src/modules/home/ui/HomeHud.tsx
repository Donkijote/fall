import {
  Backpack,
  BookOpen,
  Coins,
  Layers3,
  LockKeyhole,
  Settings,
  Shield,
  UserRound,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { HudResource } from "./HudResource";

export type HomeHudProps = {
  player: { name: string; avatarUrl?: string };
  energy?: { value: number; maximum: number };
  coins?: number;
  onSettings: () => void;
  scene?: ReactNode;
  children?: ReactNode;
};

const playerSystems = [
  { label: "Collection", icon: Layers3 },
  { label: "Character", icon: Shield },
  { label: "Inventory", icon: Backpack },
  { label: "Quests", icon: BookOpen },
];

export function HomeHud({ player, energy, coins, onSettings, scene, children }: HomeHudProps) {
  const [failedAvatar, setFailedAvatar] = useState<string>();

  return (
    <div className="home-stage relative isolate min-h-dvh">
      <div
        data-slot="home-scene"
        className="home-scene-layer pointer-events-none absolute inset-0 z-0"
      >
        {scene}
      </div>
      <div className="home-hud-layer pointer-events-none relative z-10 grid min-h-dvh grid-rows-[auto_minmax(4rem,1fr)_auto] gap-4 p-4 sm:p-6 landscape:gap-2 landscape:p-3 lg:landscape:p-6">
        <header
          aria-label="Player HUD"
          className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-3 max-sm:portrait:grid-cols-[minmax(0,1fr)_auto] landscape:gap-2"
        >
          <div
            role="group"
            aria-label="Player identity"
            className="hud-player pointer-events-auto flex max-w-72 min-w-0 items-center gap-3 self-start p-1.5 pr-5"
          >
            <span className="hud-portrait relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full lg:size-16">
              {player.avatarUrl && failedAvatar !== player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setFailedAvatar(player.avatarUrl)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserRound className="size-6 lg:size-8" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 py-1">
              <span
                className="hud-player-name block truncate font-heading text-sm font-bold lg:text-lg"
                title={player.name}
              >
                {player.name}
              </span>
              <span className="hud-player-caption mt-0.5 block text-[0.625rem] tracking-[0.16em] uppercase">
                Traveller
              </span>
            </div>
          </div>
          <div
            aria-label="Resources"
            role="group"
            className="flex min-w-0 items-start gap-2 pt-1 max-sm:portrait:col-span-2 max-sm:portrait:row-start-2 max-sm:portrait:justify-end"
          >
            <div className="w-[clamp(7.5rem,17vw,12rem)] max-sm:portrait:flex-1">
              <HudResource
                label="Energy"
                icon={Zap}
                value={energy?.value}
                maximum={energy?.maximum}
                bounded
              />
            </div>
            <div className="w-[clamp(6.5rem,12vw,9rem)] max-sm:portrait:flex-1">
              <HudResource label="Coins" icon={Coins} value={coins} />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onSettings}
            aria-label="Settings"
            className="hud-settings-trigger pointer-events-auto mt-1 size-12 rounded-full max-sm:portrait:col-start-2 max-sm:portrait:row-start-1"
          >
            <Settings className="size-5" aria-hidden="true" />
          </Button>
        </header>
        <div
          data-slot="home-scene-space"
          className="relative flex min-h-0 items-center justify-center py-6 landscape:py-0"
        >
          {children}
        </div>
        <nav
          aria-label="Player systems"
          className="hud-shortcuts flex flex-wrap items-end justify-center gap-3 pb-1 sm:gap-5 landscape:gap-3"
        >
          <p id="home-planned-systems" className="sr-only">
            These player systems are coming soon and are not available yet.
          </p>
          {playerSystems.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              disabled
              aria-label={`${label} (coming soon)`}
              aria-describedby="home-planned-systems"
              className="hud-shortcut relative h-auto w-[clamp(4rem,10vw,6rem)] flex-col gap-1.5 rounded-none border-0 p-1 whitespace-normal disabled:opacity-100"
            >
              <span className="hud-shortcut-emblem relative flex size-12 items-center justify-center rounded-full lg:size-16">
                <Icon className="size-5 lg:size-7" aria-hidden="true" />
                <span
                  className="hud-shortcut-lock absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <LockKeyhole className="size-2.5" />
                </span>
              </span>
              <span className="font-heading text-[0.625rem] font-bold sm:text-xs">{label}</span>
              <span className="hud-shortcut-status text-[0.625rem] leading-none" aria-hidden="true">
                Soon
              </span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
