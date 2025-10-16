import PokerTableImg from "@/assets/tables/PokerTable.webp";

export const PokerTable = () => {
  return (
    <img
      src={PokerTableImg}
      alt="PokerTable"
      className={"absolute h-full w-full object-cover"}
      data-testid={"PokerTable"}
    />
  );
};
