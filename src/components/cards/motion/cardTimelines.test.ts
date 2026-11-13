import gsap from "gsap";

import { cardFlights } from "./cardFlights";
import { appendCapture, appendDeal, appendPlay } from "./cardTimelines";
import { captureDuration } from "./tableCapture";

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
