import WoodTableImg from "@/assets/tables/WoodTable.webp";

export const WoodTable = () => {
  return (
    <img
      src={WoodTableImg}
      alt="PokerTable"
      className={"object-fit absolute h-full w-full"}
      data-testid={"WoodTable"}
    />
  );
};
