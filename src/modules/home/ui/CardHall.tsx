import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import {
  GameActivityCard,
  GameButton,
  GameNavigation,
  GamePlayerIdentity,
  GameResource,
} from "@/components/game";
import type { GameNavigationItem, GamePlayerIdentityProps } from "@/components/game";

import { useGSAP } from "@gsap/react";

import { cardHallArtwork, homeActivities } from "./cardHallArtwork";
import { cardHallIcons } from "./cardHallIcons";

const playerSystems: { label: string; items: GameNavigationItem[] }[] = [
  {
    label: "Character and progress",
    items: [
      { id: "hero", label: "Hero", icon: cardHallIcons.hero },
      { id: "collection", label: "Collection", icon: cardHallIcons.collection },
      { id: "journal", label: "Journal", icon: cardHallIcons.journal },
    ],
  },
  {
    label: "Guild and trade",
    items: [
      { id: "guild", label: "Guild", icon: cardHallIcons.guild },
      { id: "market", label: "Market", icon: cardHallIcons.market },
    ],
  },
].map(({ label, items }) => ({
  label,
  items: items.map((item) => ({ ...item, disabled: true, unavailableLabel: "coming soon" })),
}));

export type CardHallProps = {
  player: Pick<GamePlayerIdentityProps, "name" | "avatarUrl" | "level" | "experience">;
  resources?: {
    energy?: { value: number; maximum: number };
    coins?: number;
    diamonds?: number;
  };
  canPlay: boolean;
  onPlay: () => void;
  onSettings: () => void;
};

