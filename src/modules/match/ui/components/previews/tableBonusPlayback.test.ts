import gsap from "gsap";

import { tableBonusPreview } from "../../../application/tableBonusPreview";
import { createTableBonusEffects } from "../flow/tableBonus/tableBonusEffects";
import { tableBonusPlayback } from "./tableBonusPlayback";

function setup(example: "perfect" | "partial" | "broken" | "none", reduced = false) {
  const { resolved } = tableBonusPreview("1vs1", "inc", "tableThenPlayers", example, 0);
  const root = document.createElement("div");
  root.innerHTML = '<span data-dealer-deck></span><div data-perfect-award style="opacity:0"></div>';
  for (const card of resolved.table)
    root.innerHTML += `<div data-bonus-card="${card.suit}-${card.rank}" style="opacity:0"><span data-bonus-frame style="opacity:0"></span><span data-bonus-card-shine style="opacity:0"></span><span data-bonus-sheen style="opacity:0"></span></div>`;
  for (const player of resolved.players)
    for (let round = 0; round < 3; round++)
      root.innerHTML += `<div data-deal-hand="${player.id}:${round}" style="opacity:0"></div>`;
  const effects = createTableBonusEffects();
  const complete = vi.fn();
  const announce = vi.fn();
  let timeline: gsap.core.Timeline | undefined;
  const context = gsap.context(() => {
    timeline = tableBonusPlayback(
      root,
      resolved,
      resolved.scoreAwards?.[0],
      reduced,
      complete,
      announce,
      effects,
    );
  });
  return { root, complete, announce, timeline, context, effects };
}
afterEach(() => {
  gsap.globalTimeline.clear();
});

it("lands table cards slowly, builds consecutive intensity and celebrates before handoff", () => {
  const view = setup("perfect");
  const timeline = view.timeline!;
  const frames = view.root.querySelectorAll<HTMLElement>("[data-bonus-frame]");
  timeline.time(timeline.labels["match-0"] + 0.28);
  expect(
    Number(gsap.getProperty(view.root.querySelector("[data-bonus-card-shine]")!, "opacity")),
  ).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(frames[0], "opacity"))).toBe(0);
  timeline.seek("match-settled-0");
  const first = Number(gsap.getProperty(frames[0], "opacity"));
  expect(first).toBe(0);
  expect(Number(gsap.getProperty(frames[1], "opacity"))).toBe(0);
  timeline.seek("match-settled-1");
  expect(Number(gsap.getProperty(frames[0], "opacity"))).toBe(first);
  expect(Number(gsap.getProperty(frames[1], "opacity"))).toBeGreaterThan(first);
  timeline.seek("match-settled-3");
  const intensities = [...frames].map((node) => Number(gsap.getProperty(node, "opacity")));
  expect(intensities).toEqual([0, 0.9, 0.95, 1]);
  expect(
    [...view.root.querySelectorAll("[data-bonus-frame]")].map((node) =>
      Number(gsap.getProperty(node, "opacity")),
    ),
  ).toEqual([0, 0.9, 0.95, 1]);
  timeline.time(timeline.duration() - 0.5);
  expect(
    Number(gsap.getProperty(view.root.querySelector("[data-perfect-award]")!, "opacity")),
  ).toBe(1);
  expect(view.complete).not.toHaveBeenCalled();
  timeline.progress(1);
  expect(view.complete).toHaveBeenCalledOnce();
  expect(view.announce).toHaveBeenLastCalledWith(expect.stringContaining("+10 points"));
  view.context.revert();
});

it.each(["partial", "broken", "none"] as const)(
  "highlights only actual winners without a perfect celebration (%s)",
  (example) => {
    const view = setup(example);
    view.timeline!.progress(1);
    const frames = view.root.querySelectorAll<HTMLElement>("[data-bonus-frame]");
    if (example === "none")
      expect([...frames].every((node) => Number(gsap.getProperty(node, "opacity")) === 0)).toBe(
        true,
      );
    else expect(Number(gsap.getProperty(frames[example === "partial" ? 3 : 1], "opacity"))).toBe(0);
    expect(
      Number(gsap.getProperty(view.root.querySelector("[data-perfect-award]")!, "opacity")),
    ).toBe(0);
    expect(view.complete).toHaveBeenCalledOnce();
    view.context.revert();
  },
);

