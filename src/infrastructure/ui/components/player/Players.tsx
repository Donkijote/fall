import { clsx } from "clsx";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import { Card } from "@/infrastructure/ui/components/card/Card";

export const Players = () => {
  const { players, dealer, currentPlayer } = useGameStoreState();
  const { playCard } = useGameStoreService();

  return (
    <>
      {players.map((player, index) => (
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
                {player.id === dealer && <p className={"self-end"}>D!</p>}
              </div>
            </div>
            <div
              className={clsx(
                "gap-4 relative flex flex-row items-center justify-center",
                {
                  "rotate-90":
                    players.length > 2 && (index === 1 || index === 3),
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
                  onClick={() => playCard(player.id, cIndex)}
                  disabled={player.id !== currentPlayer}
                  faceDown={player.id !== currentPlayer}
                  className={clsx(
                    player.id === currentPlayer ? "cursor-pointer" : "",
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
  );
};
