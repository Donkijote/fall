import { useRef } from "react";
import type { RefObject } from "react";

import parchment from "@/assets/lobby/tavern-match/leave-parchment.webp";
import { ModalContent } from "@/components/surfaces/ModalContent";
import { MotionDialog as Dialog } from "@/components/surfaces/PopupMotion";
import { DialogClose, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { TavernOverlayAction } from "./TavernOverlayAction";
import "./LeaveMatchDialog.css";

export function LeaveMatchDialog({
  open,
  setOpen,
  leaveButton,
  leave,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  leaveButton: RefObject<HTMLButtonElement | null>;
  leave: () => void;
}) {
  const keepPlaying = useRef<HTMLButtonElement>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <ModalContent
        showCloseButton={false}
        initialFocus={keepPlaying}
        finalFocus={leaveButton}
        className="leave-match-dialog max-w-md gap-4 border-0 bg-transparent px-8 pt-[5.25rem] pb-9 text-center text-artwork-shadow lg:gap-3 lg:pt-[5.75rem] lg:pb-8"
      >
        <img
          src={parchment}
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 size-full"
        />
        <DialogTitle className="text-[clamp(1.375rem,5vmin,2rem)] font-normal">
          Leave match?
        </DialogTitle>
        <DialogDescription className="mx-auto max-w-64 text-artwork-shadow">
          Your match will end and your progress will be lost.
        </DialogDescription>
        <div className="grid grid-flow-col justify-center gap-2 lg:grid-flow-col">
          <DialogClose
            render={
              <TavernOverlayAction ref={keepPlaying} tone="primary" className="min-h-11 text-sm" />
            }
          >
            Keep playing
          </DialogClose>
          <TavernOverlayAction tone="outline" onClick={leave}>
            Leave match
          </TavernOverlayAction>
        </div>
      </ModalContent>
    </Dialog>
  );
}
