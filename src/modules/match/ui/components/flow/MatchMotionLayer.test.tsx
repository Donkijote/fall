import gsap from "gsap";
import { StrictMode } from "react";

import { act, render } from "@testing-library/react";

import type { CardScene, PlaybackChannel } from "../../../adapters/three/matchCardScene";
import { playMatchCard, startMatch, type MatchFrame } from "../../../application/localMatch";
import { MatchMotionLayer } from "./MatchMotionLayer";

const mocks = vi.hoisted(() => ({
  audio: { playCard: vi.fn(), playDealCard: vi.fn(), playCapture: vi.fn(), stop: vi.fn() },
  measure: vi.fn(),
  channel: undefined as PlaybackChannel | undefined,
  fail: undefined as (() => void) | undefined,
}));
vi.mock("@/infrastructure/ui/hooks/useMotionAudio", () => {
  const ref = { current: mocks.audio };
  return { useMotionAudio: () => ref };
});
vi.mock("./measureCardScene", () => ({ measureCardScene: mocks.measure }));
vi.mock("../../../adapters/three/MatchCardCanvas", () => ({
  default: ({ channel }: { channel: PlaybackChannel }) => {
    mocks.channel = channel;
    return null;
  },
}));
vi.mock("@/components/surfaces/SceneBoundary", () => ({
  SceneBoundary: ({
    children,
    onFailure,
  }: {
    children: React.ReactNode;
    onFailure: () => void;
  }) => {
    mocks.fail = onFailure;
    return children;
  },
}));
const state = startMatch("1vs1")[0].state;
function frame(
  rank = 12,
  capture: "fall" | "card" | "cascade" | "sweep" = "fall",
  count = 1,
): MatchFrame {
  return {
    state: { ...state, table: [{ suit: "cups", rank: rank as 10 | 11 | 12 }] },
    motion: {
      kind: "collect",
      capture,
      card: `coins-${rank}` as "coins-12",
      targets: Array.from({ length: count }, (_, index) =>
        index === 0 ? (`cups-${rank}` as "cups-12") : "swords-1",
      ),
      player: "local",
    },
  };
}
let timelines: gsap.core.Timeline[];
beforeEach(() => {
  vi.clearAllMocks();
  mocks.channel = undefined;
  mocks.fail = undefined;
  mocks.measure.mockReturnValue(undefined);
  timelines = [];
  const create = gsap.timeline.bind(gsap);
  vi.spyOn(gsap, "timeline").mockImplementation((options) => {
    const timeline = create(options);
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => {
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function mount(current: MatchFrame, reducedMotion = true) {
  const board = { current: document.createElement("div") };
  const complete = vi.fn();
  const props = { board, frame: current, reducedMotion, returning: false, complete };
  return { ...render(<MatchMotionLayer {...props} />), props, complete };
}

it.each([true, false])(
  "uses the approved flame sequence without WebGL (reduced motion: %s)",
  (reduced) => {
    vi.stubGlobal("WebGL2RenderingContext", undefined);
    const view = mount(frame(), reduced);
    const timeline = timelines[0];
    act(() => {
      timeline.time(0.001, false);
    });
    expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"]]);
    act(() => {
      timeline.time(0.22, false);
    });
    expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"]]);
    act(() => {
      timeline.time(0.421, false);
    });
    expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
    expect(mocks.audio.playCard).not.toHaveBeenCalled();
    act(() => {
      timeline.progress(1, false);
    });
    expect(view.complete).toHaveBeenCalledOnce();
    view.unmount();
    expect(mocks.audio.stop).not.toHaveBeenCalled();
  },
);

it.each([
  [10, "shatter"],
  [11, "soft-contact"],
  [7, "capture"],
] as const)("maps resolved Fall rank %s to its approved contact cue", (rank, cue) => {
  mount(frame(rank));
  act(() => {
    timelines[0].time(0.421, false);
  });
  expect(mocks.audio.playCapture).toHaveBeenLastCalledWith(cue);
  expect(mocks.audio.playCapture).toHaveBeenCalledTimes(rank === 7 ? 2 : 3);
});

it("keeps ordinary capture on play-card audio and sweep silent", () => {
  const view = mount(frame(7, "card"));
  act(() => {
    timelines[0].progress(1, false);
  });
  expect(mocks.audio.playCard).toHaveBeenCalledOnce();
  expect(mocks.audio.playCapture).not.toHaveBeenCalled();
  view.rerender(<MatchMotionLayer {...view.props} frame={frame(7, "sweep")} />);
  act(() => {
    timelines[1].progress(1, false);
  });
  expect(mocks.audio.playCard).toHaveBeenCalledOnce();
  expect(mocks.audio.playCapture).not.toHaveBeenCalled();
});

it("plays a Fall once before its cascade pickups", () => {
  mount(frame(12, "fall", 3));
  act(() => {
    timelines[0].progress(1, false);
  });
  expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
  expect(mocks.audio.playCard).toHaveBeenCalledTimes(2);
});

it("stops interrupted fallback wind when leaving and prevents later contact", () => {
  const view = mount(frame());
  const timeline = timelines[0];
  act(() => {
    timeline.time(0.001, false);
  });
  view.rerender(<MatchMotionLayer {...view.props} returning />);
  expect(mocks.audio.stop).toHaveBeenCalledOnce();
  act(() => {
    gsap.updateRoot(10);
  });
  expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"]]);
  expect(view.complete).not.toHaveBeenCalled();
});

it("restarts the fallback timeline correctly after Strict Mode cleanup", () => {
  const props = {
    board: { current: document.createElement("div") },
    frame: frame(),
    reducedMotion: true,
    returning: false,
    complete: vi.fn(),
  };
  render(
    <StrictMode>
      <MatchMotionLayer {...props} />
    </StrictMode>,
  );
  act(() => {
    timelines.at(-1)!.progress(1, false);
  });
  expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
  expect(props.complete).toHaveBeenCalledOnce();
});

it("passes the same cue port into rendered playback and avoids replay after a renderer failure", async () => {
  vi.stubGlobal("WebGL2RenderingContext", class {});
  const scene = {
    kind: "collect",
    capture: "fall",
    targets: [],
    pile: { x: 0, y: 0, z: 0 },
    pileSize: 1,
  } satisfies CardScene;
  mocks.measure.mockReturnValue({ scene, hidden: [] });
  const view = mount(frame(), false);
  await act(async () => {});
  const playback = mocks.channel!.getSnapshot()!;
  act(() => {
    playback.handoff(2);
    playback.audio.playCapture!("flame-rise");
  });
  expect(mocks.audio.playCapture).toHaveBeenCalledExactlyOnceWith("flame-rise");
  act(() => {
    mocks.fail!();
  });
  expect(mocks.audio.playCapture).toHaveBeenCalledOnce();
  expect(mocks.audio.stop).toHaveBeenCalled();
  expect(view.complete).toHaveBeenCalledOnce();
});

it("uses the audio-only sequence once when the renderer misses its startup deadline", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("WebGL2RenderingContext", class {});
  mocks.measure.mockReturnValue({
    scene: { kind: "collect", capture: "fall", targets: [] },
    hidden: [],
  });
  const view = mount(frame(), false);
  await act(async () => {});
  act(() => {
    vi.advanceTimersByTime(3500);
  });
  expect(mocks.audio.playCard).not.toHaveBeenCalled();
  expect(timelines).toHaveLength(1);
  act(() => {
    timelines[0].progress(1, false);
  });
  expect(mocks.audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
  expect(view.complete).toHaveBeenCalledOnce();
});

it.each([false, true])(
  "keeps resolved table captures off Fall sounds (consecutive ranks: %s)",
  (cascade) => {
    const card = { suit: "coins", rank: 3 } as const;
    const target = { suit: "swords", rank: 3 } as const;
    const previous = { suit: "cups", rank: 6 } as const;
    const current: MatchFrame["state"] = {
      ...state,
      phase: "play",
      currentPlayer: "local",
      lastPlayedCard: previous,
      table: cascade ? [target, { suit: "clubs", rank: 4 }, previous] : [target, previous],
      players: state.players.map((player) =>
        player.id === "local" ? { ...player, hand: [card, { suit: "clubs", rank: 2 }] } : player,
      ),
    };
    const resolved = playMatchCard(current, "local", card)[0];
    expect(resolved.motion).toMatchObject({
      kind: "collect",
      capture: cascade ? "cascade" : "card",
    });
    const view = mount(resolved);
    act(() => {
      timelines[0].progress(1, false);
    });
    expect(mocks.audio.playCapture).not.toHaveBeenCalled();
    expect(mocks.audio.playCard).toHaveBeenCalledTimes(cascade ? 2 : 1);
    expect(view.complete).toHaveBeenCalledOnce();
  },
);

it("retains ordinary play, deal and count sounds in fallback playback", () => {
  vi.useFakeTimers();
  const current: MatchFrame = { state, motion: { kind: "play", card: "coins-1", player: "local" } };
  const view = mount(current);
  expect(mocks.audio.playCard).toHaveBeenCalledOnce();
  expect(view.complete).toHaveBeenCalledOnce();
  view.rerender(
    <MatchMotionLayer
      {...view.props}
      frame={{ state, motion: { kind: "deal", cards: [], dealer: "local" } }}
    />,
  );
  expect(mocks.audio.playDealCard).toHaveBeenCalledOnce();
  expect(view.complete).toHaveBeenCalledTimes(2);
  view.rerender(
    <MatchMotionLayer
      {...view.props}
      frame={{ state, motion: { kind: "count", groups: [], piles: [] } }}
    />,
  );
  expect(mocks.audio.playDealCard).toHaveBeenCalledTimes(2);
  expect(mocks.audio.playCapture).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(1100);
  });
  expect(view.complete).toHaveBeenCalledTimes(3);
});

it("stops a started but stalled sequence without replaying its sounds", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("WebGL2RenderingContext", class {});
  mocks.measure.mockReturnValue({
    scene: { kind: "collect", capture: "fall", targets: [] },
    hidden: [],
  });
  const view = mount(frame(), false);
  await act(async () => {});
  const playback = mocks.channel!.getSnapshot()!;
  act(() => {
    playback.handoff(1);
    playback.audio.playCapture!("flame-rise");
  });
  act(() => {
    vi.advanceTimersByTime(4000);
  });
  expect(mocks.audio.playCapture).toHaveBeenCalledExactlyOnceWith("flame-rise");
  expect(mocks.audio.stop).toHaveBeenCalledOnce();
  expect(view.complete).toHaveBeenCalledOnce();
});

it("reveals each opening source at its landing and restores visibility on interruption", async () => {
  vi.stubGlobal("WebGL2RenderingContext", class {});
  const board = { current: document.createElement("div") };
  const card = document.createElement("div");
  card.dataset.tableCard = "coins-1";
  board.current.append(card);
  const scene: CardScene = { kind: "deal", deck: { x: 0, y: 0, z: 0 }, deckSize: 1, cards: [] };
  mocks.measure.mockReturnValue({ scene, hidden: [card] });
  const complete = vi.fn();
  const openingTable = {
    land: vi.fn((timeline: gsap.core.Timeline) => timeline.to({}, { duration: 0.6 })),
    celebrate: vi.fn(),
  };
  const current: MatchFrame = {
    state,
    motion: {
      kind: "deal",
      dealer: "local",
      cards: ["coins-1"],
      openingTable: { cards: ["coins-1"] },
    },
  };
  const view = render(
    <MatchMotionLayer
      board={board}
      frame={current}
      reducedMotion={false}
      returning={false}
      complete={complete}
      openingTable={openingTable}
    />,
  );
  await act(async () => {});
  expect(card.style.visibility).toBe("hidden");
  const playback = mocks.channel!.getSnapshot()!;
  const timeline = gsap.timeline({ paused: true });
  const context = gsap.context(() => {
    timeline.to({}, { duration: 0.72 });
    playback.openingTable!.land(timeline, "coins-1");
    playback.openingTable!.celebrate(timeline);
  });
  timeline.time(0.7, false);
  expect(card.style.visibility).toBe("hidden");
  timeline.time(0.73, false);
  expect(card.style.visibility).toBe("visible");
  expect(openingTable.land).toHaveBeenCalledOnce();
  expect(openingTable.celebrate).toHaveBeenCalledOnce();
  view.unmount();
  context.revert();
  expect(card.style.visibility).toBe("");
  expect(complete).not.toHaveBeenCalled();
});