export function CardHall({ player, resources, canPlay, onPlay, onSettings }: CardHallProps) {
  const [selectedId, setSelectedId] = useState<(typeof homeActivities)[number]["id"]>("tavern");
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const selectedActivity = homeActivities.find(({ id }) => id === selectedId)!;

  useGSAP(
    () => {
      if (!window.matchMedia) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const random = gsap.utils.random;
        backdropRef.current?.querySelectorAll("[data-hall-light]").forEach((light) => {
          gsap
            .fromTo(
              light,
              { opacity: 0.04, scale: 0.94, xPercent: -3 },
              {
                opacity: random(0.16, 0.24),
                scale: random(1.04, 1.14),
                xPercent: random(3, 7),
                duration: random(4, 8),
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              },
            )
            .progress(random(0, 1));
        });
      });
      media.add("(prefers-reduced-motion: no-preference) and (any-pointer: fine)", () => {
        const backdrop = backdropRef.current;
        const hall = backdrop?.parentElement;
        const painting = backdrop?.querySelector<HTMLElement>("[data-hall-painting]");
        const lights = backdrop?.querySelector<HTMLElement>("[data-hall-light-plane]");
        if (!hall || !painting || !lights) return;

        const easing = { duration: 0.7, ease: "power3.out" };
        // Give the artwork enough bleed to cover the viewport at either end of the drift.
        gsap.set(painting, { inset: "-10px -14px" });
        function translate(layer: HTMLElement) {
          const moveX = gsap.quickTo(layer, "x", easing);
          const moveY = gsap.quickTo(layer, "y", easing);
          return (x: number, y: number) => {
            moveX(x);
            moveY(y);
          };
        }
        const movePainting = translate(painting);
        const moveLights = translate(lights);

        const move = (x: number, y: number) => {
          movePainting(x * 13, y * 9);
          moveLights(x * 11, y * 8);
        };

        const track = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = hall.getBoundingClientRect();
          const x = gsap.utils.clamp(-1, 1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1);
          const y = gsap.utils.clamp(-1, 1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1);
          move(x, y);
        };
        const reset = () => move(0, 0);
        hall.addEventListener("pointermove", track);
        hall.addEventListener("pointerleave", reset);
        hall.addEventListener("pointercancel", reset);
        return () => {
          hall.removeEventListener("pointermove", track);
          hall.removeEventListener("pointerleave", reset);
          hall.removeEventListener("pointercancel", reset);
        };
      });
      return () => media.revert();
    },
    { scope: backdropRef },
  );

  function selectActivity(index: number, focus = false) {
    setSelectedId(homeActivities[index].id);
    const card = cardRefs.current[index];
    if (focus) card?.focus({ preventScroll: true });
    const list = card?.parentElement;
    if (list && list.scrollWidth > list.clientWidth)
      card?.scrollIntoView?.({ block: "nearest", inline: "center", behavior: "instant" });
  }

  function navigateActivities(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % homeActivities.length
        : event.key === "ArrowLeft"
          ? (index + homeActivities.length - 1) % homeActivities.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? homeActivities.length - 1
              : undefined;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectActivity(nextIndex, true);
  }

  return (
    <div
      className="card-hall relative isolate grid min-h-dvh grid-rows-[auto_1fr_auto_auto] bg-background text-foreground [--hall-card-height:min(44dvh,440px,calc((100vw_-_8rem)/2))] portrait:[--hall-card-height:min(40dvh,340px,calc((100vw_-_5rem)*1.5))] compact-landscape:[--hall-card-height:max(110px,min(43dvh,calc(100dvh_-_13rem)))] compact-portrait:[--hall-card-height:min(33dvh,240px,calc((100vw_-_5rem)*1.5))]"
      data-slot="card-hall"
    >
      <div
        ref={backdropRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div data-hall-painting="" className="absolute inset-0 isolate">
          <picture className="absolute inset-0">
            <source media="(max-aspect-ratio: 3/5)" srcSet={cardHallArtwork.hallPhone} />
            <source media="(max-aspect-ratio: 5/4)" srcSet={cardHallArtwork.hallTablet} />
            <img
              className="card-hall-backdrop block size-full object-cover object-[center_54%]"
              aria-hidden="true"
              src={cardHallArtwork.hall}
              width={1683}
              height={935}
              alt=""
            />
          </picture>
          <div data-hall-light-plane="" className="absolute inset-0 mix-blend-screen">
            <span
              data-hall-light=""
              className="absolute top-0 left-[4%] h-[70%] w-[42%] bg-[radial-gradient(ellipse_at_33%_35%,var(--artwork-foreground),transparent_68%)] opacity-0 motion-reduce:hidden"
            />
            <span
              data-hall-light=""
              className="absolute top-[58%] left-[7%] h-[32%] w-[44%] bg-[radial-gradient(ellipse,var(--artwork-foreground),transparent_65%)] opacity-0 motion-reduce:hidden"
            />
          </div>
        </div>
      </div>
      <header
        className="card-hall-header grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-4 px-[clamp(1rem,2.6vw,3rem)] pt-[max(1rem,env(safe-area-inset-top))] pb-3 text-artwork-foreground [text-shadow:0_1px_4px_var(--artwork-shadow)] max-[480px]:grid-cols-[minmax(0,1fr)_auto] portrait:gap-1.5 portrait:px-3 portrait:pt-[max(0.7rem,env(safe-area-inset-top))] portrait:pb-2 compact-landscape:items-center compact-landscape:px-4 compact-landscape:pt-[max(0.25rem,env(safe-area-inset-top))] compact-landscape:pb-0"
        aria-label="Player HUD"
      >
        <GamePlayerIdentity
          {...player}
          fallbackAvatarUrl={cardHallArtwork.traveller}
          levelCrestUrl={cardHallIcons.level}
        />
        <h1 className="card-hall-wordmark m-0 font-heading text-[clamp(2rem,3.5vw,3.4rem)] leading-tight font-semibold tracking-[0.08em] max-[480px]:col-span-2 max-[480px]:row-start-2 max-[480px]:justify-self-center portrait:text-[1.65rem] compact-landscape:text-[1.8rem]">
          THE FALL
        </h1>
        <div
          role="group"
          aria-label="Resources"
          className="flex justify-end gap-1.5 self-center max-[480px]:col-start-2 max-[480px]:row-start-1 sm:gap-4"
        >
          <GameResource
            label="Energy"
            icon={cardHallIcons.energy}
            iconClassName="text-resource-energy"
            value={resources?.energy?.value}
            maximum={resources?.energy?.maximum}
          />
          <GameResource label="Coins" icon={cardHallIcons.coins} value={resources?.coins} />
          <GameResource
            label="Diamonds"
            icon={cardHallIcons.diamonds}
            iconClassName="text-resource-diamonds"
            value={resources?.diamonds}
          />
        </div>
      </header>
      <div className="card-hall-stage grid min-w-0 content-center py-3 compact-landscape:py-0.5">
        <div
          className="card-hall-activities mx-auto grid min-h-[calc(var(--hall-card-height)*1.1+4rem)] w-fit max-w-full [scrollbar-width:none] grid-cols-[repeat(3,calc(var(--hall-card-height)*2/3))] items-center gap-[clamp(1.2rem,2.4vw,2.6rem)] p-8 portrait:w-full portrait:snap-x portrait:snap-proximity portrait:scroll-px-10 portrait:auto-cols-[calc(var(--hall-card-height)*2/3)] portrait:grid-flow-col portrait:grid-cols-none portrait:justify-start portrait:gap-6 portrait:overflow-x-auto portrait:overscroll-x-contain portrait:px-10 compact-landscape:min-h-[calc(var(--hall-card-height)*1.1+1.5rem)] compact-landscape:py-3 compact-portrait:min-h-[calc(var(--hall-card-height)*1.1+2rem)] compact-portrait:py-4 [&::-webkit-scrollbar]:hidden [&>.game-activity-card]:h-(--hall-card-height) [&>.game-activity-card]:snap-center"
          role="group"
          aria-label="Activities"
          aria-describedby="card-hall-selection-help"
        >
          {homeActivities.map((activity, index) => (
            <GameActivityCard
              key={activity.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              title={activity.title}
              imageUrl={activity.imageUrl}
              imageWidth={activity.imageWidth}
              imageHeight={activity.imageHeight}
              caption={activity.available ? undefined : "Coming soon"}
              selected={activity.id === selectedId}
              unavailable={!activity.available}
              aria-label={`Select ${activity.title}`}
              onClick={() => selectActivity(index)}
              onKeyDown={(event) => navigateActivities(event, index)}
            />
          ))}
        </div>
        <p id="card-hall-selection-help" className="sr-only">
          Choose an activity, then use the action below. Arrow keys change the selection. Campaign
          and Arena are coming soon.
        </p>
      </div>
      <section
        className="card-hall-actions mx-auto grid w-full max-w-395 justify-items-center px-4 pt-5 pb-9 portrait:py-4 compact-landscape:py-2 compact-portrait:py-2.5"
        aria-label="Selected activity"
      >
        <div className="card-hall-primary w-full max-w-112.5 compact-landscape:max-w-80">
          <GameButton
            tone="primary"
            className="w-full [&_svg]:size-[1.2em]"
            disabled={!canPlay || !selectedActivity.available}
            aria-label={
              selectedActivity.available
                ? "Play at the tavern"
                : `${selectedActivity.title} (coming soon)`
            }
            onClick={() => {
              if (canPlay && selectedActivity.available) onPlay();
            }}
          >
            {selectedActivity.available
              ? "Play at the tavern"
              : `${selectedActivity.title} coming soon`}
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </GameButton>
          <span className="sr-only" role="status">
            {selectedActivity.title} selected.{" "}
            {selectedActivity.available ? "Caída is available." : "This activity is coming soon."}
          </span>
        </div>
      </section>
      <footer className="flex items-end justify-between gap-1 px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] compact-landscape:px-3 compact-landscape:pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <GameNavigation label="Player systems" groups={playerSystems} />
        <GameNavigation
          label="Utilities"
          groups={[
            {
              label: "Messages and settings",
              items: [
                {
                  id: "messages",
                  label: "Messages",
                  icon: cardHallIcons.messages,
                  disabled: true,
                  unavailableLabel: "coming soon",
                },
                {
                  id: "settings",
                  label: "Settings",
                  icon: cardHallIcons.settings,
                  onClick: onSettings,
                },
              ],
            },
          ]}
        />
      </footer>
    </div>
  );
}
