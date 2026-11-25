import gsap from "gsap";
import { StrictMode } from "react";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { TableBonusPreview } from "./TableBonusPreview";

const preferences = vi.hoisted(() => ({ reduced: false }));
vi.mock(import("@/infrastructure/ui/hooks/useGamePreferences"), async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => preferences.reduced,
}));
let timelines: gsap.core.Timeline[];
beforeEach(() => {
  preferences.reduced = false;
  timelines = [];
  const original = gsap.timeline.bind(gsap);
  vi.spyOn(gsap, "timeline").mockImplementation((options) => {
    const timeline = original(options);
    timelines.push(timeline);
    return timeline;
  });
});
afterEach(() => {
  cleanup();
  gsap.globalTimeline.clear();
  vi.restoreAllMocks();
});

it("hands off to the existing points flight exactly once after the source celebration", () => {
  render(
    <StrictMode>
      <TableBonusPreview />
    </StrictMode>,
  );
  expect(document.querySelector("[data-score-award]")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  const deal = timelines.at(-1)!;
  act(() => {
    deal.time(deal.duration() - 0.5);
  });
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("0");
  act(() => {
    deal.progress(1);
  });
  expect(document.querySelectorAll("[data-score-award]")).toHaveLength(1);
  expect(document.querySelector("[data-score-award]")).toHaveTextContent("+10");
  expect(
    [...document.querySelectorAll("[data-bonus-frame]")].some(
      (node) => Number(gsap.getProperty(node, "opacity")) > 0,
    ),
  ).toBe(true);
  act(() => {
    timelines.at(-1)!.progress(1);
  });
  expect(
    [
      ...document.querySelectorAll(
        "[data-bonus-frame], [data-bonus-card-shine], [data-bonus-sheen]",
      ),
    ].every((node) => Number(gsap.getProperty(node, "opacity")) === 0),
  ).toBe(true);
  expect(
    [...document.querySelectorAll<HTMLElement>("[data-bonus-card]")].every(
      (node) => Number(gsap.getProperty(node, "opacity")) === 1,
    ),
  ).toBe(true);
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("10");
  expect(screen.getByRole("status")).toHaveTextContent("Side 1 +10 points");
});

it("interrupts and resets a running sequence without a late award", () => {
  const view = render(<TableBonusPreview />);
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  const old = timelines.at(-1)!;
  act(() => {
    old.time(1);
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset scene" }));
  expect(old.parent).toBeNull();
  expect(screen.getByRole("status")).toHaveTextContent("Ready to deal");
  expect(document.querySelector("[data-score-award]")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  const current = timelines.at(-1)!;
  view.unmount();
  expect(current.parent).toBeNull();
});

it("shows source and recipient feedback immediately with reduced motion", () => {
  preferences.reduced = true;
  render(
    <StrictMode>
      <TableBonusPreview />
    </StrictMode>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Play / replay" }));
  expect(screen.getByRole("status")).toHaveTextContent("Side 1 +10 points");
  expect(screen.getByRole("list", { name: "Scores" })).toHaveTextContent("10");
  expect(
    [...document.querySelectorAll("[data-bonus-frame]")].map((node) =>
      Number(gsap.getProperty(node, "opacity")),
    ),
  ).toEqual([0, 0, 0, 0]);
  expect(document.querySelector("[data-score-award]")).toBeNull();
  expect(timelines).toHaveLength(0);
});
