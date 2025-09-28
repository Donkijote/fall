import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Card as ICard } from "@/domain/entities/Card";

import { Card } from "../card/Card";

export const TableCards = () => {
  const { table } = useGameStoreState();
  return (
    <>
      {table.map((card) => (
        <TableCardItem key={card.suit + card.rank} card={card} />
      ))}
    </>
  );
};

type TableCardProps = {
  card: ICard;
};

const TableCardItem = ({ card }: TableCardProps) => {
  const randomPositionLeft = `${Math.floor(Math.random() * 65)}%`;
  const randomPositionTop = `${Math.floor(Math.random() * 60)}%`;
  const randomDeg = `rotate(${Math.floor(Math.random() * (180 - -180)) + -180}deg)`;
  return (
    <Card
      rank={card.rank}
      suit={card.suit}
      disabled={true}
      style={{
        left: randomPositionLeft,
        top: randomPositionTop,
        transform: randomDeg,
        position: "absolute",
      }}
    />
  );
};
