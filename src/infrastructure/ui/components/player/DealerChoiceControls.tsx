import { ArrowDown10, ArrowUp10, Play, Table, Users } from "lucide-react";
import { useState } from "react";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GameState } from "@/domain/entities/GameState";

type DealerChoiceControlsProps = { isOpen: boolean };

export const DealerChoiceControls = ({ isOpen }: DealerChoiceControlsProps) => {
  const [dealOrder, setDealOrder] = useState<GameState["config"]["dealOrder"] | null>(null);
  const [tablePattern, setTablePattern] = useState<GameState["config"]["tablePattern"] | null>(
    null,
  );
  const { dealerChoose } = useGameStoreService();
  const ready = dealOrder !== null && tablePattern !== null;
  if (!isOpen) return null;

  return (
    <Card size="sm" className="absolute -top-36 left-1/2 z-40 w-60 -translate-x-1/2">
      <CardContent className="grid gap-2">
        <div role="group" aria-label="Deal order" className="flex justify-center gap-2">
          <Button
            size="icon-sm"
            variant={dealOrder === "playersThenTable" ? "default" : "outline"}
            aria-label="Players → Table"
            title="Players → Table"
            aria-pressed={dealOrder === "playersThenTable"}
            onClick={() => setDealOrder("playersThenTable")}
          >
            <Users />
          </Button>
          <Button
            size="icon-sm"
            variant={dealOrder === "tableThenPlayers" ? "default" : "outline"}
            aria-label="Table → Players"
            title="Table → Players"
            aria-pressed={dealOrder === "tableThenPlayers"}
            onClick={() => setDealOrder("tableThenPlayers")}
          >
            <Table />
          </Button>
          <Button
            size="icon-sm"
            variant={tablePattern === "inc" ? "default" : "outline"}
            aria-label="Incremental"
            title="Incremental"
            aria-pressed={tablePattern === "inc"}
            onClick={() => setTablePattern("inc")}
          >
            <ArrowUp10 />
          </Button>
          <Button
            size="icon-sm"
            variant={tablePattern === "dec" ? "default" : "outline"}
            aria-label="Decremental"
            title="Decremental"
            aria-pressed={tablePattern === "dec"}
            onClick={() => setTablePattern("dec")}
          >
            <ArrowDown10 />
          </Button>
        </div>
        <Button
          disabled={!ready}
          onClick={() => {
            if (dealOrder && tablePattern) dealerChoose(dealOrder, tablePattern);
          }}
        >
          <Play />
          Confirm
        </Button>
      </CardContent>
    </Card>
  );
};
