import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UiHand } from "@/infrastructure/adapters/handWithMeta";
import { Card as PlayingCard } from "@/infrastructure/ui/components/card/Card";

export const SingsList = ({ sings }: { sings: Array<UiHand> }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {sings.map((hand) => (
      <Card key={hand.id} size="sm">
        <CardHeader>
          <CardTitle className="title-type font-normal">
            <h3>{hand.name}</h3>
          </CardTitle>
          <CardAction>
            <Badge>{hand.points} pts</Badge>
          </CardAction>
          {hand.description && <CardDescription>{hand.description}</CardDescription>}
        </CardHeader>
        {hand.example?.length ? (
          <CardContent className="flex gap-2">
            {hand.example.map((card, index) => (
              <PlayingCard
                key={card.suit + card.rank + index}
                rank={card.rank}
                suit={card.suit}
                size="sm"
              />
            ))}
          </CardContent>
        ) : null}
        <CardFooter className="flex-wrap gap-2">
          {hand.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    ))}
  </div>
);
