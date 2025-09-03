import { clsx } from "clsx";
import { useEffect } from "react";

import { useGameStore } from "@/application/store/gameStore";
import { Card } from "@/components/card/Card";

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
      <div className={"pt-4"}>
        <Card rank={1} suit="golds" size={"sm"} />
        <Card rank={1} suit="golds" />
        <Card rank={1} suit="golds" size={"lg"} />
        <Card rank={1} suit="cups" size={"sm"} />
        <Card rank={1} suit="cups" />
        <Card rank={1} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={2} suit="golds" size={"sm"} />
        <Card rank={2} suit="golds" />
        <Card rank={2} suit="golds" size={"lg"} />
        <Card rank={2} suit="cups" size={"sm"} />
        <Card rank={2} suit="cups" />
        <Card rank={2} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={3} suit="golds" size={"sm"} />
        <Card rank={3} suit="golds" />
        <Card rank={3} suit="golds" size={"lg"} />
        <Card rank={3} suit="cups" size={"sm"} />
        <Card rank={3} suit="cups" />
        <Card rank={3} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={4} suit="golds" size={"sm"} />
        <Card rank={4} suit="golds" />
        <Card rank={4} suit="golds" size={"lg"} />
        <Card rank={4} suit="cups" size={"sm"} />
        <Card rank={4} suit="cups" />
        <Card rank={4} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={5} suit="golds" size={"sm"} />
        <Card rank={5} suit="golds" />
        <Card rank={5} suit="golds" size={"lg"} />
        <Card rank={5} suit="cups" size={"sm"} />
        <Card rank={5} suit="cups" />
        <Card rank={5} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={6} suit="golds" size={"sm"} />
        <Card rank={6} suit="golds" />
        <Card rank={6} suit="golds" size={"lg"} />
        <Card rank={6} suit="cups" size={"sm"} />
        <Card rank={6} suit="cups" />
        <Card rank={6} suit="cups" size={"lg"} />
      </div>
      <div className={"pt-4"}>
        <Card rank={7} suit="golds" size={"sm"} />
        <Card rank={7} suit="golds" />
        <Card rank={7} suit="golds" size={"lg"} />
        <Card rank={7} suit="cups" size={"sm"} />
        <Card rank={7} suit="cups" />
        <Card rank={7} suit="cups" size={"lg"} />
      </div>
    </div>
  );
}

export default App;
