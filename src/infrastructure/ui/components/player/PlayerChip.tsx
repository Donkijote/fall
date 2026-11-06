import { clsx } from "clsx";
import { Bot, UserRound } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { GameState } from "@/domain/entities/GameState";

type PlayerChipProps = {
  name: string;
  score: GameState["scores"]["values"];
  avatar?: string;
  team?: number;
  isMainPlayer?: boolean;
  isDealer: boolean;
};

export const PlayerChip = ({
  name,
  score,
  avatar,
  team,
  isMainPlayer,
  isDealer,
}: PlayerChipProps) => {
  const teamId = team ?? 1;
  const scoreValue = score[teamId.toString()] ?? 0;
  const isBot = name.toLowerCase().includes("bot");

  return (
    <Card size="sm" className="overflow-visible py-2">
      <CardContent className="flex flex-col items-center gap-1 px-3">
        <Avatar
          className={clsx(
            "size-10 md:size-12",
            isMainPlayer && "ring-2 ring-ring ring-offset-2 ring-offset-card",
          )}
        >
          {avatar && <AvatarImage src={avatar} alt={name} />}
          <AvatarFallback>
            {isBot ? <Bot aria-label="Bot" /> : <UserRound aria-label="Player" />}
          </AvatarFallback>
          {isDealer && (
            <AvatarBadge aria-label="Dealer" className="size-5 text-[10px]">
              D
            </AvatarBadge>
          )}
        </Avatar>
        <p className="max-w-28 truncate text-xs font-semibold">{name}</p>
        <div className="flex items-center gap-1">
          <Badge variant="outline">Team {teamId}</Badge>
          <Badge variant="secondary">{scoreValue} pts</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
