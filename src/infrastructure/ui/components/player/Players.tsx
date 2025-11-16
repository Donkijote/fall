import clsx from "clsx";
import { useMemo } from "react";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import {
  StorageKeys,
  StorageService,
} from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";
import { Card } from "@/infrastructure/ui/components/card/Card";

import { CollectedCard } from "./CollectedCard";
import { DealerChoiceControls } from "./DealerChoiceControls";
import { HandCard } from "./HandCard";
import { PlayerChip } from "./PlayerChip";

export const Players = () => {
  const { players, dealer, mainPlayer, currentPlayer, scores, phase, deck } =
    useGameStoreState();

  const storedUser = useMemo(() => {
    return StorageService.get<User>(StorageKeys.FALL_USER);
  }, []);

  const positions = useMemo(
    () => computePlayerPositions(players.length),
    [players.length],
  );

  return (
    <>
      {players.map((player, index) => {
        const displayUserName =
          player.id === storedUser?.id ? storedUser.username : player.id;
        const avatar =
          player.id === storedUser?.id ? storedUser.avatar : undefined;
        const displayDealerOptions =
          player.id === mainPlayer &&
          player.id === dealer &&
          phase === "dealerChoice";
        return (
          <div key={player.id}>
            <div className={clsx("fixed", positions[index].hand)}>
              <div
                className={
                  "flex min-w-[280px] items-center justify-center gap-2 pb-2"
                }
              >
                {player.hand.map((card, index) => (
                  <HandCard
                    card={card}
                    index={index}
                    mainPlayer={mainPlayer}
                    currentPlayer={currentPlayer}
                    player={player}
                    key={card.suit + card.rank}
                  />
                ))}
              </div>
            </div>
            <div className={clsx("fixed", positions[index].chip)}>
              {displayDealerOptions && (
                <DealerChoiceControls isOpen={displayDealerOptions} />
              )}
              <PlayerChip
                name={displayUserName}
                avatar={avatar}
                score={scores.values}
                team={player.team}
                isMainPlayer={player.id === currentPlayer}
                isDealer={player.id === dealer}
              />
            </div>

            <div className={clsx("fixed", positions[index].collected)}>
              {player.collected.map((card, index) => (
                <CollectedCard
                  key={player.id + card.suit + card.rank}
                  card={card}
                  index={index}
                />
              ))}
            </div>
            <div className={clsx("fixed", positions[index].deck)}>
              {player.id === dealer &&
                deck.map((card, index) => (
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
                      transform: `translate(${index * 0.25}px, ${index * 0.25}px)`,
                    }}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

type Position = {
  hand: string;
  chip: string;
  collected?: string;
  deck?: string;
};

function computePlayerPositions(playersCount: number): Position[] {
  const bottom = {
    chip: "bottom-1 left-1/2 -translate-x-1/2",
    hand: "bottom-20 md:bottom-27 left-1/2 -translate-x-1/2 landscape:bottom-2",
    collected:
      "bottom-40 md:bottom-50 left-4 md:left-1/8 md:-translate-x-1/8 landscape:bottom-30 landscape:left-1/5",
    deck: "bottom-30 md:bottom-50 right-19 md:right-1/4 md:-translate-x-1/4 landscape:bottom-24 landscape:right-1/3",
  };

  const top = {
    chip: "left-1/2 top-1 -translate-x-1/2 rotate-180",
    hand: "top-26 left-1/2 -translate-x-1/2 rotate-180 landscape:top-2",
    collected:
      "left-8 md:left-1/8 top-10 md:-translate-x-1/8 landscape:left-1/4 landscape:top-6",
    deck: "right-19 md:right-1/4 top-10 md:-translate-x-1/4",
  };

  const right = {
    chip: "right-7 md:right-8 top-1/2 -translate-y-1/2 -rotate-90",
    hand: "top-1/2 -translate-y-1/2 -rotate-90 -right-20 md:right-2 2xl:right-8",
    collected: "bottom-1/3 -translate-y-1/3 right-25 md:right-40",
    deck: "top-1/4 -translate-y-1/4 md:top-1/5 md:-translate-y-1/5 right-6 md:right-20 rotate-90",
  };

  const left = {
    chip: "left-7 md:left-8 top-1/2 -translate-y-1/2 rotate-90",
    hand: "-left-20 md:left-2 2xl:left-8 top-1/2 -translate-y-1/2 rotate-90",
    collected:
      "top-1/4 -translate-y-1/4 md:top-1/4 md:-translate-y-1/4 left-8 md:left-25 landscape:top-1/6 landscape:left-18",
    deck: "bottom-1/3 -translate-y-1/3 left-26 md:left-50 rotate-90",
  };

  if (playersCount === 2) {
    return [bottom, top];
  }

  if (playersCount === 4) {
    return [bottom, right, top, left];
  }

  const layouts: Position[][] = [
    [bottom, right, top],
    [bottom, right, left],
  ];

  return layouts[Math.random() > 0.5 ? 0 : 1];
}
