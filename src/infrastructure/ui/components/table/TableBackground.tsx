import { ItalianTable } from "./ItalianTable";
import { PokerTable } from "./PokerTable";
import { WoodTable } from "./WoodTable";

const TableStyles = [<ItalianTable />, <PokerTable />, <WoodTable />];
const randomIndex = Math.floor(Math.random() * TableStyles.length);

export const TableBackground = () => {
  return TableStyles[randomIndex];
};
