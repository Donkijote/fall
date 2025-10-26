import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useGameStore } from "@/application/store/gameStore";
import { SingsModal } from "@/infrastructure/ui/components/modal/SingsModal";
import { Players } from "@/infrastructure/ui/components/player/Players";
import { GameOverModal } from "@/modules/matchEnd/ui/GameOverModal";
import { Table } from "@/modules/table/ui/Table";

import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GameScreen = () => {
  const { state, service } = useGameStore();
  const navigate = useNavigate();

  const [isSingsModalOpen, setIsSingsModalOpen] = useState(false);

  useEffect(() => {
    if (state.phase === "deal") {
      service.startGame();
    }
    if (state.phase === "announceSings") {
      service.announceSings();
    }
    if (state.phase === "roundEnd") {
      service.endRound();
    }
  }, [state, service, navigate]);

  return (
    <div data-testid={"GameScreen"}>
      <Table>
        <Players />
      </Table>
      <GameOverModal />
      <SingsModal
        isOpen={isSingsModalOpen}
        onClose={() => setIsSingsModalOpen(false)}
      />
      <button
        onClick={() => setIsSingsModalOpen(true)}
        className="right-4 top-4 border-white/20 bg-white/10 px-3 py-2.5 text-text-primary hover:bg-white/15 absolute cursor-pointer rounded-full border transition"
      >
        <FontAwesomeIcon icon={faScroll} />
      </button>
    </div>
  );
};
