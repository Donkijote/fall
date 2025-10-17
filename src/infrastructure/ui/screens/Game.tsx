import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useGameStore } from "@/application/store/gameStore";
import { GameOverModal } from "@/infrastructure/ui/components/modal/GameOverModal";
import { Players } from "@/infrastructure/ui/components/player/Players";
import { Table } from "@/modules/table/ui/Table";
import { HOME_PATH } from "@/routes/Routes";

export const GameScreen = () => {
  const { state, service } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === "init") {
      navigate(HOME_PATH);
    }
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
      <GameOverModal
        isOpen={false}
        onNewGame={() => null}
        onReplay={() => null}
        onClose={() => null}
        result={"win"}
        stats={{
          teamScore: [24, 13],
        }}
      />
    </div>
  );
};
