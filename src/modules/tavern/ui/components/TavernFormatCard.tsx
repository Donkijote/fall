import { useId, useRef, useState } from "react";

import { CardBorderGlint } from "@/components/cards/CardBorderGlint";
import { frameClassName } from "@/components/surfaces/surfaceStyles";
import type { GameMode } from "@/domain/entities/GameState";

import { useTavernCardMotion } from "./useTavernCardMotion";

const layout =
  "grid grid-cols-[minmax(4rem,0.47fr)_minmax(0,1fr)] items-center landscape:grid-cols-1 landscape:content-start";
const artBox =
  "relative block aspect-2/3 w-full landscape:aspect-auto landscape:h-(--tavern-card-height)";
const ribbonBox =
  "relative -ml-px h-20 w-[92%] min-w-0 landscape:mx-auto landscape:-mt-px landscape:h-14 landscape:w-[84%] compact-landscape:h-12";

type TavernFormatCardProps = {
  mode: GameMode;
  title: string;
  players: string;
  description: string;
  artwork: string;
  selected: boolean;
  onTouchFocus: (selected: boolean) => void;
  onActivate: () => void;
};

export function TavernFormatCard({
  mode,
  title,
  players,
  description,
  artwork,
  selected,
  onTouchFocus,
  onActivate,
}: TavernFormatCardProps) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const touchPointer = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused || selected;
  useTavernCardMotion(button, active);

  return (
    <button
      type="button"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-players ${id}-description`}
      ref={button}
      data-tavern-card=""
      data-tavern-mode={mode}
      data-active={active}
      data-selected={selected}
      onPointerDown={(event) => {
        touchPointer.current = event.pointerType === "touch";
      }}
      onPointerCancel={() => {
        touchPointer.current = false;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onClick={(event) => {
        const pointerType = "pointerType" in event.nativeEvent ? event.nativeEvent.pointerType : "";
        const isTouch =
          pointerType === "touch" ||
          (event.detail > 0 &&
            (touchPointer.current ||
              window.matchMedia?.("(hover: none), (pointer: coarse)").matches));
        touchPointer.current = false;
        if (isTouch && !selected) {
          event.preventDefault();
          onTouchFocus(true);
          event.currentTarget.focus({ preventScroll: true });
          return;
        }
        onTouchFocus(false);
        onActivate();
      }}
      className="group relative isolate min-w-0 cursor-pointer touch-manipulation rounded-md text-center outline-none select-none [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:brightness-95"
    >
      <span data-tavern-card-idle="" className="block">
        <span data-tavern-card-attention="" className={layout}>
          <span className={`${artBox} z-10 rounded-md`}>
            <span
              className={`${frameClassName} absolute inset-0 overflow-hidden rounded-md bg-card shadow-lg shadow-artwork-shadow/45 group-data-[active=true]:border-gold`}
            >
              <img
                src={artwork}
                alt=""
                width={1024}
                height={1536}
                decoding="async"
                draggable={false}
                className="pointer-events-none absolute inset-0 size-full object-cover"
              />
              <span
                aria-hidden="true"
                data-tavern-card-light=""
                className="pointer-events-none absolute -inset-y-8 -left-1/2 w-1/2 rotate-12 bg-linear-to-r from-transparent via-gold/35 to-transparent opacity-0 mix-blend-screen"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-artwork-shadow/85 via-artwork-shadow/60 to-transparent px-1 pt-5 pb-[7%] artwork-title text-[clamp(0.85rem,1.75vw,1.55rem)] leading-tight landscape:block compact-landscape:pt-4 compact-landscape:pb-[6%]"
              >
                {title}
              </span>
            </span>
            <CardBorderGlint active={active} className="brightness-125" />
          </span>
          <span
            className={`${ribbonBox} isolate grid content-center gap-0.5 px-2.5 text-left text-card-foreground landscape:justify-items-center landscape:px-1.5 landscape:text-center compact-landscape:gap-0`}
          >
            <span
              aria-hidden="true"
              className="absolute -inset-x-0.5 top-0.5 -z-10 hidden h-3 bg-gold/45 landscape:block landscape:[clip-path:polygon(0_0,100%_0,97%_100%,3%_100%)]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-r-md bg-gold/70 landscape:rounded-none landscape:[clip-path:polygon(0_0,100%_0,100%_86%,95%_100%,5%_100%,0_86%)]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-px -z-10 rounded-r-md bg-card landscape:rounded-none landscape:[clip-path:polygon(0_0,100%_0,100%_86%,95%_100%,5%_100%,0_86%)]"
            />
            <span id={`${id}-title`} className="title-type text-sm landscape:sr-only">
              {title}
            </span>
            <span id={`${id}-players`} className="text-sm font-semibold compact-landscape:text-xs">
              {players}
            </span>
            <span
              id={`${id}-description`}
              className="text-xs leading-tight text-muted-foreground compact-landscape:text-[0.7rem]"
            >
              {description}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
