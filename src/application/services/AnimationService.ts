export const AnimationKeys = {
  GAME_CARDS: "GAME_CARDS",
} as const;

export type AnimationKey = (typeof AnimationKeys)[keyof typeof AnimationKeys];

type Payloads = {
  [AnimationKeys.GAME_CARDS]: { suit: string; rank: number };
};

type HandlerMap = {
  [K in AnimationKey]: Set<(p: Payloads[K]) => Promise<void> | void>;
};

const listeners: HandlerMap = {
  [AnimationKeys.GAME_CARDS]: new Set(),
};

export const onAnimation = <K extends AnimationKey>(
  key: K,
  handler: (p: Payloads[K]) => Promise<void> | void,
) => {
  listeners[key].add(handler);
  return () => listeners[key].delete(handler);
};

const play = async <K extends AnimationKey>(key: K, payload: Payloads[K]) => {
  const set = listeners[key];
  if (!set?.size) return;
  await Promise.all([...set].map((h) => Promise.resolve(h(payload))));
};

export const animationService = {
  play,
  run: async (
    steps: Array<{ key: AnimationKey; payload: Payloads[AnimationKey] }>,
    opts?: { parallel?: boolean },
  ) => {
    if (opts?.parallel) {
      await Promise.all(steps.map(({ key, payload }) => play(key, payload)));
      return;
    }
    for (const { key, payload } of steps) {
      await play(key, payload);
    }
  },
};
