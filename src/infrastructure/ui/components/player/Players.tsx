import clsx from "clsx";
import { useMemo } from "react";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import {
  StorageKeys,
  StorageService,
} from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";
import { Card } from "@/infrastructure/ui/components/card/Card";

import { CollectedCard } from "./CollectedCard";
import { DealerChoiceControls } from "./DealerChoiceControls";
import { PlayerChip } from "./PlayerChip";

export const Players = () => {
  const { players, dealer, mainPlayer, currentPlayer, scores, phase, deck } =
    useGameStoreState();
  const { playCard, dealerChoose } = useGameStoreService();

  const positions = useMemo(
    () => computePlayerPositions(players.length),
    [players.length],
  );

  const storedUser = useMemo(() => {
    const userStore = StorageService.get(StorageKeys.FALL_USER);
    if (!userStore) return null;
    try {
      return JSON.parse(userStore) as User;
    } catch {
      return null;
    }
  }, []);

  return (
    <>
      {players.map((player, index) => {
        const pos = positions[index];
        const displayUserName =
          player.id === storedUser?.id ? storedUser.username : player.id;
        const avatar =
          player.id === storedUser?.id ? storedUser.avatar : undefined;

        return (
          <div
            key={player.id}
            className={clsx(
              "absolute flex flex-col items-center",
              pos.container,
              "xl:h-[18rem] lg:h-[16rem] h-[14rem] w-[12rem]",
            )}
            style={{
              transform: pos.rotation,
              transformOrigin: "center center",
            }}
          >
            <div className="space-x-2 relative flex h-full w-full flex-row items-center justify-center">
              <div
                className={clsx(
                  "space-x-2 md:relative md:bottom-0 absolute flex flex-row items-center justify-center",
                  pos.collapseHand,
                )}
              >
                {player.hand.map((card, cIndex) => {
                  const total = player.hand.length;
                  const middle = (total - 1) / 2;

                  const rotate = (cIndex - middle) * 10;
                  const translateY = Math.abs(cIndex - middle) * 12;

                  return (
                    <Card
                      key={card.suit + card.rank}
                      rank={card.rank}
                      suit={card.suit}
                      onClick={() => {
                        if (
                          player.id !== mainPlayer &&
                          currentPlayer !== player.id
                        ) {
                          return;
                        }
                        playCard(player.id, cIndex);
                      }}
                      disabled={
                        currentPlayer !== mainPlayer || player.id !== mainPlayer
                      }
                      faceDown={player.id !== mainPlayer}
                      style={{
                        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                      }}
                      className={clsx({
                        "cursor-pointer":
                          player.id === mainPlayer &&
                          currentPlayer === player.id,
                      })}
                    />
                  );
                })}
              </div>

              <div className="mr-26 md:-mr-14 lg:-mr-20 md:top-8/12 absolute top-12/12 -right-full">
                <div className="w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 relative">
                  {player.collected.map((card, index) => (
                    <CollectedCard
                      key={player.id + card.suit + card.rank}
                      card={card}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {player.id === dealer && (
                <div className="ml-22 md:-ml-12 lg:-ml-18 md:top-9/12 absolute top-11/12 -left-full">
                  <div className="w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 relative">
                    {deck.map((card, index) => (
                      <Card
                        key={card.suit + card.rank + index}
                        rank={card.rank}
                        suit={card.suit}
                        faceDown={true}
                        disabled={true}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          transform: `translate(${index * 0.25}px, ${
                            index * 0.25
                          }px)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={clsx("relative", pos.chipOffset)}>
              <DealerChoiceControls
                isOpen={
                  player.id === mainPlayer &&
                  player.id === dealer &&
                  phase === "dealerChoice"
                }
                onChoose={(dealOrder, tablePattern) =>
                  dealerChoose(dealOrder, tablePattern)
                }
              />
              <PlayerChip
                name={displayUserName}
                avatar={avatar}
                score={scores.values}
                team={player.team}
                isMainPlayer={player.id === mainPlayer}
                isDealer={player.id === dealer}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

type Position = {
  container: string;
  rotation: string;
  chipOffset: string;
  collapseHand?: string;
};

function computePlayerPositions(playersCount: number): Position[] {
  if (playersCount === 2) {
    return [
      {
        container: "bottom-[1%] md:bottom-[2%] left-1/2 -translate-x-1/2",
        rotation: "rotate(0deg)",
        chipOffset: "mt-2",
      },
      {
        container: "top-[1%] md:top-[2%] left-1/2 -translate-x-1/2",
        rotation: "rotate(180deg)",
        chipOffset: "mt-2",
      },
    ];
  }

  if (playersCount === 4) {
    return [
      {
        container:
          "bottom-[1%] md:bottom-[4%] lg:bottom-[8%] left-1/2 -translate-x-1/2",
        rotation: "rotate(0deg)",
        chipOffset: "mt-0 md:mt-3",
      },
      {
        container: "right-[5%] top-1/2 -translate-y-1/2",
        rotation: "rotate(-90deg)",
        chipOffset: "mt-2",
        collapseHand: "bottom-[calc(-100%+20%)]",
      },

      {
        container: "top-[1%] md:top-[4%] lg:top-[8%] left-1/2 -translate-x-1/2",
        rotation: "rotate(180deg)",
        chipOffset: "mt-0 md:mt-2",
      },
      {
        container: "left-[5%] top-1/2 -translate-y-1/2",
        rotation: "rotate(90deg)",
        chipOffset: "mt-2",
        collapseHand: "bottom-[calc(-100%+20%)]",
      },
    ];
  }

  const layouts: Position[][] = [
    [
      {
        container: "bottom-[1%] md:bottom-[2%] left-1/2 -translate-x-1/2",
        rotation: "rotate(0deg)",
        chipOffset: "mt-2",
      },

      {
        container: "right-[5%] top-1/2 -translate-y-1/2",
        rotation: "rotate(-90deg)",
        chipOffset: "mt-2",
        collapseHand: "bottom-[calc(-100%+15%)]",
      },
      {
        container: "top-[1%] md:top-[2%] left-1/2 -translate-x-1/2",
        rotation: "rotate(180deg)",
        chipOffset: "mt-2",
      },
    ],
    [
      {
        container: "bottom-[1%] md:bottom-[2%] left-1/2 -translate-x-1/2",
        rotation: "rotate(0deg)",
        chipOffset: "mt-2",
      },
      {
        container: "right-[5%] top-1/2 -translate-y-1/2",
        rotation: "rotate(-90deg)",
        chipOffset: "mt-2",
        collapseHand: "bottom-[calc(-100%+15%)]",
      },
      {
        container: "left-[5%] top-1/2 -translate-y-1/2",
        rotation: "rotate(90deg)",
        chipOffset: "mt-2",
        collapseHand: "bottom-[calc(-100%+15%)]",
      },
    ],
  ];

  return layouts[1];
}
