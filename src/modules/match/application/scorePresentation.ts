import type { GameState, ScoreAward } from "@/domain/entities/GameState";

export type ScorePresentation = {
  totals: Record<string, number>;
  displayed: Record<string, number>;
  seen: ReadonlySet<string>;
  pending: ScoreAward[];
  announcement: string;
};

export function snapshotScores(
  state: GameState,
  alreadySeen: ReadonlySet<string> = new Set(),
): ScorePresentation {
  return {
    totals: state.scores.values,
    displayed: state.scores.values,
    seen: new Set([...alreadySeen, ...(state.scoreAwards ?? []).map(({ id }) => id)]),
    pending: [],
    announcement: "",
  };
}

/** Consume resolved events only. A correction/missing history settles as a snapshot. */
export function receiveScores(current: ScorePresentation, state: GameState): ScorePresentation {
  const seen = new Set(current.seen);
  const fresh = (state.scoreAwards ?? []).filter((award) => {
    if (seen.has(award.id)) return false;
    seen.add(award.id);
    return true;
  });
  const expected = { ...current.totals };
  for (const award of fresh) expected[award.side] = (expected[award.side] ?? 0) + award.amount;
  const sides = new Set([...Object.keys(expected), ...Object.keys(state.scores.values)]);
  if ([...sides].some((side) => (expected[side] ?? 0) !== (state.scores.values[side] ?? 0))) {
    return snapshotScores(state, seen);
  }
  return {
    ...current,
    seen,
    totals: state.scores.values,
    pending: [...current.pending, ...fresh],
    announcement: fresh.length && !current.pending.length ? "" : current.announcement,
  };
}

export function arriveScore(
  current: ScorePresentation,
  id: string,
  announcement: string,
): ScorePresentation {
  const award = current.pending[0];
  if (!award || award.id !== id) return current;
  const pending = current.pending.slice(1);
  return {
    ...current,
    pending,
    displayed: pending.length
      ? { ...current.displayed, [award.side]: (current.displayed[award.side] ?? 0) + award.amount }
      : current.totals,
    announcement: current.announcement ? `${current.announcement}. ${announcement}` : announcement,
  };
}

export function scoreAwardLabel(award: ScoreAward) {
  return (
    award.detail ??
    {
      opening: "Opening bonus",
      sing: "Sing",
      clear: "Clear table",
      fall: "Fall",
      count: "Captured cards",
      other: "Points earned",
    }[award.reason]
  );
}
