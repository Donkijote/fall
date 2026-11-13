import type { GameState } from "@/domain/entities/GameState";

export function MatchScoreboard({
  state,
  sideName,
}: {
  state: GameState;
  sideName: (side: string) => string;
}) {
  const sides = [...new Set(state.players.map(({ team }) => String(team)))];

  return (
    <ul
      aria-label="Scores"
      className="pointer-events-none absolute bottom-[calc(var(--safe-area-bottom)+0.25rem)] left-[calc(var(--safe-area-left)+0.25rem)] z-10 flex max-w-[calc(100%-var(--safe-area-left)-var(--safe-area-right)-0.5rem)] flex-wrap gap-x-2 rounded-md border border-gold/55 bg-artwork-shadow/90 px-2 py-1 text-[clamp(0.65rem,1.75cqmin,0.95rem)] text-artwork-foreground tabular-nums"
    >
      {sides.map((side) => (
        <li key={side} className="whitespace-nowrap">
          {sideName(side)} <strong className="text-gold">{state.scores.values[side] ?? 0}</strong>
        </li>
      ))}
    </ul>
  );
}
