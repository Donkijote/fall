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
      <div
        className={
          "top-0 px-20 bg-red-500 sm:bg-blue-500 md:bg-green-500 lg:bg-amber-500 xl:bg-gray-500 2xl:bg-purple-500 3xl:bg-pink-500 fixed z-10 w-full"
        }
      >
        <div className={"gap-2 flex flex-row justify-between"}>
          <div className={"gap-2 flex flex-col items-center"}>
            <span>Score</span>
            <span>
              Team 1: {state.scores.values[Object.keys(state.scores.values)[0]]}{" "}
              vs Team 2:{" "}
              {state.scores.values[Object.keys(state.scores.values)[1]]}
            </span>
          </div>
          <div className={"gap-2 flex"}>
            <button
              className={
                "py-2 px-3 border-gray-300 cursor-pointer border-[0.5px]"
              }
              onClick={() => service.dealerChoose("tableThenPlayers", "inc")}
            >
              To Table Inc
            </button>
            <button
              className={
                "py-2 px-3 border-gray-300 cursor-pointer border-[0.5px]"
              }
              onClick={() => service.dealerChoose("tableThenPlayers", "dec")}
            >
              To Table Desc
            </button>
          </div>
        </div>
      </div>
      <Table>
        <Players />
      </Table>
    </div>
  );
};
