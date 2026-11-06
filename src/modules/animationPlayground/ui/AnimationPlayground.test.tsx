import { useEffect } from "react";
import { MemoryRouter } from "react-router";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import type { Experiment, Lab } from "../application/lab";
import { AnimationPlayground } from "./AnimationPlayground";

const audio = vi.hoisted(() => ({ play: vi.fn(), playDealCard: vi.fn(), dispose: vi.fn() }));
vi.mock("../adapters/audio/howlerAudio", () => ({ createHowlerAudio: () => audio }));
vi.mock("@/infrastructure/ui/components/theme/ThemeToggle", () => ({ ThemeToggle: () => null }));
vi.mock("../adapters/three/LabViewport", () => ({
  LabViewport: ({ lab, experiment }: { lab: Lab; experiment?: Experiment }) => {
    useEffect(() => {
      if (experiment) lab.run(experiment);
    }, [lab, experiment]);
    return <output aria-label="Scene state">{JSON.stringify(lab.getState())}</output>;
  },
}));

afterEach(cleanup);

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

  it("prepares the same dealt hand for standalone capture replays", () => {
    open();
    fireEvent.click(screen.getByRole("button", { name: /Table/ }));
    fireEvent.click(screen.getByRole("button", { name: "Capture match" }));
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene()).toMatchObject({ tableDeals: 1, tableCaptures: 1, tablePlays: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
    expect(scene().tableCaptures).toBe(1);
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
