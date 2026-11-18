import gsap from "gsap";
import { MemoryRouter } from "react-router";

import { act, fireEvent, render } from "@testing-library/react";

import { chapters } from "../../../application/rulebookContent";
import { ChapterNavigation } from "./ChapterNavigation";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/infrastructure/ui/hooks/useGamePreferences", () => ({
  useReducedMotion: () => preference.reduced,
}));
beforeEach(() => {
  preference.reduced = false;
});
function preview() {
  return render(
    <MemoryRouter>
      <ChapterNavigation
        chapter={chapters[0]}
        searching={false}
        singsLink={<a href="/sings">Sings</a>}
        backLink={null}
        onChoose={() => {}}
      />
    </MemoryRouter>,
  );
}
function finish(panel: HTMLElement) {
  act(() => {
    gsap.getTweensOf(panel).forEach((tween) => (tween.parent as gsap.core.Timeline).progress(1));
  });
}
test("rapid disclosure toggles cancel closing and hide links from focus during exits", () => {
  const { container, unmount } = preview();
  const details = container.querySelector("details")!;
  const summary = details.querySelector("summary")!;
  const panel = details.lastElementChild as HTMLElement;
  fireEvent.click(summary);
  finish(panel);
  expect(details.open).toBe(true);
  expect(panel.inert).toBe(false);
  fireEvent.click(summary);
  expect(details.open).toBe(true);
  expect(panel.inert).toBe(true);
  fireEvent.click(summary);
  finish(panel);
  expect(details.open).toBe(true);
  expect(panel.inert).toBe(false);
  fireEvent.click(summary);
  finish(panel);
  expect(details.open).toBe(false);
  unmount();
  expect(gsap.getTweensOf(panel)).toHaveLength(0);
});
test("reduced motion opens and closes immediately", () => {
  preference.reduced = true;
  const { container } = preview();
  const details = container.querySelector("details")!;
  const summary = details.querySelector("summary")!;
  fireEvent.click(summary);
  expect(summary).toHaveAttribute("aria-expanded", "true");
  expect(details.open).toBe(true);
  fireEvent.click(summary);
  expect(details.open).toBe(false);
});
