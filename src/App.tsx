import { clsx } from "clsx";
import { useEffect } from "react";

import { useGameStore } from "@/application/store/gameStore";
import { CardList } from "@/components/card/CardList";

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
      <div className={"pt-8 gap-4 flex justify-center"}>
        {state.table.map((card) => (
          <div
            className={"p-8 border-gray-800 border"}
            key={card.suit + card.rank}
          >
            <p>{card.rank}</p>
          </div>
        ))}
      </div>
      <div className={"pt-12 gap-20 flex items-center justify-center"}>
        {state.players.map((player) => (
          <div
            className={"gap-8 flex flex-col items-center justify-center"}
            key={player.id}
          >
            <div className={"flex w-full flex-row"}>
              <p className={"w-full text-center"}>{player.id}</p>
              {player.id === state.dealer && <p className={"self-end"}>D!</p>}
            </div>
            <div className={"gap-4 flex flex-row items-center justify-center"}>
              {player.hand.map((card, index) => (
                <button
                  className={clsx("p-8 border-gray-800 border", {
                    "cursor-pointer": player.id === state.currentPlayer,
                  })}
                  key={card.suit + card.rank}
                  onClick={() => service.playCard(player.id, index)}
                  disabled={player.id !== state.currentPlayer}
                >
                  <p>{card.rank}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CardList />
    </div>
  );
}

export default App;
