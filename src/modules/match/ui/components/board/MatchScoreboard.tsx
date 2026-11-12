import type { MatchFrame } from "../../../application/localMatch";
import { localPlayerId } from "../../../application/localMatch";

export function MatchScoreboard({
  title,
  frame,
  sideName,
  playerName,
}: {
  title: string;
  frame: MatchFrame;
  sideName: (side: string) => string;
  playerName: (id: string) => string;
}) {
  const { state, motion } = frame;
  const sides = [...new Set(state.players.map(({ team }) => String(team)))];
  const status =
    motion?.kind === "deal"
      ? "Dealing cards"
      : motion?.kind === "play"
        ? `${playerName(motion.player)} played a card`
        : motion?.kind === "collect"
          ? `${motion.capture === "fall" ? "Fall · " : ""}${
              motion.player === localPlayerId
                ? "Collecting your cards"
                : `${playerName(motion.player)} is collecting cards`
            }`
          : state.phase === "gameOver"
            ? "Match complete"
            : state.phase === "roundEnd"
              ? "Round complete"
              : state.phase === "dealerChoice"
                ? state.dealer === localPlayerId
                  ? "You are the dealer"
                  : `${playerName(state.dealer)} is dealing`
                : state.currentPlayer === localPlayerId
                  ? "Your turn · Play a card"
                  : `${playerName(state.currentPlayer)}’s turn`;

  return (
    <header className="absolute top-[calc(var(--safe-area-top)+0.5rem)] left-1/2 z-10 grid w-max max-w-[calc(100%-6rem)] -translate-x-1/2 justify-items-center gap-1 rounded-md border border-gold/55 bg-artwork-shadow/90 px-2 py-1 text-center text-artwork-foreground sm:px-3">
      <h1 className="artwork-title text-[clamp(0.85rem,2.4cqmin,1.4rem)] font-normal">{title}</h1>
      <ul
        aria-label={`Scores · first to ${state.config.targetPoints}`}
        className="flex flex-wrap justify-center gap-x-2 text-[clamp(0.65rem,1.75cqmin,0.95rem)] tabular-nums"
      >
        {sides.map((side) => (
          <li key={side} className="whitespace-nowrap">
            {sideName(side)} <strong className="text-gold">{state.scores.values[side] ?? 0}</strong>
          </li>
        ))}
      </ul>
      <p role="status" className="text-[clamp(0.625rem,1.6cqmin,0.875rem)]">
        {status}
      </p>
    </header>
  );
}
