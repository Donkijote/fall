import type { ReactNode } from "react";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Card as ICard } from "@/domain/entities/Card";
import { Card } from "@/infrastructure/ui/components/card/Card";

import { ItalianTable } from "./ItalianTable";
import { PokerTable } from "./PokerTable";
import { WoodTable } from "./WoodTable";

const TableStyles = [<ItalianTable />, <PokerTable />, <WoodTable />];

export const Table = ({ children }: { children: ReactNode }) => {
  // const randomIndex = Math.floor(Math.random() * TableStyles.length);
  const { table } = useGameStoreState();

  return (
    <div className={"relative h-[calc(100vh-120px)] w-full"}>
      {TableStyles[1]}
      <div
        className={
          "absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 transform"
        }
      >
        {table.map((card) => (
          <TableCard key={card.suit + card.rank} card={card} />
        ))}
      </div>
      {children}
    </div>
  );
};

type TableCardProps = {
  card: ICard;
};

const TableCard = ({ card }: TableCardProps) => {
  const randomPositionLeft = `${Math.floor(Math.random() * 65)}%`;
  const randomPositionTop = `${Math.floor(Math.random() * 60)}%`;
  return (
    <Card
      rank={card.rank}
      suit={card.suit}
      disabled={true}
      style={{
        left: randomPositionLeft,
        top: randomPositionTop,
        position: "absolute",
      }}
    />
  );
};
