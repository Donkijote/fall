import gsap from "gsap";

import { cardCaptureDuration } from "./cardCapture";
import { cardFlights } from "./cardFlights";
import { appendCapture, appendDeal, appendPlay } from "./cardTimelines";
import { getCascadeSteps } from "./cascadeCapture";
import { captureDuration, captureElementStart, fallRiseAt, impactAt } from "./tableCapture";

function setup(
  kind: "fall" | "card" | "cascade" | "sweep",
  effect: "plain" | "ice" | "heat" | "flame" = "plain",
  targets = 1,
  existing = false,
) {
  const audio = { playCard: vi.fn(), playDealCard: vi.fn(), playCapture: vi.fn() };
  const timeline = appendCapture(
    gsap.timeline({ paused: true }),
    { progress: 0, cooldown: 0, followThrough: 0 },
    kind,
    targets,
    audio,
    effect,
    existing,
  );
  return { audio, timeline };
}
afterEach(() => gsap.globalTimeline.clear());

it.each(["plain", "ice", "heat", "flame"] as const)(
  "keeps ordinary capture on play-card audio regardless of Fall effect %s",
  (effect) => {
    const { audio, timeline } = setup("card", effect);
    timeline.time(0.001, false);
    expect(audio.playCard).toHaveBeenCalledOnce();
    timeline.time(cardCaptureDuration * 0.42 + 0.001, false);
    timeline.progress(1, false);
    expect(audio.playCard).toHaveBeenCalledOnce();
    expect(audio.playCapture).not.toHaveBeenCalled();
  },
);

it("separates the target play, frost buildup and actual Fall impact", () => {
  const { audio, timeline } = setup("fall", "ice");
  timeline.time(captureDuration("ice") * 0.36 + 0.001, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["freeze"]]);
  timeline.time(captureDuration("ice") * impactAt + 0.001, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["freeze"], ["shatter"]]);
  timeline.progress(1, false);
  expect(audio.playCard).toHaveBeenCalledOnce();
  expect(audio.playCapture).toHaveBeenCalledTimes(3);
});

it("does not repeat the previous turn's target sound for an existing Fall target", () => {
  const { audio, timeline } = setup("fall", "ice", 1, true);
  timeline.time(0.419, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["freeze"]]);
  timeline.time(0.421, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["freeze"], ["shatter"]]);
  timeline.progress(1, false);
  expect(audio.playCard).not.toHaveBeenCalled();
});

it.each(["plain", "ice", "heat", "flame"] as const)(
  "uses only original card sounds for cascade pickups regardless of Fall effect %s",
  (effect) => {
    const { audio, timeline } = setup("cascade", effect, 4);
    for (const [index, step] of getCascadeSteps(4).entries()) {
      timeline.time(step.start + 0.001, false);
      expect(audio.playCard).toHaveBeenCalledTimes(index + 1);
      timeline.time(step.start + step.travel + 0.001, false);
      expect(audio.playCard).toHaveBeenCalledTimes(index + 1);
      expect(audio.playCapture).not.toHaveBeenCalled();
    }
    const sweep = setup("sweep");
    sweep.timeline.progress(1, false);
    expect(sweep.audio.playCapture).not.toHaveBeenCalled();
    expect(sweep.audio.playCard).not.toHaveBeenCalled();
  },
);

it("retains the current live-match audio path until the new port is adopted", () => {
  const audio = { playCard: vi.fn(), playDealCard: vi.fn() };
  const timeline = appendCapture(
    gsap.timeline({ paused: true }),
    { progress: 0, cooldown: 0 },
    "card",
    1,
    audio,
  );
  timeline.progress(1, false);
  expect(audio.playCard).toHaveBeenCalledOnce();
});

it("killing an interrupted timeline prevents later impact cues", () => {
  const { audio, timeline } = setup("fall", "ice");
  timeline.time(0.4, false);
  timeline.kill();
  gsap.updateRoot(10);
  expect(audio.playCapture).not.toHaveBeenCalled();
});

it("plays the Fall once before its extra cascade contacts", () => {
  const { audio, timeline } = setup("fall", "ice", 3, true);
  timeline.progress(1, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["freeze"], ["shatter"]]);
  expect(audio.playCard).toHaveBeenCalledTimes(2);
});

test("deals each card with the original stagger and its own sound cue", () => {
  const playDealCard = vi.fn();
  const audio = { playDealCard, playCard: vi.fn() };
  const first = { progress: 0 };
  const second = { progress: 0 };
  const timeline = appendDeal(gsap.timeline({ paused: true }), [first, second], false, audio);
  try {
    timeline.time(0.01, false);
    expect(playDealCard).toHaveBeenCalledTimes(1);
    expect(first.progress).toBeGreaterThan(0);
    expect(second.progress).toBe(0);

    timeline.time(cardFlights.deal.stagger + 0.01, false);
    expect(playDealCard).toHaveBeenCalledTimes(2);
    expect(second.progress).toBeGreaterThan(0);
  } finally {
    timeline.kill();
  }
});

test("a Fall plays two card cues in the capture sequence; a normal play plays one", () => {
  const playCard = vi.fn();
  const audio = { playDealCard: vi.fn(), playCard };
  const play = appendPlay(gsap.timeline({ paused: true }), { progress: 0 }, audio);
  const fall = appendCapture(
    gsap.timeline({ paused: true }),
    { progress: 0, cooldown: 0 },
    "fall",
    1,
    audio,
  );
  try {
    play.progress(1, false);
    expect(playCard).toHaveBeenCalledTimes(1);

    fall.time(0.01, false);
    expect(playCard).toHaveBeenCalledTimes(2);

    fall.time(captureDuration("plain") * 0.27 + 0.01, false);
    expect(playCard).toHaveBeenCalledTimes(3);
    expect(audio.playDealCard).not.toHaveBeenCalled();
  } finally {
    play.kill();
    fall.kill();
  }
});

