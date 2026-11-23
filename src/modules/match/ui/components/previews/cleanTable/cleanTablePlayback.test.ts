import gsap from "gsap";

import { cleanTablePreview } from "../../../../application/cleanTablePreview";
import { cleanTablePlayback } from "./cleanTablePlayback";

function setup(reduced = false, example: "capture" | "last-round" = "capture") {
  const { award } = cleanTablePreview({ mode: "1vs1", example, player: 0 });
  const root = document.createElement("div");
  root.innerHTML =
    '<span data-clean-sweep style="opacity:0"></span><div data-clean-award style="opacity:0"><span data-clean-glint style="opacity:0"></span></div>';
  const complete = vi.fn();
  let timeline: gsap.core.Timeline | undefined;
  const context = gsap.context(() => {
    timeline = cleanTablePlayback(root, award, reduced, complete);
  });
  return { root, complete, timeline, context };
}
afterEach(() => gsap.globalTimeline.clear());

it("sweeps the emptied table, reveals the award, then hands off after one second", () => {
  const view = setup();
  expect(view.timeline!.duration()).toBe(1);
  const opacity = (selector: string) =>
    Number(gsap.getProperty(view.root.querySelector(selector)!, "opacity"));
  view.timeline!.time(0.12);
  expect(opacity("[data-clean-sweep]")).toBeGreaterThan(0);
  expect(opacity("[data-clean-award]")).toBe(0);
  view.timeline!.time(0.35);
  expect(opacity("[data-clean-sweep]")).toBeGreaterThan(0);
  expect(view.complete).not.toHaveBeenCalled();
  view.timeline!.time(0.65);
  expect(opacity("[data-clean-sweep]")).toBe(0);
  expect(opacity("[data-clean-award]")).toBe(1);
  expect(view.complete).not.toHaveBeenCalled();
  view.timeline!.progress(1);
  expect(opacity("[data-clean-award]")).toBe(0);
  expect(view.complete).toHaveBeenCalledOnce();
  view.context.revert();
});

it.each([
  [true, "capture"],
  [false, "last-round"],
] as const)("settles without celebration when reduced or excluded (%s, %s)", (reduced, example) => {
  const view = setup(reduced, example);
  expect(view.timeline).toBeUndefined();
  expect(view.complete).toHaveBeenCalledOnce();
  expect(view.root.querySelector<HTMLElement>("[data-clean-award]")!.style.opacity).toBe("0");
  view.context.revert();
});

it("cancels handoff and restores decorations when interrupted", () => {
  const view = setup();
  view.timeline!.time(0.4);
  view.context.revert();
  expect(view.timeline!.parent).toBeNull();
  expect(view.complete).not.toHaveBeenCalled();
  expect(view.root.querySelector<HTMLElement>("[data-clean-award]")!.style.transform).toBe("");
});
