import gsap from "gsap";
import { StrictMode } from "react";

import { act, cleanup, render } from "@testing-library/react";

import type { OpeningTablePlayback } from "../../../adapters/three/matchCardScene";
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
      openingFeedbackBusy: busy,
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
      openingFeedbackBusy: busy,
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
