const freshService = async () => {
  vi.resetModules();
  vi.unmock("@/application/services/AnimationService");
  return await import("@/application/services/AnimationService");
};

const macrotask = () => new Promise<void>((r) => setTimeout(r, 0));

describe("AnimationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("play calls registered handler with the correct payload", async () => {
    const { onAnimation, animationService, AnimationKeys } =
      await freshService();

    const handler = vi.fn();
    const off = onAnimation(AnimationKeys.GAME_CARDS, handler);

    const payload = { suit: "coins", rank: 7 };
    await animationService.play(AnimationKeys.GAME_CARDS, payload);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(payload);

    off();
  });

  it("unsubscribe (off) stops the handler from being called", async () => {
    const { onAnimation, animationService, AnimationKeys } =
      await freshService();

    const handler = vi.fn();
    const off = onAnimation(AnimationKeys.GAME_CARDS, handler);
    off();

    await animationService.play(AnimationKeys.GAME_CARDS, {
      suit: "cups",
      rank: 12,
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("run (sequential) awaits each step until handler promise resolves", async () => {
    const { onAnimation, animationService, AnimationKeys } =
      await freshService();

    const gates: Array<() => void> = [];

    onAnimation(AnimationKeys.GAME_CARDS, () => {
      return new Promise<void>((resolve) => {
        gates.push(resolve);
      });
    });

    const step1 = {
      key: AnimationKeys.GAME_CARDS,
      payload: { suit: "coins", rank: 1 },
    };
    const step2 = {
      key: AnimationKeys.GAME_CARDS,
      payload: { suit: "cups", rank: 2 },
    };

    let done = false;
    const promises = animationService.run([step1, step2]); // sequential by default
    promises.then(() => {
      done = true;
    });

    await macrotask();
    expect(gates.length).toBe(1);
    expect(done).toBe(false);

    gates[0]();
    await macrotask();

    expect(gates.length).toBe(2);
    expect(done).toBe(false);

    gates[1]();
    await promises;

    expect(done).toBe(true);
  });

  it("run (parallel) waits for all steps to complete", async () => {
    const { onAnimation, animationService, AnimationKeys } =
      await freshService();

    onAnimation(AnimationKeys.GAME_CARDS, (payload) => {
      return new Promise<void>((resolve) => {
        animationService._registerWaiter(
          AnimationKeys.GAME_CARDS,
          payload,
          resolve,
        );
      });
    });

    const firstAnimation = {
      key: AnimationKeys.GAME_CARDS,
      payload: { suit: "coins", rank: 3 },
    };
    const secondAnimation = {
      key: AnimationKeys.GAME_CARDS,
      payload: { suit: "swords", rank: 4 },
    };

    let done = false;
    const results = animationService.run([firstAnimation, secondAnimation], {
      parallel: true,
    });
    results.then(() => {
      done = true;
    });

    await Promise.resolve();
    expect(done).toBe(false);

    // Resolve only one of them
    animationService.dispatch(AnimationKeys.GAME_CARDS, firstAnimation.payload);
    await Promise.resolve();
    expect(done).toBe(false);

    // Resolve the second → overall run finishes
    animationService.dispatch(
      AnimationKeys.GAME_CARDS,
      secondAnimation.payload,
    );
    await results;
    expect(done).toBe(true);
  });

  it("dispatch resolves all pending waiters for the same correlation id", async () => {
    const { animationService, AnimationKeys } = await freshService();

    const payload = { suit: "clubs", rank: 9 };

    const firstRegisteredAnimation = new Promise<void>((resolve) => {
      animationService._registerWaiter(
        AnimationKeys.GAME_CARDS,
        payload,
        resolve,
      );
    });
    const secondRegisteredAnimation = new Promise<void>((resolve) => {
      animationService._registerWaiter(
        AnimationKeys.GAME_CARDS,
        payload,
        resolve,
      );
    });

    let firstResolved = false,
      secondResolved = false;
    firstRegisteredAnimation.then(() => {
      firstResolved = true;
    });
    secondRegisteredAnimation.then(() => {
      secondResolved = true;
    });

    await Promise.resolve();
    expect(firstResolved).toBe(false);
    expect(secondResolved).toBe(false);

    animationService.dispatch(AnimationKeys.GAME_CARDS, payload);

    await Promise.all([firstRegisteredAnimation, secondRegisteredAnimation]);
    expect(firstResolved).toBe(true);
    expect(secondResolved).toBe(true);
  });

  it("play with no listeners does nothing (no throw)", async () => {
    const { animationService, AnimationKeys } = await freshService();
    await expect(
      animationService.play(AnimationKeys.GAME_CARDS, {
        suit: "coins",
        rank: 7,
      }),
    ).resolves.toBeUndefined();
  });
});
