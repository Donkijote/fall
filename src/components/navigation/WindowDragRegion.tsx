import { useLayoutEffect } from "react";

/** Transparent native title-bar strip; AppKit still owns the traffic lights. */
export function WindowDragRegion({ enabled }: { enabled: boolean }) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const root = document.documentElement.style;
    const previous = root.getPropertyValue("--native-titlebar-height");
    root.setProperty("--native-titlebar-height", "2.5rem");
    return () => {
      if (previous) root.setProperty("--native-titlebar-height", previous);
      else root.removeProperty("--native-titlebar-height");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      data-tauri-drag-region
      className="fixed top-0 right-0 left-22 z-[100] h-10 select-none"
    />
  );
}
