import { ItalianTable } from "./ItalianTable";
import { PokerTable } from "./PokerTable";
import { WoodTable } from "./WoodTable";

const TableStyles = [<ItalianTable />, <PokerTable />, <WoodTable />];

export const Table = () => {
  const randomIndex = Math.floor(Math.random() * TableStyles.length);
  return TableStyles[randomIndex];
};
