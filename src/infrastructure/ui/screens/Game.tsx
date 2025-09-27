import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useGameStore } from "@/application/store/gameStore";
import { Players } from "@/infrastructure/ui/components/player/Players";
import { Table } from "@/infrastructure/ui/components/table/Table";
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
    </div>
  );
};
