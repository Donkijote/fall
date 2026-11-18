import { updateGamePreferences } from "@/infrastructure/preferences/gamePreferences";

import { createCaptureAudio } from "./captureAudio";

const howler = vi.hoisted(() => ({
  instances: [] as {
    options: { src: string[]; volume: number; mute: boolean };
    play: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
    volume: ReturnType<typeof vi.fn>;
    mute: ReturnType<typeof vi.fn>;
  }[],
  resume: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("howler", () => ({
  Howler: { ctx: { state: "suspended", resume: howler.resume } },
  Howl: class {
    play = vi.fn();
    stop = vi.fn();
    unload = vi.fn();
    volume = vi.fn();
    mute = vi.fn();
    options: { src: string[]; volume: number; mute: boolean };
    constructor(options: { src: string[]; volume: number; mute: boolean }) {
      this.options = options;
      howler.instances.push(this);
    }
  },
}));
beforeEach(() => {
  localStorage.clear();
  howler.instances.length = 0;
  vi.clearAllMocks();
});

it("preloads eight cues from seven distinct clips without playing and unlocks in a user gesture", () => {
  const audio = createCaptureAudio();
  audio.preload();
  audio.preload();
  audio.unlock();
  expect(howler.instances).toHaveLength(8);
  expect(new Set(howler.instances.map((sound) => sound.options.src[0])).size).toBe(7);
  expect(howler.resume).toHaveBeenCalledOnce();
  for (const sound of howler.instances) expect(sound.play).not.toHaveBeenCalled();
  audio.dispose();
});

it("layers a quiet card contact under shatter and stops both tails on rapid replay", () => {
  const audio = createCaptureAudio();
  audio.playCapture("freeze");
  audio.playCapture("shatter");
  expect(howler.instances[0].stop).toHaveBeenCalledOnce();
  expect(howler.instances[1].play).toHaveBeenCalledOnce();
  expect(howler.instances[2].play).toHaveBeenCalledOnce();
  expect(howler.instances[2].options.volume).toBeLessThan(howler.instances[1].options.volume);
  audio.playCapture("shatter");
  expect(howler.instances).toHaveLength(3);
  expect(howler.instances[1].stop).toHaveBeenCalledOnce();
  expect(howler.instances[2].stop).toHaveBeenCalledOnce();
  expect(howler.instances[1].play).toHaveBeenCalledTimes(2);
  audio.stop();
  expect(howler.instances[1].stop).toHaveBeenCalledTimes(2);
  audio.dispose();
});

it("applies mute and scaled master volume to loaded and future cues", () => {
  updateGamePreferences({ volume: 1, muted: false });
  const audio = createCaptureAudio();
  audio.playCapture("capture");
  expect(howler.instances[0].options.volume).toBe(0.7);
  updateGamePreferences({ volume: 0.4, muted: true });
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.4 * 0.7);
  expect(howler.instances[0].mute).toHaveBeenLastCalledWith(true);
  audio.playCapture("shatter");
  expect(howler.instances[1].options).toMatchObject({ volume: 0.4 * 0.85, mute: true });
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.4 * 0.22);
  updateGamePreferences({ volume: 0.5, muted: false });
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.5 * 0.22);
  expect(howler.instances[0].mute).toHaveBeenLastCalledWith(false);
  audio.playCapture("capture");
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.5 * 0.7);
  audio.dispose();
});

it("unloads once, unsubscribes preferences, and ignores stale callbacks after disposal", () => {
  const audio = createCaptureAudio();
  audio.preload();
  audio.dispose();
  audio.dispose();
  updateGamePreferences({ volume: 0.5 });
  audio.playCapture("freeze");
  audio.preload();
  audio.unlock();
  expect(howler.instances).toHaveLength(8);
  for (const sound of howler.instances) {
    expect(sound.stop).toHaveBeenCalledOnce();
    expect(sound.unload).toHaveBeenCalledOnce();
    expect(sound.play).not.toHaveBeenCalled();
    expect(sound.volume).not.toHaveBeenCalled();
  }
  expect(howler.resume).not.toHaveBeenCalled();
});

it("lets flight and frost overlap without cancelling either cue", () => {
  const audio = createCaptureAudio();
  audio.playCapture("flight");
  audio.playCapture("freeze");
  expect(howler.instances[0].stop).not.toHaveBeenCalled();
  audio.playCapture("shatter");
  expect(howler.instances[0].stop).not.toHaveBeenCalled();
  expect(howler.instances[1].stop).toHaveBeenCalledOnce();
  audio.stop();
  expect(howler.instances[0].stop).toHaveBeenCalledOnce();
  audio.dispose();
});

it("starts heat alone and lets its tail overlap the later quiet contact", () => {
  updateGamePreferences({ volume: 1, muted: false });
  const audio = createCaptureAudio();
  audio.playCapture("heat");
  expect(howler.instances[0].options.src[0]).toContain("heat-transfer.mp3");
  expect(howler.instances[0].options.volume).toBe(0.6);
  expect(howler.instances).toHaveLength(1);
  audio.playCapture("soft-contact");
  expect(howler.instances[0].stop).not.toHaveBeenCalled();
  expect(howler.instances[1].options.volume).toBe(0.22);
  for (const sound of howler.instances) expect(sound.play).toHaveBeenCalledOnce();
  updateGamePreferences({ volume: 0.5, muted: true });
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.3);
  expect(howler.instances[1].volume).toHaveBeenLastCalledWith(0.11);
  for (const sound of howler.instances) expect(sound.mute).toHaveBeenLastCalledWith(true);
  audio.stop();
  for (const sound of howler.instances) expect(sound.stop).toHaveBeenCalledOnce();
  audio.dispose();
});

it("replaces the flame wind with earth impact and preserves its rumble through cascade contacts", () => {
  updateGamePreferences({ volume: 1, muted: false });
  const audio = createCaptureAudio();
  audio.playCapture("flame-rise");
  const wind = howler.instances[0];
  expect(wind.options).toMatchObject({ loop: true });
  audio.playCapture("heat");
  const fire = howler.instances[1];
  expect(wind.stop).not.toHaveBeenCalled();
  expect(wind.options.src[0]).toContain("flame-rise.mp3");
  audio.playCapture("flame");
  expect(howler.instances).toHaveLength(3);
  const earth = howler.instances[2];
  expect(wind.stop).toHaveBeenCalledOnce();
  expect(fire.stop).toHaveBeenCalledOnce();
  expect(earth.options).toMatchObject({ volume: 0.5, mute: false });
  expect(earth.options.src[0]).toContain("flame-impact.mp3");
  expect(earth.play).toHaveBeenCalledOnce();
  // The contact is earth only; no plain card hit is added.
  expect(
    howler.instances.some((sound) => sound.options.src[0].includes("simple-capture.mp3")),
  ).toBe(false);
  audio.playCapture("flight");
  audio.playCapture("capture");
  expect(earth.stop).not.toHaveBeenCalled();
  updateGamePreferences({ volume: 0.4, muted: true });
  expect(earth.volume).toHaveBeenLastCalledWith(0.2);
  for (const sound of howler.instances) expect(sound.mute).toHaveBeenLastCalledWith(true);
  audio.playCapture("flame");
  expect(earth.stop).toHaveBeenCalledOnce();
  expect(earth.play).toHaveBeenCalledTimes(2);
  audio.stop();
  expect(earth.stop).toHaveBeenCalledTimes(2);
  audio.dispose();
});
