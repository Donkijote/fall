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
                  key={player.id + card.suit + card.rank + index}
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
  const bottomHandMobile =
    "bottom-1/12 left-1/2 -translate-x-1/2 -translate-y-1/12";
  const bottomHandMobileLandscape =
    "landscape:bottom-1/20 landscape:-translate-y-1/20";
  const bottomHandTabletLandscape =
    "landscape:lg:bottom-1/10 landscape:lg:-translate-y-1/10";
  const bottomHandBigTabletLandscape =
    "landscape:xl:bottom-1/10 landscape:xl:-translate-y-1/10";
  const bottomCollectedMobile =
    "bottom-1/6 left-1/30 -translate-x-1/30 -translate-y-1/6";
  const bottomCollectedMobileLandscape =
    "landscape:bottom-1/4 landscape:left-1/5";
  const bottomCollectedTablet =
    "md:bottom-1/6  md:left-1/8 md:-translate-x-1/8 md:-translate-y-1/6";
  const bottomCollectedTabletLandscape =
    "landscape:lg:bottom-1/4 landscape:lg:-translate-y-1/4";
  const bottomCollectedBigTabletLandscape =
    "landscape:xl:left-1/4 landscape:xl:-translate-x-1/4 landscape:xl:bottom-1/6 landscape:xl:-translate-y-1/6";
  const bottomDeckMobile =
    "bottom-1/8 -translate-y-1/8 right-1/5 -translate-x-1/5";
  const bottomDeckMobileLandscape =
    "landscape:bottom-1/4 landscape:-translate-y-1/4 landscape:right-1/3 landscape:-translate-x-1/3";
  const bottomDeckTablet =
    "md:bottom-1/6 md:-translate-y-1/6 md:right-1/4 md:-translate-x-1/4";
  const bottom = {
    chip: "bottom-1 left-1/2 -translate-x-1/2",
    hand: clsx(
      bottomHandMobile,
      bottomHandMobileLandscape,
      bottomHandTabletLandscape,
      bottomHandBigTabletLandscape,
    ),
    collected: clsx(
      bottomCollectedMobile,
      bottomCollectedMobileLandscape,
      bottomCollectedTablet,
      bottomCollectedTabletLandscape,
      bottomCollectedBigTabletLandscape,
    ),
    deck: clsx(bottomDeckMobile, bottomDeckMobileLandscape, bottomDeckTablet),
  };

  const topHandMobile =
    "top-1/10 -translate-y-1/10 left-1/2 -translate-x-1/2 rotate-180";
  const topHandMobileLandscape =
    "landscape:top-1/20 landscape:-translate-y-1/20";
  const topHandTabletLandscape =
    "landscape:lg:top-1/8 landscape:lg:-translate-y-1/8";
  const topHandBigTabletLandscape =
    "landscape:xl:top-1/8 landscape:xl:-translate-y-1/8";
  const topCollectedMobile =
    "left-1/25 -translate-x-1/25 top-1/20 -translate-y-1/25";
  const topCollectedMobileLandscape =
    "landscape:left-1/4 landscape:-translate-x-1/4 landscape:top-1/16 landscape:-translate-y-1/16";
  const topCollectedTablet = "md:left-1/8 md:-translate-x-1/8";
  const topCollectedTabletLandscape =
    "landscape:lg:top-1/12 landscape:lg:-translate-y-1/12";
  const topCollectedBigTabletLandscape =
    "landscape:xl:top-1/14 landscape:xl:-translate-y-1/14";
  const topDeckMobile = "right-1/5 -translate-x-1/5 top-1/14 -translate-y-1/14";
  const topDeckMobileLandscape =
    "landscape:top-1/20 landscape:-translate-y-1/20";
  const topDeckTablet = "md:right-1/4 md:-translate-x-1/4";
  const topDeckTabletLandscape =
    "landscape:lg:right-1/3 landscape:lg:-translate-x-1/3";
  const topDeckBigTabletLandscape =
    "landscape:xl:top-1/12 landscape:xl:-translate-y-1/12 landscape:xl:right-1/3 landscape:xl:-translate-x-1/3";
  const top = {
    chip: "left-1/2 top-1 -translate-x-1/2 rotate-180",
    hand: clsx(
      topHandMobile,
      topHandMobileLandscape,
      topHandTabletLandscape,
      topHandBigTabletLandscape,
    ),
    collected: clsx(
      topCollectedMobile,
      topCollectedTablet,
      topCollectedMobileLandscape,
      topCollectedTabletLandscape,
      topCollectedBigTabletLandscape,
    ),
    deck: clsx(
      topDeckMobile,
      topDeckMobileLandscape,
      topDeckTablet,
      topDeckTabletLandscape,
      topDeckBigTabletLandscape,
    ),
  };

  const rightHandMobile =
    "top-1/2 -translate-y-1/2 -rotate-90 -right-1/8 translate-x-1/8";
  const rightHandTablet = "md:right-1/30";
  const rightHandBigTableLandscape =
    "xl:right-1/38 landscape:xl:-translate-x-1/38";
  const rightCollectedMobile = "bottom-1/3 -translate-y-1/3 right-1/5";
  const rightCollectedMobileLandscape =
    "landscape:bottom-1/4 landscape:-translate-y-1/4 landscape:right-1/6";
  const rightCollectedTablet = "md:right-1/6 md:-translate-x-1/6";
  const rightCollectedTabletLandscape =
    "landscape:lg:right-1/8 md:-translate-x-1/8";

  const right = {
    chip: "right-7 md:right-8 top-1/2 -translate-y-1/2 -rotate-90",
    hand: clsx(rightHandMobile, rightHandTablet, rightHandBigTableLandscape),
    collected: clsx(
      rightCollectedMobile,
      rightCollectedMobileLandscape,
      rightCollectedTablet,
      rightCollectedTabletLandscape,
    ),
    deck: "top-1/4 -translate-y-1/4 md:top-1/5 md:-translate-y-1/5 right-6 md:right-20 rotate-90",
  };

  const leftHandMobile =
    "-left-1/8 -translate-x-1/8 top-1/2 -translate-y-1/2 rotate-90";
  const leftHandMobileLandscape = "-left-1/18 -translate-x-1/18";
  const leftHandTablet = "md:left-1/22 md:-translate-x-1/6";
  const leftHandBigTableLandscape = "xl:left-1/24 xl:-translate-x-1/24";
  const leftCollectedMobile =
    "top-1/4 -translate-y-1/4 left-1/12 -translate-x-1/12";
  const leftCollectedMobileLandscape =
    "landscape:top-1/8 landscape:-translate-y-1/8 landscape:left-1/16 landscape:-translate-x-1/16";
  const leftCollectedTablet = "md:top-1/4 md:-translate-y-1/4 md:left-25";
  const leftDeckMobile =
    "bottom-1/3 -translate-y-1/3 left-1/4 -translate-x-1/4";
  const leftDeckMobileLandscape =
    "landscape:bottom-1/3 landscape:-translate-y-1/3 landscape:left-1/8 landscape:-translate-x-1/8";
  const leftDeckTable = "md:left-1/5 md:-translate-x-1/5 rotate-90";

  const left = {
    chip: "left-7 md:left-8 top-1/2 -translate-y-1/2 rotate-90",
    hand: clsx(
      leftHandMobile,
      leftHandMobileLandscape,
      leftHandTablet,
      leftHandBigTableLandscape,
    ),
    collected: clsx(
      leftCollectedMobile,
      leftCollectedTablet,
      leftCollectedMobileLandscape,
    ),
    deck: clsx(leftDeckMobile, leftDeckMobileLandscape, leftDeckTable),
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
