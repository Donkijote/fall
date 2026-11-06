import { createZustandLabState } from "../adapters/state/zustandLabState";
import { cardImpactProfiles, sampleCardImpact } from "../adapters/three/cardImpactMotion";
import { lessonsByStudy } from "./catalog";
import { createLab } from "./lab";
import type { CardDropEffect } from "./lab";

function setup() {
  const audio = { play: vi.fn(), playDealCard: vi.fn() };
  return { lab: createLab(createZustandLabState(), audio), audio };
}

describe("ported animation engine", () => {
  it("exposes each of the 22 commands exactly once in the catalog", () => {
    const commands = Object.values(lessonsByStudy)
      .flat()
      .map((lesson) => lesson.experiment);
    expect(commands).toHaveLength(22);
    expect(new Set(commands).size).toBe(commands.length);
    for (const experiment of commands) {
      const first = setup();
      const second = setup();
      first.lab.run(experiment);
      second.lab.run(experiment);
      expect(first.lab.getState()).toEqual(second.lab.getState());
    }
  });

  it("guards dependent table actions and snapshots capture intensity", () => {
    const { lab } = setup();
    lab.run("play-card");
    lab.run("fall-capture");
    expect(lab.getState()).toMatchObject({ tablePlays: 0, tableCaptures: 0 });
    lab.run("deal");
    lab.setCaptureIntensity("flame");
    lab.run("fall-capture");
    lab.setCaptureIntensity("ice");
    expect(lab.getState()).toMatchObject({
      tableCaptures: 1,
      activeCaptureIntensity: "flame",
      captureIntensity: "ice",
    });
    lab.run("play-card");
    expect(lab.getState().tablePlays).toBe(0);
    lab.run("reset-table");
    expect(lab.getState()).toMatchObject({ tableDeals: 0, tablePlays: 0, tableCaptures: 0 });
  });

  it("requires a table card for ordinary capture and never adds an elemental impact", () => {
    const { lab } = setup();
    lab.run("capture-card");
    lab.run("deal");
    lab.run("capture-card");
    expect(lab.getState().tableCaptures).toBe(0);
    lab.run("deal-center");
    lab.setCaptureIntensity("flame");
    lab.run("capture-card");
    expect(lab.getState()).toMatchObject({
      tableCaptures: 1,
      activeCaptureMode: "card",
      activeCaptureIntensity: "plain",
    });
    lab.run("reset-table");
    expect(lab.getState()).toMatchObject({ tableCaptures: 0, centerDeals: 0, tableDeals: 0 });
  });

  it("requires a dealt board for cascade capture and snapshots its distinct mode", () => {
    const { lab } = setup();
    lab.run("cascade-capture");
    lab.run("deal");
    lab.run("cascade-capture");
    expect(lab.getState().tableCaptures).toBe(0);
    lab.run("deal-center");
    lab.setCaptureIntensity("flame");
    lab.run("cascade-capture");
    expect(lab.getState()).toMatchObject({
      tableCaptures: 1,
      activeCaptureMode: "cascade",
      activeCaptureIntensity: "plain",
    });
  });

  it("counts independently of dealt hands and clears counting when the table resets", () => {
    const { lab } = setup();
    lab.run("deal");
    lab.run("deal-center");
    lab.run("cascade-capture");
    lab.run("count-cards");
    expect(lab.getState()).toMatchObject({
      tableCounts: 1,
      tableDeals: 0,
      centerDeals: 0,
      tableCaptures: 0,
      tablePlays: 0,
    });
    lab.run("count-cards");
    expect(lab.getState().tableCounts).toBe(2);
    lab.run("reset-table");
    expect(lab.getState().tableCounts).toBe(0);
  });

  it("keeps each drop profile finite, repeatable, and cooled at the end", () => {
    for (const effect of Object.keys(cardImpactProfiles) as CardDropEffect[]) {
      for (const seconds of [-1, 0, 0.1, 0.5, 1, 5]) {
        const sample = sampleCardImpact(effect, seconds);
        expect(sample).toEqual(sampleCardImpact(effect, seconds));
        expect(Object.values(sample).every(Number.isFinite)).toBe(true);
      }
      expect(sampleCardImpact(effect, 5)).toMatchObject({
        fall: 1,
        frost: 0,
        topHeat: 0,
        bottomHeat: 0,
        fireLife: 0,
      });
    }
  });
});
