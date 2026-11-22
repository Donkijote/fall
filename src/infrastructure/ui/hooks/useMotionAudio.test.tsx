import { StrictMode, useLayoutEffect } from "react";

import { fireEvent, render } from "@testing-library/react";

import { useMotionAudio } from "./useMotionAudio";

const factory = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@/infrastructure/adapters/audio/motionAudio", () => ({
  createMotionAudio: factory.create,
}));

function session() {
  return {
    preload: vi.fn(),
    prepare: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    playCapture: vi.fn(),
  };
}
beforeEach(() => vi.clearAllMocks());

it("preloads before the first motion layout effect and unlocks in pointer and keyboard gestures", () => {
  const audio = session();
  factory.create.mockReturnValue(audio);
  function Motion() {
    const ref = useMotionAudio();
    useLayoutEffect(() => ref.current?.playCapture("flame-rise"), [ref]);
    return null;
  }
  const view = render(<Motion />);
  expect(audio.preload).toHaveBeenCalledOnce();
  expect(audio.playCapture).toHaveBeenCalledWith("flame-rise");
  expect(audio.preload.mock.invocationCallOrder[0]).toBeLessThan(
    audio.playCapture.mock.invocationCallOrder[0],
  );
  expect(audio.prepare).not.toHaveBeenCalled();
  fireEvent.pointerDown(document);
  fireEvent.keyDown(document, { key: "Enter" });
  expect(audio.prepare).toHaveBeenCalledTimes(2);
  view.unmount();
  expect(audio.dispose).toHaveBeenCalledOnce();
  fireEvent.pointerDown(document);
  expect(audio.prepare).toHaveBeenCalledTimes(2);
});

it("disposes on leave and opens a fresh session on restart", () => {
  const first = session();
  const second = session();
  factory.create.mockReturnValueOnce(first).mockReturnValueOnce(second);
  function Motion({ enabled }: { enabled: boolean }) {
    useMotionAudio(enabled);
    return null;
  }
  const view = render(<Motion enabled />);
  view.rerender(<Motion enabled={false} />);
  expect(first.dispose).toHaveBeenCalledOnce();
  fireEvent.keyDown(document);
  expect(first.prepare).not.toHaveBeenCalled();
  view.rerender(<Motion enabled />);
  expect(second.preload).toHaveBeenCalledOnce();
  fireEvent.pointerDown(document);
  expect(first.prepare).not.toHaveBeenCalled();
  expect(second.prepare).toHaveBeenCalledOnce();
  view.unmount();
  expect(second.dispose).toHaveBeenCalledOnce();
});

it("stops hidden playback and retries unlock on return without replaying a cue", () => {
  const audio = session();
  factory.create.mockReturnValue(audio);
  const visibility = vi.spyOn(document, "visibilityState", "get");
  function Motion() {
    useMotionAudio();
    return null;
  }
  const view = render(<Motion />);
  visibility.mockReturnValue("hidden");
  fireEvent(document, new Event("visibilitychange"));
  expect(audio.stop).toHaveBeenCalledOnce();
  expect(audio.prepare).not.toHaveBeenCalled();
  visibility.mockReturnValue("visible");
  fireEvent(document, new Event("visibilitychange"));
  expect(audio.prepare).toHaveBeenCalledOnce();
  expect(audio.playCapture).not.toHaveBeenCalled();
  view.unmount();
  fireEvent(document, new Event("visibilitychange"));
  expect(audio.prepare).toHaveBeenCalledOnce();
  visibility.mockRestore();
});

it("cleans up Strict Mode's first session and retains only the active unlock listener", () => {
  const first = session();
  const second = session();
  factory.create.mockReturnValueOnce(first).mockReturnValueOnce(second);
  function Motion() {
    useMotionAudio();
    return null;
  }
  const view = render(
    <StrictMode>
      <Motion />
    </StrictMode>,
  );
  expect(first.dispose).toHaveBeenCalledOnce();
  fireEvent.pointerDown(document);
  expect(first.prepare).not.toHaveBeenCalled();
  expect(second.prepare).toHaveBeenCalledOnce();
  view.unmount();
  expect(second.dispose).toHaveBeenCalledOnce();
});
