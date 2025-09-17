import { useEffect } from "react";

import { useGameStore } from "@/application/store/gameStore";
import { CardList } from "@/infrastructure/ui/components/card/CardList";
import { Players } from "@/infrastructure/ui/components/player/Players";
import { Table } from "@/infrastructure/ui/components/table/Table";

import "./App.css";

function App() {
  const { state, service } = useGameStore();

  useEffect(() => {
    if (state.phase === "announceSings") {
      service.announceSings();
    }
    if (state.phase === "roundEnd") {
      service.endRound();
    }
  }, [state, service]);

  return (
    <div data-testid={"App"} className={"px-8 py-3"}>
      <h1 className={"mb-3"}>Fall</h1>
      <div className={"gap-2 flex flex-row justify-between"}>
        <div className={"gap-2 flex"}>
          <button
            className={
              "py-2 px-3 border-gray-300 cursor-pointer border-[0.5px]"
            }
            onClick={service.startGame}
          >
            Start Game
          </button>
        </div>
        <div className={"gap-2 flex flex-col items-center"}>
          <span>Score</span>
          <span>
            Team 1: {state.scores.values[1]} vs Team 2: {state.scores.values[2]}
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
      <Table>
        <Players />
      </Table>
      <CardList />
    </div>
  );
}

export default App;
