import type { GameState } from "../entities/GameState";

export const TARGET_SCORE = 24;

export function awardPoints(
  state: GameState,
  playerId: string,
  pts: number,
): GameState {
  if (pts <= 0) return state;

  if (state.scores.type === "team") {
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

  // individual scoring
  return {
    ...state,
    scores: {
      ...state.scores,
      values: {
        ...state.scores.values,
        [playerId]: (state.scores.values[playerId] ?? 0) + pts,
      },
    },
  };
}

/**
 * Add points directly to a team (for end-round counting in 2v2).
 */
export function awardPointsToTeam(
  state: GameState,
  teamId: number,
  pts: number,
): GameState {
  if (pts <= 0) return state;

  const key = String(teamId);
  return {
    ...state,
    scores: {
      ...state.scores,
      values: {
        ...state.scores.values,
        [key]: (state.scores.values[key] ?? 0) + pts,
      },
    },
  };
}

/**
 * If any side reaches TARGET_SCORE, flip phase to 'gameOver' and set winner.
 */
export function checkGameOver(
  state: GameState,
  target = TARGET_SCORE,
): GameState {
  const winnerEntry = Object.entries(state.scores.values).find(
    ([, score]) => score >= target,
  );
  if (!winnerEntry) return state;

  const [winnerKey] = winnerEntry;
  return {
    ...state,
    phase: "gameOver",
    winner: winnerKey,
  };
}

/**
 * End-of-round counting rule:
 * - 1v1: each player counts up to 20; extras are +1 point each
 * - 1v1v1: dealer counts up to 13; other players up to 12; extras +1 each
 * - 2v2: each team counts up to 20 (sum of captures of teammates); extras +1 each (to team score)
 */
export function applyCountingRule(state: GameState): GameState {
  if (state.phase !== "roundEnd") return state;

  const playerCount = state.players.length;
  const dealerIndex = state.players.findIndex((p) => p.id === state.dealer);

  let next = { ...state };

  if (state.scores.type === "team") {
    // 2v2: aggregate by team
    const teams = new Map<number, number>(); // teamId -> total cards
    for (const p of next.players) {
      if (p.team === undefined || p.team === null) continue;
      teams.set(p.team, (teams.get(p.team) ?? 0) + p.collected.length);
    }

    for (const [teamId, total] of teams.entries()) {
      const extra = Math.max(0, total - 20);
      if (extra > 0) {
        next = awardPointsToTeam(next, teamId, extra);
      }
    }
  } else {
    // Individual: 1v1 or 1v1v1
    if (playerCount === 2) {
      // 1v1
      for (const p of next.players) {
        const extra = Math.max(0, p.collected.length - 20);
        if (extra > 0) {
          next = awardPoints(next, p.id, extra);
        }
      }
    } else if (playerCount === 3) {
      // 1v1v1
      next.players.forEach((p, idx) => {
        const limit = idx === dealerIndex ? 13 : 12;
        const extra = Math.max(0, p.collected.length - limit);
        if (extra > 0) {
          next = awardPoints(next, p.id, extra);
        }
      });
    }
  }

  // After applying extras, check for winner
  return checkGameOver(next);
}
