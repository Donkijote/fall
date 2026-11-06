import { useEffect } from "react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import type { Experiment, Lab } from "../application/lab";
import { AnimationPlayground } from "./AnimationPlayground";

const viewport = vi.hoisted(() => ({ mount: vi.fn(), unmount: vi.fn() }));
const audio = vi.hoisted(() => ({
  play: vi.fn(),
  playDealCard: vi.fn(),
  playCard: vi.fn(),
  dispose: vi.fn(),
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
    const tableTab = screen.getByRole("tab", { name: /Table/ });
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
    fireEvent.click(screen.getByRole("tab", { name: /Table/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fall capture" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ tableDeals: 1, tableCaptures: 1, tablePlays: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCaptures).toBe(1);
  });

  it("prepares an existing table card for ordinary capture and keeps replay mounted", () => {
    open();
    fireEvent.click(screen.getByRole("tab", { name: /Table/ }));
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
    fireEvent.click(screen.getByRole("tab", { name: /Table/ }));
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
    fireEvent.click(screen.getByRole("tab", { name: /Table/ }));
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
});