test("a Fall cascade plays both Fall cues before continuing the remaining pickups", () => {
  const playCard = vi.fn();
  const audio = { playDealCard: vi.fn(), playCard };
  const motion = { progress: 0, cooldown: 0, followThrough: 0 };
  const timeline = appendCapture(gsap.timeline({ paused: true }), motion, "fall", 3, audio);
  try {
    timeline.time(1, false);
    expect(playCard).toHaveBeenCalledTimes(2);
    expect(motion.followThrough).toBe(0);
    timeline.progress(1, false);
    expect(motion.progress).toBeCloseTo(0.79);
    expect(motion.followThrough).toBe(1);
    expect(playCard).toHaveBeenCalledTimes(2);
  } finally {
    timeline.kill();
  }
});

test("flaming Falls keep the impact cue aligned with their longer flight", () => {
  const playCard = vi.fn();
  const audio = { playDealCard: vi.fn(), playCard };
  const motion = { progress: 0, cooldown: 0 };
  const timeline = appendCapture(
    gsap.timeline({ paused: true }),
    motion,
    "fall",
    1,
    audio,
    "flame",
  );
  try {
    const secondCue = captureDuration("flame") * 0.27;
    timeline.time(secondCue - 0.01, false);
    expect(playCard).toHaveBeenCalledTimes(1);
    timeline.time(secondCue + 0.01, false);
    expect(playCard).toHaveBeenCalledTimes(2);
  } finally {
    timeline.kill();
  }
});

test("a live Fall starts immediately and sounds only when the cards meet", () => {
  const playCard = vi.fn();
  const motion = { progress: 0, cooldown: 0 };
  const timeline = appendCapture(
    gsap.timeline({ paused: true }),
    motion,
    "fall",
    1,
    { playDealCard: vi.fn(), playCard },
    "plain",
    true,
  );
  try {
    timeline.time(0.01, false);
    expect(motion.progress).toBeGreaterThan(0.27);
    expect(playCard).not.toHaveBeenCalled();
    timeline.time(0.42, false);
    expect(motion.progress).toBeCloseTo(0.55);
    expect(playCard).toHaveBeenCalledOnce();
    timeline.progress(1, false);
    expect(playCard).toHaveBeenCalledOnce();
  } finally {
    timeline.kill();
  }
});

it("sounds the card leaving the hand before the plain Fall contact", () => {
  const { audio, timeline } = setup("fall");
  timeline.time(captureDuration("plain") * 0.27 + 0.001, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"]]);
  timeline.time(captureDuration("plain") * impactAt + 0.001, false);
  expect(audio.playCapture.mock.calls).toEqual([["flight"], ["capture"]]);
});

it.each([false, true])(
  "starts heat during the elemental lift (existing target: %s)",
  (existing) => {
    const { audio, timeline } = setup("fall", "heat", 1, existing);
    const contact = existing ? 0.42 : captureDuration("heat") * impactAt;
    const heatAt = existing
      ? 0.42 * ((captureElementStart("heat") - fallRiseAt) / (impactAt - fallRiseAt))
      : captureDuration("heat") * captureElementStart("heat");
    timeline.time(heatAt - 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flight"]]);
    timeline.time(heatAt + 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flight"], ["heat"]]);
    timeline.time(contact + 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flight"], ["heat"], ["soft-contact"]]);
    timeline.progress(1, false);
    expect(audio.playCapture).toHaveBeenCalledTimes(3);
    expect(audio.playCard).toHaveBeenCalledTimes(existing ? 0 : 1);
  },
);

it.each([false, true])(
  "plays wind from release through hover and descent, then earth at contact (existing target: %s)",
  (existing) => {
    const { audio, timeline } = setup("fall", "flame", 1, existing);
    const contact = existing ? 0.42 : captureDuration("flame") * impactAt;
    const at = (progress: number) =>
      existing
        ? 0.42 * ((progress - fallRiseAt) / (impactAt - fallRiseAt))
        : captureDuration("flame") * progress;
    const hover = at(captureElementStart("flame"));
    const release = existing ? 0 : captureDuration("flame") * fallRiseAt;
    if (!existing) {
      timeline.time(release - 0.001, false);
      expect(audio.playCapture).not.toHaveBeenCalled();
    }
    timeline.time(release + 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flame-rise"]]);
    timeline.time(hover + 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"]]);
    timeline.time(contact - 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"]]);
    timeline.time(contact + 0.001, false);
    expect(audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
    timeline.progress(1, false);
    expect(audio.playCapture).toHaveBeenCalledTimes(3);
    expect(audio.playCapture).not.toHaveBeenCalledWith("capture");
  },
);

it("plays the flame impact once before follow-through cascade contacts", () => {
  const { audio, timeline } = setup("fall", "flame", 3, true);
  timeline.time(0.421, false);
  expect(audio.playCapture.mock.calls).toEqual([["flame-rise"], ["heat"], ["flame"]]);
  timeline.progress(1, false);
  expect(audio.playCapture.mock.calls.filter(([cue]) => cue === "flame")).toHaveLength(1);
  expect(audio.playCapture).not.toHaveBeenCalledWith("capture");
  expect(audio.playCard).toHaveBeenCalledTimes(2);
});
