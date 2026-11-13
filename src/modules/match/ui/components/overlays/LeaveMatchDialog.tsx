import { useRef } from "react";
import type { RefObject } from "react";

import parchment from "@/assets/lobby/tavern-match/leave-parchment.webp";
import { ModalContent } from "@/components/surfaces/ModalContent";
import { Dialog, DialogClose, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { TavernOverlayAction } from "./TavernOverlayAction";

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
        className="isolate gap-3 border-0 bg-transparent bg-none px-8 pt-[5.75rem] pb-8 text-center text-artwork-shadow ring-0 inset-ring-0 compact-landscape:max-w-md compact-landscape:gap-4 compact-landscape:pt-[5.25rem] compact-landscape:pb-9"
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
        <div className="grid justify-center gap-2 sm:grid-flow-col max-sm:portrait:mx-auto max-sm:portrait:w-full max-sm:portrait:max-w-52 max-sm:portrait:justify-stretch max-sm:portrait:gap-3 compact-landscape:grid-flow-col">
          <DialogClose
            render={
              <TavernOverlayAction ref={keepPlaying} tone="primary" className="min-h-11 text-sm" />
            }
          >
            Keep playing
          </DialogClose>
          <TavernOverlayAction
            tone="outline"
            className="text-artwork-shadow hover:bg-artwork-shadow/10 hover:text-artwork-shadow"
            onClick={leave}
          >
            Leave match
          </TavernOverlayAction>
        </div>
      </ModalContent>
    </Dialog>
  );
}
