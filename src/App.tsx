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
      <div
        className={
          "border-gray-700 relative h-[calc(100vh-120px)] w-full border"
        }
      >
        <div
          className={"flex h-full w-full flex-wrap items-center justify-center"}
        >
          <div className={"gap-8 flex w-1/6 flex-wrap"}>
            {state.table.map((card) => (
              <Card
                key={card.suit + card.rank}
                rank={card.rank}
                suit={card.suit}
                disabled={true}
              />
            ))}
          </div>
        </div>
        <>
          {state.players.map((player, index) => (
            <div
              className={clsx("absolute w-full", {
                "top-10": index % 2 === 0,
                "bottom-10": index % 2 !== 0,
              })}
            >
              <div
                className={
                  "gap-8 relative flex flex-col items-center justify-center"
                }
                key={player.id}
              >
                <div
                  className={clsx("absolute", {
                    "-bottom-10": index % 2 === 0,
                    "-top-10": index % 2 !== 0,
                  })}
                >
                  <div className={"flex w-full flex-row"}>
                    <p className={"w-full text-center"}>{player.id}</p>
                    {player.id === state.dealer && (
                      <p className={"self-end"}>D!</p>
                    )}
                  </div>
                </div>
                <div
                  className={"gap-4 flex flex-row items-center justify-center"}
                >
                  {player.hand.map((card, cIndex) => (
                    <Card
                      key={card.suit + card.rank}
                      rank={card.rank}
                      suit={card.suit}
                      onClick={() => service.playCard(player.id, cIndex)}
                      disabled={player.id !== state.currentPlayer}
                      faceDown={player.id !== state.currentPlayer}
                      className={clsx(
                        player.id === state.currentPlayer
                          ? "cursor-pointer"
                          : "",
                        {
                          "mt-4 -rotate-14": index % 2 !== 0 && cIndex === 0,
                          "mb-4": index % 2 !== 0 && cIndex === 1,
                          "mt-4 rotate-14": index % 2 !== 0 && cIndex === 2,
                          "mb-4 rotate-14": index % 2 === 0 && cIndex === 0,
                          "mt-4": index % 2 === 0 && cIndex === 1,
                          "mb-4 -rotate-14": index % 2 === 0 && cIndex === 2,
                        },
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  );
}

export default App;
