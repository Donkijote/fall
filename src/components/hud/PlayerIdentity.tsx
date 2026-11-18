import gsap from "gsap";
import { useRef, useState } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { Icon } from "../icons/Icon";
import "./PlayerIdentity.css";
import { ExperienceMeter } from "./ExperienceMeter";
import { ProfileButton } from "./ProfileButton";

const formatExperience = new Intl.NumberFormat();

export type PlayerIdentityProps = {
  name: string;
  avatarUrl?: string;
  fallbackAvatarUrl?: string;
  levelCrestUrl?: string;
  level?: number;
  experience?: { value: number; maximum: number };
  onProfileClick?: () => void;
};

export function PlayerIdentity({
  name,
  avatarUrl,
  fallbackAvatarUrl,
  levelCrestUrl,
  level,
  experience,
  onProfileClick,
}: PlayerIdentityProps) {
  const hasLevel = level !== undefined && Number.isInteger(level) && level > 0;
  const hasExperience =
    experience &&
    Number.isFinite(experience.value) &&
    Number.isFinite(experience.maximum) &&
    experience.maximum > 0 &&
    experience.value >= 0 &&
    experience.value <= experience.maximum;

  const crest = useRef<HTMLSpanElement>(null);
  const identity = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const previousLevel = useRef(level);
  const attentionMotion = useRef<gsap.core.Tween | null>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const old = previousLevel.current;
      previousLevel.current = level;
      if (!crest.current || reduced || old === undefined || !hasLevel || level <= old) return;
      gsap.fromTo(
        crest.current,
        { filter: "brightness(1.8)" },
        {
          filter: "brightness(1)",
          duration: 0.5,
          clearProps: "filter",
        },
      );
    },
    { dependencies: [level, reduced], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      attentionMotion.current?.kill();
      attentionMotion.current = gsap.to(identity.current, {
        "--identity-attention": hovered || focused ? 1 : 0,
        duration: reduced ? 0 : 0.18,
        overwrite: "auto",
      });
    },
    { dependencies: [hovered, focused, reduced] },
  );

  return (
    <div
      ref={identity}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
      onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className="game-player relative isolate flex min-w-0 items-center gap-(--player-gap) [--player-gap:0.375rem] [--player-portrait-width:clamp(44px,5vw,78px)] sm:[--player-gap:clamp(0.6rem,1vw,1rem)] portrait:[--player-portrait-width:2.75rem] compact-landscape:[--player-portrait-width:2.75rem]"
      role="group"
      aria-label="Player identity"
    >
      <ProfileButton
        attention={hovered || focused}
        avatarUrl={avatarUrl}
        fallbackAvatarUrl={fallbackAvatarUrl}
        onClick={onProfileClick}
      />
      <span className="game-player-copy relative grid w-full max-w-40 min-w-0 gap-0.5 portrait:max-w-[17ch]">
        <span className="flex min-w-0 items-center gap-1">
          <span className="grid min-w-0">
            <span
              className="game-player-name max-w-[22ch] truncate text-[clamp(1rem,1.55vw,1.5rem)] font-semibold portrait:text-sm compact-landscape:text-sm"
              title={name}
            >
              {name}
            </span>
            <span
              ref={!levelCrestUrl ? crest : undefined}
              className={levelCrestUrl ? "sr-only" : "text-xs font-semibold"}
            >
              Level {hasLevel ? level : "—"}
            </span>
            {hasExperience && (
              <span
                aria-hidden="true"
                className="truncate text-[0.625rem] leading-tight font-semibold tabular-nums sm:text-xs"
              >
                {formatExperience.format(experience.value)} /{" "}
                {formatExperience.format(experience.maximum)} XP
              </span>
            )}
          </span>
          {levelCrestUrl && (
            <span
              ref={crest}
              className="relative isolate grid size-10 shrink-0 place-items-center text-artwork-foreground drop-shadow-[0_2px_2px_var(--artwork-shadow)] md:size-12 compact-landscape:size-9"
              title={hasLevel ? `Level ${level}` : "Level unavailable"}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-b from-sky-800 to-artwork-shadow [clip-path:polygon(18%_8%,82%_8%,82%_75%,50%_92%,18%_75%)]"
              />
              <Icon icon={levelCrestUrl} className="absolute inset-0 -z-10 size-full bg-gold" />
              <span
                aria-hidden="true"
                className="-translate-y-0.5 font-heading text-sm leading-none font-bold tabular-nums md:text-base compact-landscape:text-xs"
              >
                {hasLevel ? level : "—"}
              </span>
            </span>
          )}
        </span>
        <ExperienceMeter
          value={hasExperience ? experience.value : undefined}
          maximum={hasExperience ? experience.maximum : undefined}
          level={level}
        />
      </span>
    </div>
  );
}