it("keeps the first shine bright and builds stronger lifts on later matches", () => {
  const view = setup("perfect");
  const cards = view.root.querySelectorAll<HTMLElement>("[data-bonus-card]");
  const peaks = [...cards].map((card, index) => {
    view.timeline!.time(view.timeline!.labels[`match-${index}`] + 0.22);
    return {
      lift: -Number(gsap.getProperty(card, "y")),
      sheen: Number(
        gsap.getProperty(
          card.querySelector(index === 0 ? "[data-bonus-card-shine]" : "[data-bonus-sheen]")!,
          "opacity",
        ),
      ),
    };
  });
  expect(peaks[0].lift).toBeCloseTo(0);
  expect(peaks[0].sheen).toBe(1);
  for (let index = 1; index < peaks.length; index++) {
    expect(peaks[index].lift).toBeGreaterThan(peaks[index - 1].lift);
    expect(peaks[index].sheen).toBeGreaterThan(0.5);
  }
  view.context.revert();
  for (const card of cards) {
    expect(card.style.transform).toBe("");
    expect(card.querySelector<HTMLElement>("[data-bonus-sheen]")!.style.transform).toBe("");
  }
});

it("shows reduced-motion sources immediately without a timeline", () => {
  const view = setup("broken", true);
  expect(view.timeline).toBeUndefined();
  expect(view.complete).toHaveBeenCalledOnce();
  const frames = view.root.querySelectorAll<HTMLElement>("[data-bonus-frame]");
  expect([...frames].map((node) => Number(gsap.getProperty(node, "opacity")))).toEqual([
    0, 0, 0, 0.9,
  ]);
  view.context.revert();
});

it("cancels pending handoff and restores styles on interruption", () => {
  const view = setup("perfect");
  view.timeline!.time(2);
  view.context.revert();
  expect(view.timeline!.parent).toBeNull();
  expect(view.complete).not.toHaveBeenCalled();
  expect(view.root.querySelector<HTMLElement>("[data-bonus-card]")!.style.transform).toBe("");
});

it("keeps only heat on the third success and only flames on the fourth after handoff", () => {
  const view = setup("perfect");
  const timeline = view.timeline!;
  expect(view.effects.map((effect) => effect.stage)).toEqual([1, 2, 3, 4]);
  timeline.time(timeline.labels["match-2"] + 0.5);
  expect(view.effects[2].heat.current.strength.value).toBe(1);
  expect(view.effects[2].flame.current.value).toBe(0);
  expect(view.effects[3].flame.current.value).toBe(0);
  timeline.time(timeline.labels["match-3"] + 0.4);
  expect(view.effects[3].flame.current.value).toBe(1);
  expect(view.effects[3].heat.current.strength.value).toBe(0);
  expect(view.complete).not.toHaveBeenCalled();
  timeline.progress(1);
  expect(view.complete).toHaveBeenCalledOnce();
  expect(view.effects.map((effect) => effect.heat.current.strength.value)).toEqual([0, 0, 1, 0]);
  expect(view.effects.map((effect) => effect.flame.current.value)).toEqual([0, 0, 0, 1]);
  view.context.revert();
  expect(view.effects[2].heat.current.strength.value).toBe(0);
  expect(view.effects[3].flame.current.value).toBe(0);
  expect(view.effects[3].ignition.current.value).toBe(0);
});

it.each([false, true])("never ignites flames across a broken streak (reduced: %s)", (reduced) => {
  const view = setup("broken", reduced);
  view.timeline?.progress(1);
  expect(
    view.effects.every(
      (effect) =>
        effect.stage < 3 &&
        effect.flame.current.value === 0 &&
        effect.heat.current.strength.value === 0,
    ),
  ).toBe(true);
  view.context.revert();
});
