const clamp = (value: number) => Math.max(0, Math.min(1, value));

// Fixed variation keeps replays repeatable, while each pickup has its own gesture.
export function captureLanding(variation: number) {
  return {
    x: 0.045 * Math.cos(variation * 1.7 + 0.4),
    y: 0.035 * Math.sin(variation * 2.1 + 1.2),
    yaw: 0.065 * Math.sin(variation * 1.3 + 0.8),
  };
}

export function captureGesture(raw: number, variation: number, height: number) {
  const t = clamp(raw) ** (1 + 0.12 * Math.sin(variation * 1.4));
  const travel = t * t * t * (t * (t * 6 - 15) + 10);
  const arc = Math.sin(Math.PI * travel);
  const settle = clamp((t - 0.76) / 0.24);
  return {
    travel,
    side: arc * (0.1 * Math.cos(variation * 1.7) + 0.035 * Math.sin(travel * Math.PI * 2)),
    lift:
      height * arc * (1.14 - 0.28 * travel) +
      0.008 * Math.sin(settle * Math.PI * 2) ** 2 * Math.sin(settle * Math.PI),
    pitch: 0.12 * arc * Math.cos(variation * 1.2 + 0.5),
    roll: 0.085 * arc * Math.sin(variation * 1.6 + 0.6),
    yaw: 0.14 * arc * Math.sin(variation * 1.1 + 0.7),
  };
}

export function captureBend(
  from: { x: number; y: number },
  to: { x: number; y: number },
  side: number,
) {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (-(to.y - from.y) / length) * side, y: ((to.x - from.x) / length) * side };
}
