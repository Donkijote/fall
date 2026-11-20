import gsap from "gsap";
import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import appEmblem from "@/assets/branding/wingfoot.svg";
import { ActivityCard, PlayerIdentity, ResourceReadout } from "@/components";
import type { PlayerIdentityProps } from "@/components";
import { Icon } from "@/components/icons/Icon";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { cardHallArtwork, homeActivities } from "./cardHallArtwork";
import { cardHallIcons } from "./cardHallIcons";
import { PlayerSystemsDock } from "./components/navigation/PlayerSystemsDock";
import { HomeUtilities } from "./HomeUtilities";

function isTouchFirstDevice() {
  return window.matchMedia?.("(hover: none), (pointer: coarse)").matches ?? false;
}

export type CardHallProps = {
  player: Pick<PlayerIdentityProps, "name" | "avatarUrl" | "level" | "experience">;
  resources?: {
    energy?: { value: number; maximum: number };
    coins?: number;
    diamonds?: number;
  };
  canPlay: boolean;
  onPlay: (trigger: HTMLButtonElement) => void;
  onSettings: () => void;
};

export function CardHall({ player, resources, canPlay, onPlay, onSettings }: CardHallProps) {
  const reducedMotion = useReducedMotion();
  const [touchFocusedId, setTouchFocusedId] = useState<
    (typeof homeActivities)[number]["id"] | null
  >(null);
  const touchPointer = useRef(false);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const backdropRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia || reducedMotion) return;
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
    { scope: backdropRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  function focusActivity(index: number) {
    const card = cardRefs.current[index];
    card?.focus({ preventScroll: true });
    const list = card?.parentElement;
    if (list && list.scrollWidth > list.clientWidth)
      card?.scrollIntoView?.({ block: "nearest", inline: "center", behavior: "instant" });
  }

  function activateActivity(event: MouseEvent<HTMLButtonElement>, index: number) {
    const activity = homeActivities[index];
    const pointerType = "pointerType" in event.nativeEvent ? event.nativeEvent.pointerType : "";
    const isTouch =
      pointerType === "touch" ||
      (event.detail > 0 && (touchPointer.current || isTouchFirstDevice()));
    touchPointer.current = false;

    if (isTouch && touchFocusedId !== activity.id) {
      setTouchFocusedId(activity.id);
      focusActivity(index);
      return;
    }
    if (!activity.available || !canPlay) return;

    setTouchFocusedId(null);
    event.currentTarget.focus({ preventScroll: true });
    onPlay(event.currentTarget);
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
    setTouchFocusedId(null);
    focusActivity(nextIndex);
  }

  return (
    <div
      className="card-hall relative isolate grid min-h-dvh grid-rows-[auto_1fr_auto] bg-background text-foreground [--hall-card-height:min(55dvh,calc(100dvh_-_9.85rem_-_var(--safe-area-top)_-_var(--safe-area-bottom)),calc((var(--hall-safe-width)_-_7rem)/2))] [--hall-gutter:0.375rem] [--hall-safe-width:calc(100vw_-_var(--safe-area-left)_-_var(--safe-area-right))] lg:[--hall-card-height:min(44dvh,440px,calc((var(--hall-safe-width)_-_8rem)/2))] lg:[--hall-gutter:clamp(1rem,2.6vw,3rem)]"
      data-slot="card-hall"
      onPointerDown={(event) => {
        touchPointer.current =
          (event.pointerType === "touch" || isTouchFirstDevice()) &&
          event.target instanceof Element &&
          Boolean(event.target.closest('[data-slot="game-activity-card"]'));
        if (!touchPointer.current) setTouchFocusedId(null);
      }}
      onPointerCancel={() => {
        touchPointer.current = false;
      }}
    >
      <div
        ref={backdropRef}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div data-hall-painting="" className="absolute inset-0 isolate">
          <div className="absolute inset-0">
            <img
              className="card-hall-backdrop block size-full object-cover object-[center_54%]"
              aria-hidden="true"
              src={cardHallArtwork.hall}
              width={1683}
              height={935}
              alt=""
            />
          </div>
          <div data-hall-light-plane="" className="absolute inset-0 mix-blend-screen">
            <span
              data-hall-light=""
              hidden={reducedMotion}
              className="absolute top-0 left-[4%] h-[70%] w-[42%] bg-[radial-gradient(ellipse_at_33%_35%,var(--artwork-foreground),transparent_68%)] opacity-0 motion-reduce:hidden"
            />
            <span
              data-hall-light=""
              hidden={reducedMotion}
              className="absolute top-[58%] left-[7%] h-[32%] w-[44%] bg-[radial-gradient(ellipse,var(--artwork-foreground),transparent_65%)] opacity-0 motion-reduce:hidden"
            />
          </div>
        </div>
      </div>
      <header
        className="card-hall-header grid grid-cols-[minmax(0,1fr)_auto_minmax(max-content,1fr)] items-center gap-4 gap-x-6 pt-[calc(var(--hall-header-top)+var(--safe-area-top))] pr-[calc(var(--hall-gutter)+var(--safe-area-right))] pb-0 pl-[calc(var(--hall-gutter)+var(--safe-area-left))] text-artwork-foreground [--hall-header-top:0.25rem] [text-shadow:0_1px_4px_var(--artwork-shadow)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start lg:pb-3 lg:[--hall-header-top:1rem]"
        aria-label="Player HUD"
      >
        <PlayerIdentity
          {...player}
          fallbackAvatarUrl={cardHallArtwork.traveller}
          levelCrestUrl={cardHallIcons.level}
        />
        <h1 className="card-hall-wordmark m-0 flex items-center gap-[0.3em] artwork-title text-[clamp(1.25rem,3.4vw,1.8rem)] whitespace-nowrap lg:text-[clamp(2rem,3.5vw,3.4rem)]">
          <Icon
            icon={appEmblem}
            className="size-[0.8em] text-gold drop-shadow-sm drop-shadow-artwork-shadow"
          />
          The Fall
        </h1>
        <div
          role="group"
          aria-label="Resources"
          className="flex justify-end gap-1 self-center lg:gap-4"
        >
          <ResourceReadout
            label="Energy"
            icon={cardHallIcons.energy}
            iconClassName="text-amber-300"
            value={resources?.energy?.value}
            maximum={resources?.energy?.maximum}
          />
          <ResourceReadout label="Coins" icon={cardHallIcons.coins} value={resources?.coins} />
          <ResourceReadout
            label="Diamonds"
            icon={cardHallIcons.diamonds}
            iconClassName="text-cyan-200"
            value={resources?.diamonds}
          />
        </div>
      </header>
      <div className="card-hall-stage grid min-w-0 content-center py-0.5 pr-(--safe-area-right) pl-(--safe-area-left) lg:py-3">
        <div
          className="card-hall-activities mx-auto grid min-h-[calc(var(--hall-card-height)*1.1+1.5rem)] w-fit max-w-full [scrollbar-width:none] grid-cols-[repeat(3,calc(var(--hall-card-height)*2/3))] items-center gap-[clamp(1.2rem,2.4vw,2.6rem)] p-8 py-3 lg:min-h-[calc(var(--hall-card-height)*1.1+4rem)] [&::-webkit-scrollbar]:hidden [&>.game-activity-card]:h-(--hall-card-height)"
          role="group"
          aria-label="Activities"
          aria-describedby="card-hall-selection-help"
        >
          {homeActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              title={activity.title}
              imageUrl={activity.imageUrl}
              frameUrl={activity.frameUrl}
              imageWidth={activity.imageWidth}
              imageHeight={activity.imageHeight}
              caption={activity.available ? undefined : "Coming soon"}
              selected={touchFocusedId === activity.id}
              unavailable={!activity.available}
              disabled={activity.available && !canPlay}
              aria-label={activity.title}
              aria-haspopup={activity.available ? "dialog" : undefined}
              aria-pressed={undefined}
              className="touch-manipulation"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && !isTouchFirstDevice()) {
                  setTouchFocusedId(null);
                }
              }}
              onClick={(event) => activateActivity(event, index)}
              onKeyDown={(event) => navigateActivities(event, index)}
            />
          ))}
        </div>
        <p id="card-hall-selection-help" className="sr-only">
          Click an activity to open it. On touch screens, tap once to focus and tap again to open.
          Use arrow keys to move between cards and Enter or Space to open. Campaign and Arena are
          coming soon.
        </p>
      </div>
      <p role="status" className="sr-only">
        {touchFocusedId === "tavern" ? "Tavern focused." : ""}
      </p>
      <footer className="flex flex-wrap items-end justify-between gap-1 pt-1 pr-[calc(var(--hall-gutter)+var(--safe-area-right))] pb-[calc(var(--hall-footer-bottom)+var(--safe-area-bottom))] pl-[calc(var(--hall-gutter)+var(--safe-area-left))] [--hall-footer-bottom:0.125rem] lg:[--hall-footer-bottom:0.75rem] [&>nav:last-child]:ml-auto">
        <PlayerSystemsDock />
        <HomeUtilities onSettings={onSettings} />
      </footer>
    </div>
  );
}
