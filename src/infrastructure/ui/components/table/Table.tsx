import type { ReactNode } from "react";

import { ItalianTable } from "./ItalianTable";
import { PokerTable } from "./PokerTable";
import { WoodTable } from "./WoodTable";

const TableStyles = [<ItalianTable />, <PokerTable />, <WoodTable />];

export const Table = ({ children }: { children: ReactNode }) => {
  const randomIndex = Math.floor(Math.random() * TableStyles.length);

  return (
    <div className={"relative h-[calc(100vh-120px)] w-full"}>
      {TableStyles[1]}
      <div
        className={"flex h-full w-full flex-wrap items-center justify-center"}
      >
        {children}
      </div>
    </div>
  );
};
