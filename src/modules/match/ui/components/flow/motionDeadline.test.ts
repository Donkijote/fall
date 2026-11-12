import { createMotionDeadline } from "./motionDeadline";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("releases a queued move if the renderer never starts", () => {
  const settle = vi.fn();
  createMotionDeadline(settle);
  vi.advanceTimersByTime(3500);
  expect(settle).toHaveBeenCalledOnce();
});

it("gives a started sequence time to finish and settles it if playback stops", () => {
  const settle = vi.fn();
  const deadline = createMotionDeadline(settle);
  vi.advanceTimersByTime(3000);
  deadline.started(5);
  vi.advanceTimersByTime(8000);
  expect(settle).not.toHaveBeenCalled();
  vi.advanceTimersByTime(750);
  expect(settle).toHaveBeenCalledOnce();
});

it("cancels the fallback when the sequence finishes or the table closes", () => {
  const settle = vi.fn();
  const deadline = createMotionDeadline(settle);
  deadline.started(1);
  deadline.dispose();
  vi.runAllTimers();
  expect(settle).not.toHaveBeenCalled();
});
