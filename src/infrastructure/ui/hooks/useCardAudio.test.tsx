import { fireEvent, render } from "@testing-library/react";

import { useCardAudio } from "./useCardAudio";

const factory = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@/infrastructure/adapters/audio/cardAudio", () => ({ createCardAudio: factory.create }));

function Cards({ enabled = true }: { enabled?: boolean }) {
  useCardAudio(enabled);
  return null;
}

it("recovers the tavern card session on foreground and gestures, and cleans up on disable", () => {
  const session = {
    preloadDeal: vi.fn(),
    preloadPlay: vi.fn(),
    unlock: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  };
  factory.create.mockReturnValue(session);
  const visibility = vi.spyOn(document, "visibilityState", "get");
  const view = render(<Cards />);
  visibility.mockReturnValue("hidden");
  fireEvent(document, new Event("visibilitychange"));
  expect(session.stop).toHaveBeenCalledOnce();
  visibility.mockReturnValue("visible");
  fireEvent(document, new Event("visibilitychange"));
  fireEvent.pointerDown(document);
  fireEvent.keyDown(document);
  expect(session.unlock).toHaveBeenCalledTimes(3);
  view.rerender(<Cards enabled={false} />);
  expect(session.dispose).toHaveBeenCalledOnce();
  fireEvent(document, new Event("visibilitychange"));
  fireEvent.pointerDown(document);
  expect(session.unlock).toHaveBeenCalledTimes(3);
  view.unmount();
  visibility.mockRestore();
});
