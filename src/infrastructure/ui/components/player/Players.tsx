import { clsx } from "clsx";
import { useMemo } from "react";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import {
  StorageKeys,
  StorageService,
} from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";
import { Card } from "@/infrastructure/ui/components/card/Card";
import { CollectedCard } from "@/infrastructure/ui/components/player/CollectedCard";
import { DealerChoiceControls } from "@/infrastructure/ui/components/player/DealerChoiceControls";
import { PlayerChip } from "@/infrastructure/ui/components/player/PlayerChip";

export const Players = () => {
  const { players, dealer, deck, mainPlayer, currentPlayer, scores, phase } =
    useGameStoreState();
  const { playCard, dealerChoose } = useGameStoreService();

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
        const positions = computePlayerItemsPositions(index, players.length);
        const displayUserName =
          player.id === storedUser?.id ? storedUser.username : player.id;
        const avatar =
          player.id === storedUser?.id ? storedUser.avatar : undefined;

        return (
          <div
            key={player.id}
            className={clsx("absolute w-full", positions.players)}
          >
            <div
              className={
                "gap-8 relative flex flex-col items-center justify-center"
              }
            >
              <div className={clsx("absolute", positions.dealerBadge)}>
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
                  score={scores.values}
                  team={player.team}
                  isMainPlayer={player.id === mainPlayer}
                  isDealer={player.id === dealer}
                  avatar={avatar}
                />
              </div>
              <div
                className={clsx(
                  "gap-4 relative flex flex-row items-center justify-center",
                  positions.cardGroups,
                )}
              >
                {player.hand.map((card, cIndex) => (
                  <Card
                    key={card.suit + card.rank}
                    rank={card.rank}
                    suit={card.suit}
                    onClick={() => playCard(player.id, cIndex)}
                    disabled={
                      currentPlayer !== mainPlayer ||
                      currentPlayer !== player.id
                    }
                    faceDown={player.id !== mainPlayer}
                    className={clsx({
                      "cursor-pointer":
                        player.id === mainPlayer && currentPlayer === player.id,
                      "group-[.isTop]:mb-4 group-[.isBottom]:mt-4 group-[.isLeft]:mt-4 group-[.isRight]:mb-4 group-[.isBottom]:-rotate-14 group-[.isLeft]:-rotate-14 group-[.isRight]:rotate-14 group-[.isTop]:rotate-14":
                        cIndex === 0,
                      "group-[.isTop]:mt-4 group-[.isBottom]:mb-4 group-[.isLeft]:mb-4 group-[.isRight]:mt-4":
                        cIndex === 1,
                      "group-[.isTop]:mb-4 group-[.isBottom]:mt-4 group-[.isLeft]:mt-4 group-[.isRight]:mb-4 group-[.isBottom]:rotate-14 group-[.isLeft]:rotate-14 group-[.isRight]:-rotate-14 group-[.isTop]:-rotate-14":
                        cIndex === 2,
                    })}
                  />
                ))}
              </div>
              <div
                className={clsx(
                  "w-70 h-70 absolute",
                  positions.collectedCardsPiles,
                )}
              >
                <div className={"relative h-full w-full"}>
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
                <div className={clsx("w-50 h-50 absolute z-0", positions.deck)}>
                  {deck.map((card, index) => (
                    <Card
                      key={card.suit + card.rank + index}
                      rank={card.rank}
                      suit={card.suit}
                      faceDown={true}
                      disabled={true}
                      style={{
                        position: "absolute",
                        zIndex: index,
                        bottom: index * 0.5,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

const computePlayerItemsPositions = (
  playerIndex: number,
  totalPlayers: number,
) => {
  const twoPlayerMode = totalPlayers === 2;
  const threePlayerMode = totalPlayers === 3;
  const fourPlayerMode = totalPlayers === 4;
  const positions: Record<string, Record<string, boolean>> = {
    players: {},
    dealerBadge: {},
    cardGroups: {},
    collectedCardsPiles: {},
    deck: {},
  };

  // Player positions based on number of players
  if (twoPlayerMode) {
    positions.players["bottom-40"] = playerIndex === 0;
    positions.players["top-40"] = playerIndex === 1;

    positions.dealerBadge["-top-35"] = playerIndex === 1;

    positions.cardGroups["group isBottom"] = playerIndex === 0;
    positions.cardGroups["group isTop"] = playerIndex === 1;

    positions.collectedCardsPiles["right-55 top-0"] = playerIndex === 0;
    positions.collectedCardsPiles["left-90 top-5"] = playerIndex === 1;

    positions.deck["left-100 bottom-5"] = playerIndex === 0;
    positions.deck["right-55 -top-20"] = playerIndex === 1;
  }

  if (threePlayerMode) {
    positions.players["bottom-40"] = playerIndex === 0;
    positions.players["right-55 !w-0 top-[42%]"] = playerIndex === 1;
    positions.players["left-55 !w-0 top-[42%]"] = playerIndex === 2;

    positions.dealerBadge["-right-45"] = playerIndex === 1;
    positions.dealerBadge["-left-45"] = playerIndex === 2;

    positions.cardGroups["group isBottom"] = playerIndex === 0;
    positions.cardGroups["group isRight"] = playerIndex === 1;
    positions.cardGroups["group isLeft"] = playerIndex === 2;

    positions.collectedCardsPiles["right-55 top-0"] = playerIndex === 0;
    positions.collectedCardsPiles["right-7 -top-60 rotate-90"] =
      playerIndex === 1;
    positions.collectedCardsPiles["-left-20 top-80 rotate-90"] =
      playerIndex === 2;

    positions.deck["left-100 bottom-5"] = playerIndex === 0;
    positions.deck["-right-50 top-80 rotate-90"] = playerIndex === 1;
    positions.deck["-right-60 -top-70 rotate-90"] = playerIndex === 2;
  }

  if (fourPlayerMode) {
    positions.players["bottom-40"] = playerIndex === 0;
    positions.players["right-55 !w-0 top-[42%]"] = playerIndex === 1;
    positions.players["top-40"] = playerIndex === 2;
    positions.players["left-55 !w-0 top-[42%]"] = playerIndex === 3;

    positions.dealerBadge["-right-45"] = playerIndex === 1;
    positions.dealerBadge["-top-20"] = playerIndex === 2;
    positions.dealerBadge["-left-45"] = playerIndex === 3;

    positions.cardGroups["group isBottom"] = playerIndex === 0;
    positions.cardGroups["group isRight"] = playerIndex === 1;
    positions.cardGroups["group isTop"] = playerIndex === 2;
    positions.cardGroups["group isLeft"] = playerIndex === 3;

    positions.collectedCardsPiles["right-55 -bottom-25"] = playerIndex === 0;
    positions.collectedCardsPiles["right-7 -top-60 rotate-90"] =
      playerIndex === 1;
    positions.collectedCardsPiles["left-120 top-5"] = playerIndex === 2;
    positions.collectedCardsPiles["-left-20 top-80 rotate-90"] =
      playerIndex === 3;

    positions.deck["left-100 bottom-5"] = playerIndex === 0;
    positions.deck["-right-50 top-80 rotate-90"] = playerIndex === 1;
    positions.deck["right-55 -top-20"] = playerIndex === 2;
    positions.deck["-right-60 -top-70 rotate-90"] = playerIndex === 3;
  }

  // Dealer badge position
  positions.dealerBadge["-bottom-35"] = playerIndex === 0;

  // Card group orientation
  positions.cardGroups["rotate-90"] =
    ((playerIndex === 2 || playerIndex === 1) && threePlayerMode) ||
    (fourPlayerMode && (playerIndex === 1 || playerIndex === 3));

  return positions;
};
