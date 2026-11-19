const leadIn = 0.65;
const regularStep = 0.14;
const bonusStep = 0.56;
const flightDuration = 0.5;

export function countingArrival(index: number, quota: number) {
  return (
    leadIn +
    (index >= quota ? 0.45 : 0) +
    Math.min(index, quota) * regularStep +
    Math.max(0, index - quota) * bonusStep +
    flightDuration
  );
}

export function countingProgress(seconds: number, total: number, quota: number) {
  let counted = 0;
  for (let index = 0; index < total; index++) {
    if (seconds >= countingArrival(index, quota)) counted++;
  }
  return { counted, points: Math.max(0, counted - quota), complete: counted === total };
}

export type CountingSnapshot = ReturnType<typeof countingProgress> & { seconds: number };

export function createCountingPlayback(total: number, quota: number, playCard: () => void) {
  let seconds = 0;
  let counted = 0;
  return {
    advance(delta: number, speed = 1) {
      seconds += Math.min(delta, 0.05) * speed;
      const progress = countingProgress(seconds, total, quota);
      if (progress.counted > counted) playCard();
      counted = progress.counted;
      return { ...progress, seconds };
    },
  };
}
