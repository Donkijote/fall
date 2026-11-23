import { useEffect } from "react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import type { Experiment, Lab } from "../application/lab";
import { AnimationPlayground } from "./AnimationPlayground";

const viewport = vi.hoisted(() => ({ mount: vi.fn(), unmount: vi.fn() }));
const audio = vi.hoisted(() => ({
  playDealCard: vi.fn(),
  playCard: vi.fn(),
  dispose: vi.fn(),
  stop: vi.fn(),
  prepare: vi.fn(),
  playCapture: vi.fn(),
}));
vi.mock("../adapters/audio/howlerAudio", () => ({ createHowlerAudio: () => audio }));
vi.mock("../adapters/three/LabViewport", () => ({
  LabViewport: ({
    lab,
    experiment,
    footerActions,
  }: {
    lab: Lab;
    experiment?: Experiment;
    footerActions: ReactNode;
  }) => {
    useEffect(() => {
      viewport.mount();
      return () => viewport.unmount();
    }, []);
    useEffect(() => {
      if (experiment) lab.run(experiment);
    }, [lab, experiment]);
    return (
      <section>
        <output aria-label="Scene state">{JSON.stringify(lab.getState())}</output>
        <footer>{footerActions}</footer>
      </section>
    );
  },
}));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

function scene() {
  return JSON.parse(screen.getByLabelText("Scene state").textContent!);
}
function open() {
  render(
    <MemoryRouter>
      <AnimationPlayground />
    </MemoryRouter>,
  );
}

describe("Animation playground", () => {
  it("isolates the shared points animation and resets or leaves an active flight", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: "Points" }));
    expect(screen.getByRole("heading", { name: "Earned points" })).toBeVisible();
    expect(screen.queryByLabelText("Scene state")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: "Timeline speed" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear table" }));
    expect(document.querySelector("[data-score-award]")).toHaveTextContent("+4");
    fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
    expect(document.querySelector("[data-score-award]")).toBeNull();
    expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("0");
    fireEvent.click(screen.getByRole("button", { name: "1vs2" }));
    expect(document.querySelectorAll("[data-score-side]")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "2vs2" }));
    expect(document.querySelectorAll("[data-score-side]")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "All recipients" }));
    expect(document.querySelector("[data-score-award]")).not.toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: /^Card/ }));
    expect(document.querySelector("[data-score-award]")).toBeNull();
    expect(screen.getByRole("button", { name: "Play / replay" })).toBeVisible();
  });

  it("opens the bonus from Table and restores the other table studies on leave", () => {
    open();
    expect(screen.queryByRole("tab", { name: "Table bonus" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Table bonus" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    fireEvent.click(screen.getByRole("button", { name: "Table bonus" }));
    expect(screen.getByRole("heading", { name: "Table build bonus" })).toBeVisible();
    expect(screen.queryByRole("spinbutton", { name: "Timeline speed" })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Playback speed" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    fireEvent.click(screen.getByRole("button", { name: "Deal cards" }));
    expect(screen.queryByRole("heading", { name: "Table build bonus" })).not.toBeInTheDocument();
    expect(document.querySelector("[data-bonus-card]")).toBeNull();
    expect(screen.getByLabelText("Scene state")).toBeVisible();
    expect(screen.getByRole("spinbutton", { name: "Timeline speed" })).toBeVisible();
  });

  it("replays from fresh state rather than toggling the previous result", () => {
    open();
    expect(scene().faceUp).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().faceUp).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().faceUp).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
    expect(scene().faceUp).toBe(true);
  });

  it("keeps the viewport mounted across replay, tuning, reset, and study changes", () => {
    open();
    const canvasHost = screen.getByLabelText("Scene state");
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Timeline speed" }), {
      target: { value: "0.5" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
    const tableTab = screen.getByRole("tab", { name: /^Table\s*\d/ });
    fireEvent.click(tableTab);
    expect(tableTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(canvasHost);
    fireEvent.click(screen.getByRole("tab", { name: /^Card/ }));
    expect(screen.getByLabelText("Scene state")).toBe(canvasHost);
    expect(viewport.mount).toHaveBeenCalledTimes(1);
    expect(viewport.unmount).not.toHaveBeenCalled();
  });

  it("restarts drops directly without an intermediate empty scene", () => {
    open();
    fireEvent.click(screen.getByRole("button", { name: "Shatter frozen card" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ cardFalls: 1, cardDropEffect: "ice" });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ cardFalls: 1, cardDropEffect: "ice" });
    expect(viewport.mount).toHaveBeenCalledTimes(1);
  });

  it("prepares the same dealt hand for standalone capture replays", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fall capture" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ tableDeals: 1, tableCaptures: 1, tablePlays: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCaptures).toBe(1);
  });

  it("prepares an existing table card for ordinary capture and keeps replay mounted", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    expect(screen.getByRole("button", { name: "Fall capture" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Capture card" }));
    expect(screen.queryByRole("combobox", { name: "Capture impact" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({
      tableDeals: 1,
      centerDeals: 1,
      tableCaptures: 1,
      activeCaptureMode: "card",
      activeCaptureIntensity: "plain",
    });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCaptures).toBe(1);
    expect(viewport.mount).toHaveBeenCalledTimes(1);
  });

  it("prepares the cascade board and replays without remounting the viewport", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    fireEvent.click(screen.getByRole("button", { name: "Cascade capture" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({
      tableDeals: 1,
      centerDeals: 1,
      tableCaptures: 1,
      activeCaptureMode: "cascade",
      activeCaptureIntensity: "plain",
    });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCaptures).toBe(1);
    expect(viewport.mount).toHaveBeenCalledTimes(1);
  });

  it("starts counting with an exhausted deck and replays or tunes without remounting", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    fireEvent.click(screen.getByRole("button", { name: "Count cards" }));
    expect(screen.getByRole("spinbutton", { name: "Captured cards" })).toHaveValue(26);
    expect(screen.getByRole("combobox", { name: "Counting quota" })).toHaveTextContent("20");
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ tableCounts: 1, tableDeals: 0, centerDeals: 0 });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Captured cards" }), {
      target: { value: "18" },
    });
    expect(scene().tableCounts).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCounts).toBe(1);
    expect(viewport.mount).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
    expect(scene().tableCounts).toBe(0);
  });

  it("restarts the active preview when tuning changes and rejects out-of-range values", () => {
    open();
    fireEvent.click(screen.getByRole("button", { name: "Shake card" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Timeline speed" }), {
      target: { value: "0.5" },
    });
    expect(screen.getByRole("spinbutton", { name: "Timeline speed" })).toHaveValue(0.5);
    expect(scene().impact).toBe(1);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Timeline speed" }), {
      target: { value: "0" },
    });
    expect(screen.getByRole("spinbutton", { name: "Timeline speed" })).toHaveValue(0.5);
  });
  it("prepares audio in Play and cancels old audio on replay, reset, study changes and unmount", () => {
    const view = render(
      <MemoryRouter>
        <AnimationPlayground />
      </MemoryRouter>,
    );
    expect(audio.prepare).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(audio.prepare).toHaveBeenCalledOnce();
    expect(audio.stop).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(audio.stop).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
    expect(audio.stop).toHaveBeenCalledTimes(3);
    fireEvent.click(screen.getByRole("tab", { name: /^Table\s*\d/ }));
    expect(audio.stop).toHaveBeenCalledTimes(4);
    view.unmount();
    expect(audio.dispose).toHaveBeenCalledOnce();
  });
});
