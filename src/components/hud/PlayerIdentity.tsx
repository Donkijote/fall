import gsap from "gsap";
import { useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { Icon } from "../icons/Icon";
import "./PlayerIdentity.css";
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

  const fill = useRef<HTMLSpanElement>(null);
  const crest = useRef<HTMLSpanElement>(null);
  const previous = useRef<{ level: number | undefined; percent?: number; ready: boolean }>({
    level,
    ready: false,
  });
  const reduced = useReducedMotion();
  const motion = useRef<gsap.core.Timeline | null>(null);
  const percent = hasExperience ? (experience.value / experience.maximum) * 100 : undefined;
  useGSAP(
    () => {
      motion.current?.kill();
      const old = previous.current;
      previous.current = { level, percent, ready: true };
      const levelChanged = old.ready && old.level !== level;
      const timeline = (motion.current = gsap.timeline());
      if (reduced && crest.current) gsap.set(crest.current, { clearProps: "filter" });
      if (fill.current && percent !== undefined) {
        if (!old.ready || old.percent === undefined || reduced)
          gsap.set(fill.current, { width: `${percent}%` });
        else {
          if (levelChanged) gsap.set(fill.current, { width: "0%" });
          timeline.to(fill.current, { width: `${percent}%`, duration: 0.3, ease: "power2.out" }, 0);
        }
      }
      if (
        crest.current &&
        levelChanged &&
        hasLevel &&
        old.level !== undefined &&
        level > old.level &&
        !reduced
      ) {
        timeline.fromTo(
          crest.current,
          { filter: "brightness(1.8)" },
          {
            filter: "brightness(1)",
            duration: 0.35,
            clearProps: "filter",
          },
          0,
        );
      }
      return () => {
        timeline.kill();
      };
    },
    { dependencies: [percent, level, reduced] },
  );

  return (
    <div
      className="game-player relative isolate flex min-w-0 items-center gap-(--player-gap) [--player-gap:0.375rem] [--player-portrait-width:clamp(44px,5vw,78px)] sm:[--player-gap:clamp(0.6rem,1vw,1rem)] portrait:[--player-portrait-width:2.75rem] compact-landscape:[--player-portrait-width:2.75rem]"
      role="group"
      aria-label="Player identity"
    >
      <ProfileButton
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
        <span
          className="h-1.5 w-full overflow-hidden rounded-full border border-gold/50 bg-artwork-shadow/75"
          role={hasExperience ? "meter" : "img"}
          aria-label={hasExperience ? "Experience" : "Experience unavailable"}
          aria-valuemin={hasExperience ? 0 : undefined}
          aria-valuemax={hasExperience ? experience.maximum : undefined}
          aria-valuenow={hasExperience ? experience.value : undefined}
        >
          {hasExperience && (
            <span
              className="block h-full rounded-full bg-linear-to-r from-gold to-artwork-foreground"
              ref={fill}
            />
          )}
        </span>
      </span>
    </div>
  );
}
