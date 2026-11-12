import { useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";

import duel from "@/assets/lobby/tavern/duel.webp";
import freeForAll from "@/assets/lobby/tavern/free-for-all.webp";
import teamMatch from "@/assets/lobby/tavern/team-match.webp";
import { HallReturnAction } from "@/components/navigation/HallReturnAction";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GameMode } from "@/domain/entities/GameState";
import { GAME_PATH, PREVIEW_MATCH_ID } from "@/routes/Routes";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { TavernFormatCard } from "./components/TavernFormatCard";
import { TavernRoom } from "./components/TavernRoom";
import { useMatchTravel } from "./components/useMatchTravel";
import { useTavernMotion } from "./components/useTavernMotion";

const formats = [
  {
    mode: "1vs1",
    title: "Duel",
    players: "2 players",
    description: "Face one opponent.",
    artwork: duel,
  },
  {
    mode: "1vs2",
    title: "Free-for-All",
    players: "3 players",
    description: "Everyone plays solo.",
    artwork: freeForAll,
  },
  {
    mode: "2vs2",
    title: "Team Match",
    players: "4 players",
    description: "Play two against two.",
    artwork: teamMatch,
  },
] as const satisfies {
  mode: GameMode;
  title: string;
  players: string;
  description: string;
  artwork: string;
}[];

type TavernPickerProps = {
  open: boolean;
  canPlay: boolean;
  origin?: HTMLElement | null;
  onClose: () => void;
};

export function TavernPicker({ open, canPlay, origin, onClose }: TavernPickerProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const openedFromUrl = Boolean(new URLSearchParams(location.search).get("bottomSidebar"));
  const focusMode =
    navigationType === "REPLACE"
      ? formats.find(({ mode }) => mode === location.state?.returnFocusMode)?.mode
      : undefined;
  const { dismiss } = useTavernMotion(popup, origin, Boolean(focusMode));
  const { departing, depart } = useMatchTravel(popup);

  return (
    <Dialog
      open={open && canPlay}
      onOpenChange={(nextOpen, details) => {
        if (nextOpen) return;
        if (departing) {
          details.cancel();
          return;
        }
        dismiss(() => {
          setSelectedFormat(null);
          onClose();
          if (openedFromUrl) {
            const params = new URLSearchParams(location.search);
            params.delete("bottomSidebar");
            navigate({ search: params.toString(), hash: location.hash }, { replace: true });
          }
        });
      }}
    >
      <DialogPortal>
        <DialogPrimitive.Popup
          ref={setPopup}
          initialFocus={
            focusMode
              ? () =>
                  popup?.querySelector<HTMLButtonElement>(`[data-tavern-mode="${focusMode}"]`) ??
                  undefined
              : openedFromUrl
                ? () => popup ?? false
                : undefined
          }
          finalFocus={origin ? () => origin : undefined}
          data-departing={departing}
          className="fixed inset-0 z-50 h-dvh overflow-clip outline-none data-[departing=true]:bg-artwork-shadow"
        >
          <TavernRoom />
          {origin && (
            <div
              data-tavern-zoom=""
              aria-hidden="true"
              inert
              className="pointer-events-none invisible absolute z-10"
            />
          )}
          <div
            data-tavern-picker-content=""
            inert={departing}
            className="relative size-full overflow-y-auto overscroll-contain"
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-[calc(1rem+var(--safe-area-left))] pt-[calc(0.75rem+var(--safe-area-top))] pr-[calc(1rem+var(--safe-area-right))] pb-[calc(1rem+var(--safe-area-bottom))] compact-landscape:pt-[calc(0.25rem+var(--safe-area-top))] compact-landscape:pb-[calc(0.5rem+var(--safe-area-bottom))]">
              <header
                data-tavern-chrome=""
                className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"
              >
                <HallReturnAction
                  overArtwork
                  render={<DialogClose />}
                  className="justify-self-start max-[420px]:px-2.5 compact-landscape:py-1 max-[375px]:[&_[data-hall-return-label]]:sr-only"
                />
                <DialogTitle className="artwork-title text-[clamp(1.5rem,4vw,3.35rem)] font-normal compact-landscape:text-2xl">
                  Tavern
                </DialogTitle>
                <DialogDescription className="sr-only">Choose a match format.</DialogDescription>
              </header>
              <div className="mx-auto my-auto grid w-full max-w-95 gap-3 py-4 landscape:max-w-[min(100%,calc(var(--tavern-card-height)*2.2))] landscape:grid-cols-3 landscape:items-start landscape:gap-[clamp(0.75rem,2vw,2rem)] landscape:[--tavern-card-height:clamp(9rem,44dvh,27rem)] compact-landscape:py-1 compact-landscape:[--tavern-card-height:clamp(6.5rem,calc(100dvh_-_9.25rem_-_var(--safe-area-top)_-_var(--safe-area-bottom)),13rem)]">
                {formats.map((format) => (
                  <TavernFormatCard
                    key={format.title}
                    {...format}
                    selected={selectedFormat === format.title}
                    onTouchFocus={(selected) => setSelectedFormat(selected ? format.title : null)}
                    onActivate={() =>
                      depart(() =>
                        navigate(`${GAME_PATH}/${PREVIEW_MATCH_ID}?mode=${format.mode}`, {
                          state: { fromTavern: true },
                        }),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
