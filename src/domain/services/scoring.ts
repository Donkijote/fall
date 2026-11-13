import type { GameState } from "../entities/GameState";

export const TARGET_SCORE = 24;

export function awardPoints(state: GameState, playerId: string, pts: number): GameState {
  if (pts <= 0) return state;

  const player = state.players.find((p) => p.id === playerId);
  if (player?.team === undefined || player?.team === null) return state;

  const teamKey = String(player.team);
  return {
    ...state,
    scores: {
      ...state.scores,
      values: {
        ...state.scores.values,
        [teamKey]: (state.scores.values[teamKey] ?? 0) + pts,
      },
    },
  };
}

/**
 * If any side reaches TARGET_SCORE, flip phase to 'gameOver' and set winner.
 */
export function checkGameOver(state: GameState, target = TARGET_SCORE): GameState {
  const winnerEntry = Object.entries(state.scores.values).find(([, score]) => score >= target);
  if (!winnerEntry) return state;

  const [winnerKey] = winnerEntry;
  return {
    ...state,
    phase: "gameOver",
    winner: winnerKey,
  };
}

export function getCountingGroups(state: GameState) {
  const groups = new Map<
    number,
    { side: number; playerId: string; cards: number; quota: number }
  >();
  for (const player of state.players) {
    const quota =
      state.scores.type === "individual" && state.players.length === 3
        ? player.id === state.dealer
          ? 13
          : 12
        : 20;
    groups.set(player.team, {
      side: player.team,
      playerId: player.id,
      cards: (groups.get(player.team)?.cards ?? 0) + player.collected.length,
      quota,
    });
  }
  return [...groups.values()];
}

export function applyCountingRule(state: GameState): GameState {
  if (state.phase !== "roundEnd") return state;

  let next = state;
  for (const group of getCountingGroups(state)) {
    next = awardPoints(next, group.playerId, group.cards - group.quota);
  }
  next = checkGameOver(next, state.config.targetPoints);
  return {
    ...next,
    players: next.players.map((player) => ({ ...player, collected: [] })),
  };
}
