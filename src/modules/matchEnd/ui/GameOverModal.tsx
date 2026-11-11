import { Skull, Trophy } from "lucide-react";

import { ActionButton, ModalContent } from "@/components";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMatchEnd } from "@/modules/matchEnd/application/useMatchEnd";
import { TEXTS } from "@/modules/matchEnd/domain/texts";

import { ConfettiController } from "./components/Confetti";
import { StatPill } from "./components/StatPill";

export const GameOverModal = () => {
  const { isFinished, gameResult, stats, onExit, onNewGame, onReplay } = useMatchEnd();
  if (!isFinished || !gameResult) return null;
  const ResultIcon = gameResult === "win" ? Trophy : Skull;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onExit();
      }}
      disablePointerDismissal
    >
      <ModalContent data-testid="gameOverModal" className="overflow-x-hidden">
        <div className="flex justify-center text-primary" aria-hidden>
          <ResultIcon className="size-14" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="font-normal" data-testid={`gameOverModal-title-${gameResult}`}>
            {TEXTS[gameResult].title}
          </DialogTitle>
          <DialogDescription>{TEXTS[gameResult].message}</DialogDescription>
        </DialogHeader>
        {stats?.teamScore && <StatPill label="Score" value={stats.teamScore} />}
        <DialogFooter>
          <ActionButton tone="outline" onClick={onNewGame} title="Open game modes">
            New Game <span className="sr-only">(N)</span>
          </ActionButton>
          <ActionButton tone="primary" onClick={onReplay}>
            Replay <span className="sr-only">(R)</span>
          </ActionButton>
        </DialogFooter>
        {gameResult === "win" && <ConfettiController active={isFinished} />}
      </ModalContent>
    </Dialog>
  );
};
