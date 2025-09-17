import type { ReactNode } from "react";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";
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
        className={"flex h-full w-full flex-wrap items-center justify-center"}
      >
        <div className={"gap-8 flex w-1/6 flex-wrap"}>
          {table.map((card) => (
            <Card
              key={card.suit + card.rank}
              rank={card.rank}
              suit={card.suit}
              disabled={true}
            />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};
