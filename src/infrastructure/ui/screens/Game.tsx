import { ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useGameStore } from "@/application/store/gameStore";
import { Button } from "@/components/ui/button";
import { SingsModal } from "@/infrastructure/ui/components/modal/SingsModal";
import { Players } from "@/infrastructure/ui/components/player/Players";
import { useAnimationLayer } from "@/infrastructure/ui/hooks/useAnimationLayer";
import { GameOverModal } from "@/modules/matchEnd/ui/GameOverModal";
import { Table } from "@/modules/table/ui/Table";

export const GameScreen = () => {
  const { state, service } = useGameStore();
  const navigate = useNavigate();
  useAnimationLayer();

  const [isSingsModalOpen, setIsSingsModalOpen] = useState(false);

  useEffect(() => {
    if (state.phase === "deal") {
      service.startGame().then();
    }
    if (state.phase === "announceSings") {
      service.announceSings().then();
    }
    if (state.phase === "roundEnd") {
      service.endRound().then();
    }
  }, [state, service, navigate]);

  return (
    <div data-testid={"GameScreen"}>
      <Table>
        <Players />
      </Table>
      <GameOverModal />
      <SingsModal isOpen={isSingsModalOpen} onClose={() => setIsSingsModalOpen(false)} />
      <Button
        variant="outline"
        size="icon"
        aria-label="View sings"
        onClick={() => setIsSingsModalOpen(true)}
        className="absolute top-4 right-4"
      >
        <ScrollText />
      </Button>
    </div>
  );
};
