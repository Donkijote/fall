import dealCardSound from "@/assets/cards/deal-card.mp3";
import playCardSound from "@/assets/cards/play-card.mp3";

import { createCardAudio } from "./cardAudio";

const howler = vi.hoisted(() => ({
  instances: [] as {
    options: { src: string[]; volume: number };
    play: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
  }[],
}));
vi.mock("howler", () => ({
  Howl: class {
    play = vi.fn();
    unload = vi.fn();
    options: { src: string[]; volume: number };
    constructor(options: { src: string[]; volume: number }) {
      this.options = options;
      howler.instances.push(this);
    }
  },
}));

beforeEach(() => {
  howler.instances.length = 0;
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
