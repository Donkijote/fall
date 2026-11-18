import { useEffect } from "react";

const assets = "img, picture, svg, canvas, video, object, embed";
const editable = 'input, textarea, [contenteditable]:not([contenteditable="false"])';

/** Cover current, lazy-loaded and portaled artwork without blocking taps or scrolling. */
export function useAssetInteractions() {
  useEffect(() => {
    const preventAssetAction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest(editable)) return;
      if (target.closest(assets)) event.preventDefault();
    };
    document.addEventListener("contextmenu", preventAssetAction, true);
    document.addEventListener("dragstart", preventAssetAction, true);
    return () => {
      document.removeEventListener("contextmenu", preventAssetAction, true);
      document.removeEventListener("dragstart", preventAssetAction, true);
    };
  }, []);
}
