import { ModalContent } from "@/components";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUiHands } from "@/infrastructure/adapters/handWithMeta";
import { SingsList } from "@/infrastructure/ui/components/singins/SingsList";

type SingsModalProps = { isOpen: boolean; onClose: () => void };

export const SingsModal = ({ isOpen, onClose }: SingsModalProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <ModalContent className="max-h-[85dvh] overflow-y-auto sm:max-w-5xl">
      <DialogHeader>
        <DialogTitle>Sings (Combinations)</DialogTitle>
        <DialogDescription>Explore the patterns and points for each combination.</DialogDescription>
      </DialogHeader>
      <SingsList sings={getUiHands()} />
    </ModalContent>
  </Dialog>
);
