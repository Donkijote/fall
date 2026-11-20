import { useId, useRef, useState } from "react";

import duelFrame from "@/assets/lobby/tavern/duel-frame.webp";
import freeForAllFrame from "@/assets/lobby/tavern/free-for-all-frame.webp";
import teamMatchFrame from "@/assets/lobby/tavern/team-match-frame.webp";
import type { GameMode } from "@/domain/entities/GameState";

import { useTavernCardMotion } from "./useTavernCardMotion";
import "./TavernFormatCard.css";

const modeFrames: Record<GameMode, string> = {
  "1vs1": duelFrame,
  "1vs2": freeForAllFrame,
  "2vs2": teamMatchFrame,
};

const layout = "grid items-center grid-cols-1 content-start";
const artBox = "relative block w-full aspect-auto h-(--tavern-card-height)";
const ribbonBox = "relative min-w-0 mx-auto -mt-px w-[84%] h-12 lg:h-14";

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
      <span className={layout}>
        <span className={`${artBox} z-10 rounded-md`}>
          <span data-tavern-card-idle="" className="absolute inset-0">
            <span data-tavern-card-attention="" className="absolute inset-0">
              <span className="absolute inset-[1.5%] overflow-hidden rounded-[7%] bg-card shadow-lg shadow-artwork-shadow/45">
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
                  className="absolute inset-x-0 bottom-0 block bg-linear-to-t from-artwork-shadow/85 via-artwork-shadow/60 to-transparent px-1 pt-4 pb-[6%] artwork-title text-[clamp(0.85rem,1.75vw,1.55rem)] leading-tight lg:pt-5 lg:pb-[7%]"
                >
                  {title}
                </span>
              </span>
              <img
                src={modeFrames[mode]}
                alt=""
                data-tavern-card-frame=""
                draggable={false}
                className="pointer-events-none absolute inset-0 size-full"
              />
            </span>
          </span>
        </span>
        <span
          className={`${ribbonBox} tavern-format-ribbon isolate grid content-center justify-items-center gap-0 px-4 text-center text-artwork-foreground lg:gap-0.5`}
        >
          <span id={`${id}-title`} className="sr-only title-type text-sm">
            {title}
          </span>
          <span id={`${id}-players`} className="text-xs leading-tight font-semibold lg:text-sm">
            {players}
          </span>
          <span
            id={`${id}-description`}
            className="text-[0.7rem] leading-tight text-artwork-foreground/85 lg:text-xs"
          >
            {description}
          </span>
        </span>
      </span>
    </button>
  );
}
