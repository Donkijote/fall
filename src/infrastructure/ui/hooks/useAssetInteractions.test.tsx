import { StrictMode } from "react";
import { createPortal } from "react-dom";

import { fireEvent, render, screen } from "@testing-library/react";

import { useAssetInteractions } from "./useAssetInteractions";

function Policy({ children }: { children?: React.ReactNode }) {
  useAssetInteractions();
  return children;
}
function nativeAction(target: Element, type: string) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  fireEvent(target, event);
  return event.defaultPrevented;
}

test("blocks artwork context menus and native drags, including assets added later in portals", () => {
  const { rerender, unmount } = render(
    <StrictMode>
      <Policy />
    </StrictMode>,
  );
  rerender(
    <StrictMode>
      <Policy>
        {createPortal(
          <div>
            <img src="/avatar.webp" alt="Avatar" />
            <svg aria-label="Artwork">
              <path data-testid="path" />
            </svg>
            <canvas data-testid="canvas" />
          </div>,
          document.body,
        )}
      </Policy>
    </StrictMode>,
  );
  const image = screen.getByAltText("Avatar");
  for (const target of [image, screen.getByTestId("path"), screen.getByTestId("canvas")]) {
    expect(nativeAction(target, "contextmenu")).toBe(true);
    expect(nativeAction(target, "dragstart")).toBe(true);
  }
  unmount();
  // Detached targets still reach the document when reused after cleanup.
  document.body.append(image);
  expect(nativeAction(image, "contextmenu")).toBe(false);
  expect(nativeAction(image, "dragstart")).toBe(false);
  image.remove();
});

test("keeps image-button activation, gestures and native editing/link menus intact", () => {
  const click = vi.fn();
  render(
    <Policy>
      <button onClick={click}>
        <img src="/profile.webp" alt="Profile" />
      </button>
      <input aria-label="Name" />
      <textarea aria-label="Notes" />
      <div contentEditable suppressContentEditableWarning data-testid="editor">
        <img alt="Editable" />
      </div>
      <a href="/rules">Rules</a>
    </Policy>,
  );
  const profile = screen.getByAltText("Profile");
  fireEvent.click(profile);
  expect(click).toHaveBeenCalledOnce();
  expect(nativeAction(profile, "touchstart")).toBe(false);
  expect(nativeAction(profile, "pointerdown")).toBe(false);
  for (const target of [
    screen.getByLabelText("Name"),
    screen.getByLabelText("Notes"),
    screen.getByAltText("Editable"),
    screen.getByText("Rules"),
  ]) {
    expect(nativeAction(target, "contextmenu")).toBe(false);
  }
});
