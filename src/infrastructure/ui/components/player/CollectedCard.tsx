import type { Card } from "@/domain/entities/Card";
import { Card as CardComponent } from "@/infrastructure/ui/components/card/Card";

type CollectedCardProps = {
  card: Card;
  index: number;
};

export const CollectedCard = ({ card, index }: CollectedCardProps) => {
  const randomDeg = `rotate(${Math.floor(Math.random() * (50 - -50)) + -50}deg)`;

  return (
    <CardComponent
      rank={card.rank}
      suit={card.suit}
      faceDown={true}
      style={{ transform: randomDeg, position: "absolute", zIndex: index }}
      disabled={true}
    />
  );
};
