const leadIn = 0.65;
const regularStep = 0.14;
const bonusStep = 0.56;
const flightDuration = 0.5;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

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

export function sampleCountingCard(index: number, seconds: number, total: number, quota: number) {
  const progress = clamp(
    (seconds - countingArrival(index, quota) + flightDuration) / flightDuration,
  );
  const travel = progress * progress * (3 - 2 * progress);
  const arc = Math.sin(Math.PI * progress);
  const bonus = index >= quota;
  const jitter = Math.sin(index * 2.4) * 0.045;
  const targetX = bonus ? 0 : -0.9 + jitter;
  const targetY = bonus ? 0 : -0.45 + Math.cos(index * 1.7) * 0.035;
  const sourceZ = 0.065 + (total - index) * 0.008;
  const targetZ = bonus ? 0.8 : 0.065 + index * 0.008;
  return {
    travel,
    position: [
      2.1 + (targetX - 2.1) * travel + arc * 0.12,
      -0.6 + (targetY + 0.6) * travel + arc * (0.25 + jitter),
      sourceZ + (targetZ - sourceZ) * travel + arc * 0.55,
    ] as [number, number, number],
    rotation: [
      arc * 0.13,
      Math.PI + arc * (bonus ? 0.65 : 0.22),
      jitter + arc * (bonus ? -0.32 : 0.18),
    ] as [number, number, number],
    scale: bonus ? 1 - Math.pow(clamp((progress - 0.66) / 0.34), 2) : 1,
    visible: !bonus || progress < 1,
  };
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
    pose(index: number) {
      return sampleCountingCard(index, seconds, total, quota);
    },
  };
}
