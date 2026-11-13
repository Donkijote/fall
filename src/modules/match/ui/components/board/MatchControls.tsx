import { useState } from "react";

import { ActionButton } from "@/components/actions/ActionButton";
import { FramedCard } from "@/components/surfaces/FramedCard";
import type { DealOrder, GameState, TablePattern } from "@/domain/entities/GameState";

import { localPlayerId, openDeal, type MatchFrame } from "../../../application/localMatch";

const selectStyle =
  "min-h-10 rounded-md border border-input bg-background px-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

function DealerControls({ deal }: { deal: (order: DealOrder, pattern: TablePattern) => void }) {
  const [order, setOrder] = useState<DealOrder>("playersThenTable");
  const [pattern, setPattern] = useState<TablePattern>("inc");
  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        deal(order, pattern);
      }}
    >
      <h2 className="text-base">Choose the opening deal</h2>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <label className="grid gap-1">
          Deal order
          <select
            className={selectStyle}
            value={order}
            onChange={(event) => setOrder(event.target.value as DealOrder)}
          >
            <option value="playersThenTable">Hands first</option>
            <option value="tableThenPlayers">Table first</option>
          </select>
        </label>
        <label className="grid gap-1">
          Table pattern
          <select
            className={selectStyle}
            value={pattern}
            onChange={(event) => setPattern(event.target.value as TablePattern)}
          >
            <option value="inc">1–2–3–4</option>
            <option value="dec">4–3–2–1</option>
          </select>
        </label>
      </div>
      <ActionButton type="submit" tone="primary" className="justify-self-center">
        Deal cards
      </ActionButton>
    </form>
  );
}

export function MatchControls({
  frame,
  sideName,
  act,
  close,
}: {
  frame: MatchFrame;
  sideName: (side: string) => string;
  act: (transition: (state: GameState) => MatchFrame[]) => void;
  close: () => void;
}) {
  const { state, motion } = frame;
  const localDeal = state.phase === "dealerChoice" && state.dealer === localPlayerId;
  if (!localDeal && state.phase !== "gameOver" && motion?.kind !== "count") return null;

  return (
    <FramedCard className="absolute top-[55%] left-1/2 z-10 w-max max-w-[calc(100%-2rem)] -translate-1/2 gap-2 px-4 py-3 text-center">
      {localDeal && (
        <DealerControls
          deal={(order, pattern) => act((current) => openDeal(current, order, pattern))}
        />
      )}
      {motion?.kind === "count" && (
        <>
          <h2 className="text-base">Counting captures</h2>
          <ul className="flex flex-wrap justify-center gap-3 text-xs tabular-nums">
            {motion.groups.map(({ side, cards, quota }) => (
              <li key={side} className="grid gap-1">
                <strong>{sideName(String(side))}</strong>
                <span data-count-side={side} data-total={cards} aria-hidden="true">
                  0/{cards} cards · +0
                </span>
                <span className="sr-only">
                  {cards} cards, quota {quota}, {Math.max(0, cards - quota)} points
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {state.phase === "gameOver" && !motion && (
        <>
          <h2 tabIndex={-1} data-match-result="" className="text-lg outline-none">
            {state.players.find(({ id }) => id === localPlayerId)?.team.toString() === state.winner
              ? state.scores.type === "team"
                ? "Your team wins!"
                : "You win!"
              : state.scores.type === "team"
                ? "Opponents win!"
                : `${sideName(state.winner ?? "")} wins!`}
          </h2>
          <ActionButton tone="primary" className="self-center" onClick={close}>
            Back to Tavern
          </ActionButton>
        </>
      )}
    </FramedCard>
  );
}
