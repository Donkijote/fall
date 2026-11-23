import gsap from "gsap";
import { StrictMode } from "react";

import { act, cleanup, fireEvent, render } from "@testing-library/react";

import type { OpeningTablePlayback } from "../../../adapters/three/matchCardScene";
import { cleanTablePreview } from "../../../application/cleanTablePreview";
import { openDeal, type MatchFrame } from "../../../application/localMatch";
import { tableBonusPreview } from "../../../application/tableBonusPreview";
import { PlayableBoard } from "./PlayableBoard";

const motion = vi.hoisted(() => ({ opening: undefined as OpeningTablePlayback | undefined }));
vi.mock("../flow/MatchMotionLayer", () => ({
  MatchMotionLayer: ({ openingTable }: { openingTable?: OpeningTablePlayback }) => {
    motion.opening = openingTable;
    return null;
  },
}));
let timelines: gsap.core.Timeline[];
beforeEach(() => {
  timelines = [];
  const create = gsap.timeline.bind(gsap);
  vi.spyOn(gsap, "timeline").mockImplementation((options) => {
    const timeline = create(options);
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => {
  cleanup();
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it.each(["1vs1", "1vs2", "2vs2"] as const)(
  "retains opening feedback until points arrive and clears it before later plays (%s)",
  (mode) => {
    const { before } = tableBonusPreview(mode, "dec", "tableThenPlayers", "perfect", 0);
    const frames = openDeal(before, "tableThenPlayers", "dec");
    const busy = vi.fn();
    const props = {
      mode,
      title: "Table",
      player: { name: "Traveller" },
      act: vi.fn(),
      completeMotion: vi.fn(),
      reducedMotion: false,
      returning: false,
      paused: false,
      close: vi.fn(),
      leaveControl: null,
      bonusFeedbackBusy: busy,
    };
    const tree = (frame: MatchFrame) => (
      <StrictMode>
        <PlayableBoard {...props} frame={frame} />
      </StrictMode>
    );
    const view = render(tree({ state: before }));
    view.rerender(tree(frames[0]));
    expect(busy).toHaveBeenLastCalledWith(true);
    expect(document.querySelector("[data-score-award]")).toBeNull();
    expect(
      [...document.querySelectorAll<HTMLElement>("[data-table-card]")].map(
        (card) => card.dataset.tableSlot,
      ),
    ).toEqual(["1", "2", "5", "6"]);
    const deal = gsap.timeline({ paused: true });
    const context = gsap.context(() => {
      const opening = frames[0].motion;
      if (opening?.kind !== "deal") throw new Error("Expected deal");
      for (const key of opening.openingTable!.cards) motion.opening!.land(deal, key);
      motion.opening!.celebrate(deal);
    });
    act(() => {
      deal.progress(1);
    });
    // Mimic the rendered deal's completed-context disposal without rewinding its styles.
    context.kill(false);
    view.rerender(tree(frames[1]));
    expect(document.querySelectorAll("[data-score-award]")).toHaveLength(1);
    expect(
      [...document.querySelectorAll("[data-bonus-glow]")].map((node) =>
        Number(gsap.getProperty(node, "opacity")),
      ),
    ).toEqual([0.42, 0.59, 0.76, 0.93]);
    expect(busy).toHaveBeenLastCalledWith(true);
    act(() => {
      timelines.at(-1)!.progress(1);
    });
    expect(busy).toHaveBeenLastCalledWith(false);
    // A Sing resolved by the same opening keeps its own ordered points flight.
    while (document.querySelector("[data-score-award]")) {
      act(() => {
        timelines.at(-1)!.progress(1);
      });
    }
    expect(
      [...document.querySelectorAll("[data-bonus-glow]")].every(
        (node) => Number(gsap.getProperty(node, "opacity")) === 0,
      ),
    ).toBe(true);
    for (const [side, amount] of Object.entries(frames[1].state.scores.values)) {
      expect(document.querySelector(`[data-score-side="${side}"]`)).toHaveTextContent(
        String(amount),
      );
    }
    view.rerender(
      tree({ state: frames[1].state, motion: { kind: "play", player: "local", card: "coins-7" } }),
    );
    expect(
      [...document.querySelectorAll("[data-bonus-glow]")].every(
        (node) => Number(gsap.getProperty(node, "opacity")) === 0,
      ),
    ).toBe(true);
  },
);

it.each(["winning", "none", "broken"] as const)(
  "settles reduced-motion source feedback and scores without a lingering lock (%s)",
  (example) => {
    const { before } = tableBonusPreview("1vs1", "inc", "playersThenTable", example, 0);
    const frames = openDeal(before, "playersThenTable", "inc");
    const busy = vi.fn();
    const props = {
      mode: "1vs1" as const,
      title: "Table",
      player: { name: "Traveller" },
      act: vi.fn(),
      completeMotion: vi.fn(),
      reducedMotion: true,
      returning: false,
      paused: false,
      close: vi.fn(),
      leaveControl: null,
      bonusFeedbackBusy: busy,
    };
    const view = render(<PlayableBoard {...props} frame={{ state: before }} />);
    view.rerender(<PlayableBoard {...props} frame={frames[0]} />);
    expect(document.querySelector("[data-score-award]")).toBeNull();
    view.rerender(<PlayableBoard {...props} frame={frames[1]} />);
    expect(busy).toHaveBeenLastCalledWith(false);
    expect(document.querySelector("[data-perfect-award]")).toBeNull();
    expect(
      [...document.querySelectorAll("[data-bonus-glow]")].every(
        (node) => Number(gsap.getProperty(node, "opacity")) === 0,
      ),
    ).toBe(true);
  },
);

it.each(["1vs1", "1vs2", "2vs2"] as const)(
  "celebrates real clean-table and compound Fall awards once after capture (%s)",
  (mode) => {
    vi.useFakeTimers();
    const fixture = cleanTablePreview({ mode, example: "fall", player: 1 });
    const busy = vi.fn();
    const submit = vi.fn();
    const props = {
      mode,
      title: "Table",
      player: { name: "Traveller" },
      act: submit,
      completeMotion: vi.fn(),
      reducedMotion: false,
      returning: false,
      paused: false,
      close: vi.fn(),
      leaveControl: null,
      bonusFeedbackBusy: busy,
    };
    const tree = (frame: MatchFrame) => (
      <StrictMode>
        <PlayableBoard {...props} frame={frame} />
      </StrictMode>
    );
    const view = render(tree({ state: fixture.before }));
    view.rerender(tree(fixture.capture));
    expect(document.querySelector("[data-clean-award]")).toBeNull();
    expect(document.querySelector("[data-score-award]")).toBeNull();
    view.rerender(tree({ state: fixture.resolved }));
    expect(document.querySelector("[data-clean-award]")).toHaveTextContent("+4");
    expect(document.querySelectorAll("[data-table-card]")).toHaveLength(0);
    expect(document.querySelector("[data-score-award]")).toBeNull();
    expect(busy).toHaveBeenLastCalledWith(true);
    const hand = document.querySelector<HTMLButtonElement>('[data-match-hand="local"] button')!;
    expect(hand).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(hand);
    expect(submit).not.toHaveBeenCalled();
    const celebration = timelines.at(-1)!;
    act(() => {
      celebration.time(0.65);
    });
    expect(document.querySelector("[data-score-award]")).toBeNull();
    act(() => {
      celebration.progress(1);
    });
    expect(document.querySelector("[data-clean-award]")).toBeNull();
    expect(document.querySelector("[data-score-award]")).toHaveTextContent("+4");
    view.rerender(tree({ state: { ...fixture.resolved } }));
    expect(document.querySelector("[data-clean-award]")).toBeNull();
    act(() => {
      timelines.at(-1)!.progress(1);
    });
    expect(document.querySelector("[data-score-award]")).toHaveTextContent("+1");
    expect(busy).toHaveBeenLastCalledWith(true);
    act(() => {
      timelines.at(-1)!.progress(1);
    });
    expect(document.querySelector("[data-score-award]")).toBeNull();
    expect(busy).toHaveBeenLastCalledWith(true);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(busy).toHaveBeenLastCalledWith(false);
    expect(document.querySelector("[data-clean-sweep]")).toBeNull();
  },
);

it.each(["last-round", "no-clear", "winning"] as const)(
  "keeps excluded and winning live feedback authoritative (%s)",
  (example) => {
    vi.useFakeTimers();
    const fixture = cleanTablePreview({ mode: "1vs1", example, player: 0 });
    const props = {
      mode: "1vs1" as const,
      title: "Table",
      player: { name: "Traveller" },
      act: vi.fn(),
      completeMotion: vi.fn(),
      reducedMotion: false,
      returning: false,
      paused: false,
      close: vi.fn(),
      leaveControl: null,
    };
    const view = render(<PlayableBoard {...props} frame={{ state: fixture.before }} />);
    view.rerender(<PlayableBoard {...props} frame={fixture.capture} />);
    view.rerender(<PlayableBoard {...props} frame={{ state: fixture.resolved }} />);
    expect(document.querySelector("[data-match-result]")).toBeNull();
    if (example !== "winning") {
      expect(document.querySelector("[data-clean-award]")).toBeNull();
      expect(document.querySelector("[data-score-award]")).toBeNull();
      return;
    }
    expect(document.querySelector("[data-clean-award]")).toHaveTextContent("+4");
    act(() => {
      timelines.at(-1)!.progress(1);
    });
    expect(document.querySelector("[data-match-result]")).toBeNull();
    act(() => {
      timelines.at(-1)!.progress(1);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector("[data-match-result]")).not.toBeNull();
  },
);

it("cancels clean-table feedback on a reconnect snapshot without replay or a late score", () => {
  const fixture = cleanTablePreview({ mode: "1vs1", example: "capture", player: 0 });
  const busy = vi.fn();
  const props = {
    mode: "1vs1" as const,
    title: "Table",
    player: { name: "Traveller" },
    act: vi.fn(),
    completeMotion: vi.fn(),
    reducedMotion: false,
    returning: false,
    paused: false,
    close: vi.fn(),
    leaveControl: null,
    bonusFeedbackBusy: busy,
  };
  const view = render(<PlayableBoard {...props} frame={{ state: fixture.before }} />);
  view.rerender(<PlayableBoard {...props} frame={{ state: fixture.resolved }} />);
  const celebration = timelines.at(-1)!;
  act(() => {
    celebration.time(0.4);
  });
  view.rerender(<PlayableBoard {...props} frame={{ state: fixture.resolved, snapshot: true }} />);
  expect(celebration.parent).toBeNull();
  expect(document.querySelector("[data-clean-award]")).toBeNull();
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(busy).toHaveBeenLastCalledWith(false);
  view.rerender(<PlayableBoard {...props} frame={{ state: fixture.resolved }} />);
  expect(document.querySelector("[data-clean-award]")).toBeNull();
  expect(document.querySelector("[data-score-award]")).toBeNull();
});
