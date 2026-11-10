import dealCardSound from "@/assets/cards/deal-card.mp3";
import playCardSound from "@/assets/cards/play-card.mp3";
import { updateGamePreferences } from "@/infrastructure/preferences/gamePreferences";

import { createCardAudio } from "./cardAudio";

const howler = vi.hoisted(() => ({
  instances: [] as {
    options: { src: string[]; volume: number };
    play: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
    volume: ReturnType<typeof vi.fn>;
    mute: ReturnType<typeof vi.fn>;
  }[],
}));
vi.mock("howler", () => ({
  Howl: class {
    play = vi.fn();
    unload = vi.fn();
    volume = vi.fn();
    mute = vi.fn();
    options: { src: string[]; volume: number };
    constructor(options: { src: string[]; volume: number }) {
      this.options = options;
      howler.instances.push(this);
    }
  },
}));

beforeEach(() => {
  howler.instances.length = 0;
  localStorage.clear();
});

it("loads the play-card clip lazily and reuses it without replacing the deal cue", () => {
  const audio = createCardAudio();
  expect(howler.instances).toHaveLength(0);
  audio.playCard();
  audio.playCard();
  expect(howler.instances).toHaveLength(1);
  expect(howler.instances[0].options.src).toEqual([playCardSound]);
  expect(howler.instances[0].play).toHaveBeenCalledTimes(2);
  audio.playDealCard();
  expect(howler.instances[1].options.src).toEqual([dealCardSound]);
  expect(howler.instances[1].play).toHaveBeenCalledOnce();
  audio.dispose();
  for (const sound of howler.instances) expect(sound.unload).toHaveBeenCalledOnce();
});

it("unloads a preloaded deal sound even if it never plays", () => {
  const audio = createCardAudio();
  audio.preloadDeal();
  expect(howler.instances[0].play).not.toHaveBeenCalled();
  audio.dispose();
  expect(howler.instances[0].unload).toHaveBeenCalledOnce();
});

it("updates already loaded sounds and applies preferences to future sounds", () => {
  const audio = createCardAudio();
  audio.playCard();
  updateGamePreferences({ volume: 0.25, muted: true });
  expect(howler.instances[0].volume).toHaveBeenLastCalledWith(0.25);
  expect(howler.instances[0].mute).toHaveBeenLastCalledWith(true);
  audio.playDealCard();
  expect(howler.instances[1].options).toMatchObject({ volume: 0.25, mute: true });
  audio.dispose();
  updateGamePreferences({ volume: 0.9 });
  expect(howler.instances[0].volume).toHaveBeenCalledTimes(1);
});
