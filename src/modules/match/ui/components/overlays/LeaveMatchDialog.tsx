import { useRef } from "react";
import type { RefObject } from "react";

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
        className="gap-4 p-8 text-center compact-landscape:max-w-md"
      >
        <DialogTitle className="text-[clamp(1.375rem,5vmin,2rem)] font-normal">
          Leave match?
        </DialogTitle>
        <DialogDescription className="mx-auto max-w-64">
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
          <TavernOverlayAction tone="outline" onClick={leave}>
            Leave match
          </TavernOverlayAction>
        </div>
      </ModalContent>
    </Dialog>
  );
}
