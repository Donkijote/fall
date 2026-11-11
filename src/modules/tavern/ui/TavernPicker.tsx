import { useState } from "react";

import tavernArtwork from "@/assets/lobby/card-hall/tavern.webp";
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

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { TavernFormatCard } from "./components/TavernFormatCard";
import { TavernRoom } from "./components/TavernRoom";
import { useTavernMotion } from "./components/useTavernMotion";

const formats = [
  {
    title: "Duel",
    players: "2 players",
    description: "Face one opponent.",
    artwork: duel,
  },
  {
    title: "Free-for-All",
    players: "3 players",
    description: "Everyone plays solo.",
    artwork: freeForAll,
  },
  {
    title: "Team Match",
    players: "4 players",
    description: "Play two against two.",
    artwork: teamMatch,
  },
] satisfies {
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
  const { dismiss } = useTavernMotion(popup, origin);

  return (
    <Dialog
      open={open && canPlay}
      onOpenChange={(nextOpen) => {
        if (!nextOpen)
          dismiss(() => {
            setSelectedFormat(null);
            onClose();
          });
      }}
    >
      <DialogPortal>
        <DialogPrimitive.Popup
          ref={setPopup}
          finalFocus={origin ? () => origin : undefined}
          className="fixed inset-0 z-50 h-dvh overflow-clip outline-none"
        >
          <TavernRoom />
          {origin && (
            <img
              data-tavern-zoom=""
              src={tavernArtwork}
              alt=""
              aria-hidden="true"
              className="pointer-events-none invisible absolute z-10 rounded-md object-cover"
            />
          )}
          <div className="relative size-full overflow-y-auto overscroll-contain">
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
