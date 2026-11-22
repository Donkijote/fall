import { resumeAudioContext } from "./resumeAudioContext";

const audio = vi.hoisted(() => ({
  ctx: undefined as undefined | { state: string; resume: ReturnType<typeof vi.fn> },
}));
vi.mock("howler", () => ({ Howler: audio }));

beforeEach(() => {
  audio.ctx = undefined;
});

it.each(["suspended", "interrupted"])("resumes a %s context", (state) => {
  audio.ctx = { state, resume: vi.fn().mockResolvedValue(undefined) };
  resumeAudioContext();
  expect(audio.ctx.resume).toHaveBeenCalledOnce();
});

it.each(["running", "closed"])("leaves a %s context alone", (state) => {
  audio.ctx = { state, resume: vi.fn() };
  resumeAudioContext();
  expect(audio.ctx.resume).not.toHaveBeenCalled();
});

it("does not create a context before audio is prepared", () => {
  expect(() => resumeAudioContext()).not.toThrow();
  expect(audio.ctx).toBeUndefined();
});

it("allows a later gesture to retry after a rejected resume", async () => {
  audio.ctx = {
    state: "interrupted",
    resume: vi
      .fn()
      .mockRejectedValueOnce(new Error("Gesture required"))
      .mockResolvedValue(undefined),
  };
  resumeAudioContext();
  await Promise.resolve();
  resumeAudioContext();
  expect(audio.ctx.resume).toHaveBeenCalledTimes(2);
});
