import { StrictMode } from "react";

import { cleanup, render } from "@testing-library/react";

import { WindowDragRegion } from "./WindowDragRegion";

describe("WindowDragRegion", () => {
  afterEach(() => {
    cleanup();
    document.documentElement.style.removeProperty("--native-titlebar-height");
  });

  it("does not reserve space or intercept input when disabled", () => {
    const { container } = render(<WindowDragRegion enabled={false} />);
    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement.style.getPropertyValue("--native-titlebar-height")).toBe("");
  });

  it("provides a decorative native drag region and clears its inset when disabled", () => {
    const { container, rerender } = render(<WindowDragRegion enabled />);
    expect(container.querySelector("[data-tauri-drag-region]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("[tabindex]")).toBeNull();
    expect(document.documentElement.style.getPropertyValue("--native-titlebar-height")).toBe(
      "2.5rem",
    );
    rerender(<WindowDragRegion enabled={false} />);
    expect(container).toBeEmptyDOMElement();
    expect(document.documentElement.style.getPropertyValue("--native-titlebar-height")).toBe("");
  });

  it("preserves a pre-existing inset through StrictMode replay and unmount", () => {
    document.documentElement.style.setProperty("--native-titlebar-height", "1rem");
    const { unmount } = render(
      <StrictMode>
        <WindowDragRegion enabled />
      </StrictMode>,
    );
    expect(document.documentElement.style.getPropertyValue("--native-titlebar-height")).toBe(
      "2.5rem",
    );
    unmount();
    expect(document.documentElement.style.getPropertyValue("--native-titlebar-height")).toBe(
      "1rem",
    );
  });
});
