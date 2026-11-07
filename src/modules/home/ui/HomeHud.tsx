import {
  Backpack,
  BookOpen,
  Coins,
  Diamond,
  Layers3,
  LockKeyhole,
  Mail,
  MessageCircle,
  Settings,
  Shield,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { HudResource } from "./HudResource";

export type HomeHudProps = {
  player: {
    name: string;
    avatarUrl?: string;
    level?: number;
    experience?: { value: number; maximum: number };
  };
  energy?: { value: number; maximum: number };
  coins?: number;
  diamonds?: number;
  onSettings: () => void;
  scene?: ReactNode;
  children?: ReactNode;
};

const playerSystems = [
  { label: "Collection", icon: Layers3 },
  { label: "Character", icon: Shield },
  { label: "Inventory", icon: Backpack },
  { label: "Ranks", icon: Trophy },
  { label: "Quests", icon: BookOpen },
];

export function HomeHud({
  player,
  energy,
  coins,
  diamonds,
  onSettings,
  scene,
  children,
}: HomeHudProps) {
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const level = Number.isInteger(player.level) && player.level! > 0 ? player.level : "—";
  const experience = player.experience;
  const hasExperience =
    experience !== undefined &&
    Number.isFinite(experience.value) &&
    Number.isFinite(experience.maximum) &&
    experience.maximum > 0 &&
    experience.value >= 0 &&
    experience.value <= experience.maximum;

  return (
    <div className="home-stage relative isolate min-h-dvh">
      <div
        data-slot="home-scene"
        className="home-scene-layer pointer-events-none absolute inset-0 z-0"
      >
        {scene}
      </div>
      <div className="home-hud-layer pointer-events-none relative z-10 grid min-h-dvh grid-rows-[auto_minmax(4rem,1fr)_auto] gap-4 p-4 sm:p-6 landscape:gap-2 landscape:p-3 lg:landscape:p-6">
        <header aria-label="Player HUD" className="hud-header">
          <div role="group" aria-label="Player identity" className="hud-player pointer-events-auto">
            <span className="hud-portrait">
              {player.avatarUrl && failedAvatar !== player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setFailedAvatar(player.avatarUrl)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserRound className="size-8" aria-hidden="true" />
              )}
            </span>
            <div className="hud-player-details">
              <span
                className="hud-player-name block truncate font-heading text-sm font-bold lg:text-lg"
                title={player.name}
              >
                {player.name}
              </span>
              <span className="hud-player-caption block text-[0.625rem] tracking-wider uppercase">
                Level {level}
              </span>
              <div
                className="hud-experience-track"
                role={hasExperience ? "meter" : "img"}
                aria-label={hasExperience ? "Player experience" : "Player experience unavailable"}
                aria-valuemin={hasExperience ? 0 : undefined}
                aria-valuemax={hasExperience ? experience.maximum : undefined}
                aria-valuenow={hasExperience ? experience.value : undefined}
              >
                {hasExperience && (
                  <span style={{ width: `${(experience.value / experience.maximum) * 100}%` }} />
                )}
              </div>
            </div>
          </div>
          <div aria-label="Resources" role="group" className="hud-resources">
            <HudResource
              label="Energy"
              icon={Zap}
              appearance="energy"
              value={energy?.value}
              maximum={energy?.maximum}
              bounded
            />
            <HudResource label="Coins" icon={Coins} value={coins} appearance="coins" />
            <HudResource label="Diamonds" icon={Diamond} value={diamonds} appearance="diamonds" />
          </div>
          <div className="hud-header-tools">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              aria-label="Messages (coming soon)"
              aria-describedby="home-planned-messaging"
              className="hud-settings-trigger hud-mail disabled:opacity-100"
            >
              <Mail className="size-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onSettings}
              aria-label="Settings"
              className="hud-settings-trigger pointer-events-auto"
            >
              <Settings className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </header>
        <div
          data-slot="home-scene-space"
          className="relative flex min-h-0 items-center justify-center py-6 landscape:py-0"
        >
          {children}
        </div>
        <footer className="hud-footer">
          <p id="home-planned-messaging" className="sr-only">
            Messaging and chat are not available yet.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label="Chat (coming soon)"
            aria-describedby="home-planned-messaging"
            className="hud-settings-trigger hud-chat disabled:opacity-100"
          >
            <MessageCircle className="size-6" aria-hidden="true" />
          </Button>
          <nav aria-label="Player systems" className="hud-shortcuts">
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
                data-system={label.toLowerCase()}
                className="hud-shortcut relative h-auto flex-col gap-0 rounded-none border-0 p-0 whitespace-normal disabled:opacity-100"
              >
                <span className="hud-shortcut-emblem relative flex items-center justify-center rounded-full">
                  <Icon className="size-6 lg:size-8" aria-hidden="true" />
                  <span className="hud-shortcut-lock absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full">
                    <LockKeyhole className="size-3" aria-hidden="true" />
                  </span>
                </span>
                <span className="hud-shortcut-name font-heading font-semibold">{label}</span>
              </Button>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
}
