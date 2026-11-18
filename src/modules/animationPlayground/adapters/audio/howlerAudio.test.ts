import { createHowlerAudio } from "./howlerAudio";

const sessions = vi.hoisted(() => ({ cards: vi.fn(), captures: vi.fn() }));
vi.mock("@/infrastructure/adapters/audio/cardAudio", () => ({ createCardAudio: sessions.cards }));
vi.mock("@/infrastructure/adapters/audio/captureAudio", () => ({
  createCaptureAudio: sessions.captures,
}));
function sound() {
  return {
    playCard: vi.fn(),
    playDealCard: vi.fn(),
    playCapture: vi.fn(),
    unlock: vi.fn(),
    preload: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  };
}
beforeEach(() => vi.clearAllMocks());

it("creates no audio resources during render or Strict Mode's initial cleanup", () => {
  const audio = createHowlerAudio();
  audio.dispose();
  audio.playCapture("freeze");
  expect(sessions.cards).not.toHaveBeenCalled();
  expect(sessions.captures).not.toHaveBeenCalled();
  const cards = sound();
  const captures = sound();
  sessions.cards.mockReturnValue(cards);
  sessions.captures.mockReturnValue(captures);
  audio.prepare();
  audio.prepare();
  expect(sessions.cards).toHaveBeenCalledOnce();
  expect(sessions.captures).toHaveBeenCalledOnce();
  audio.playCapture("shatter");
  expect(captures.playCapture).toHaveBeenCalledExactlyOnceWith("shatter");
  audio.dispose();
});

it("stops both buses and disposes sessions before a new audition", () => {
  const cards = sound();
  const captures = sound();
  sessions.cards.mockReturnValue(cards);
  sessions.captures.mockReturnValue(captures);
  const audio = createHowlerAudio();
  audio.prepare();
  audio.stop();
  expect(cards.stop).toHaveBeenCalledOnce();
  expect(captures.stop).toHaveBeenCalledOnce();
  audio.dispose();
  expect(cards.dispose).toHaveBeenCalledOnce();
  expect(captures.dispose).toHaveBeenCalledOnce();
  audio.playCapture("capture");
  expect(captures.playCapture).not.toHaveBeenCalled();
  audio.prepare();
  expect(sessions.cards).toHaveBeenCalledTimes(2);
  audio.dispose();
});
