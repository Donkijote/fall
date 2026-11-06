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
  it("exposes each of the 19 commands exactly once in the catalog", () => {
    const commands = Object.values(lessonsByStudy)
      .flat()
      .map((lesson) => lesson.experiment);
    expect(commands).toHaveLength(19);
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
    lab.run("capture-match");
    expect(lab.getState()).toMatchObject({ tablePlays: 0, tableCaptures: 0 });
    lab.run("deal");
    lab.setCaptureIntensity("flame");
    lab.run("capture-match");
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
