import { clsx } from "clsx";
import { useEffect } from "react";

import { useGameStore } from "@/application/store/gameStore";
import { Card } from "@/components/card/Card";
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
              key={player.id}
              className={clsx("absolute w-full", {
                "top-10": index === 0,
                "bottom-10": index === 2,
                "left-30 !w-0 top-[42%]": index === 1,
                "right-30 !w-0 top-[42%]": index === 3,
              })}
            >
              <div
                className={
                  "gap-8 relative flex flex-col items-center justify-center"
                }
              >
                <div
                  className={clsx("absolute", {
                    "-bottom-10": index === 0,
                    "-top-10": index === 2,
                    "left-30": index === 1,
                    "right-30": index === 3,
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
                  className={clsx(
                    "gap-4 relative flex flex-row items-center justify-center",
                    {
                      "rotate-90":
                        state.players.length > 2 &&
                        (index === 1 || index === 3),
                      "group isTop": index === 0,
                      "group isBottom": index === 2,
                      "group isLeft": index === 1,
                      "group isRight": index === 3,
                    },
                  )}
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
                          "group-[.isTop]:mb-4 group-[.isBottom]:mt-4 group-[.isLeft]:mt-4 group-[.isRight]:mb-4 group-[.isBottom]:-rotate-14 group-[.isLeft]:-rotate-14 group-[.isRight]:rotate-14 group-[.isTop]:rotate-14":
                            cIndex === 0,
                          "group-[.isTop]:mt-4 group-[.isBottom]:mb-4 group-[.isLeft]:mb-4 group-[.isRight]:mt-4":
                            cIndex === 1,
                          "group-[.isTop]:mb-4 group-[.isBottom]:mt-4 group-[.isLeft]:mt-4 group-[.isRight]:mb-4 group-[.isBottom]:rotate-14 group-[.isLeft]:rotate-14 group-[.isRight]:-rotate-14 group-[.isTop]:-rotate-14":
                            cIndex === 2,
                        },
                      )}
                    />
                  ))}
                </div>
                <div
                  className={clsx("w-70 h-70 absolute", {
                    "left-50 top-0": index === 0,
                    "right-50 top-0": index === 1,
                    "-bottom-80": index === 2,
                    "-top-80": index === 3,
                  })}
                >
                  <div className={"relative h-full w-full"}>
                    {player.collected.map((card) => (
                      <Card
                        key={card.suit + card.rank}
                        rank={card.rank}
                        suit={card.suit}
                        faceDown={true}
                        className={`!absolute rotate-[${Math.floor(Math.random() * 50)}deg]`}
                        disabled={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
      <CardList />
    </div>
  );
}

export default App;
