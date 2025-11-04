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

type CorrelatorMap = {
  [K in AnimationKey]: (p: Payloads[K]) => string;
};
const correlate: CorrelatorMap = {
  [AnimationKeys.GAME_CARDS]: (p) => `${p.suit}-${p.rank}`,
};

type PendingMap = {
  [K in AnimationKey]: Map<string, Array<() => void>>;
};
const pending: PendingMap = {
  [AnimationKeys.GAME_CARDS]: new Map(),
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

  dispatch: <K extends AnimationKey>(key: K, detail: Payloads[K]) => {
    const id = correlate[key](detail);
    const list = pending[key].get(id);
    if (!list || list.length === 0) return;
    for (const resolve of list) resolve();
    pending[key].delete(id);
  },

  _registerWaiter: <K extends AnimationKey>(
    key: K,
    payload: Payloads[K],
    resolve: () => void,
  ) => {
    const id = correlate[key](payload);
    const arr = pending[key].get(id) ?? [];
    arr.push(resolve);
    pending[key].set(id, arr);
  },
};
