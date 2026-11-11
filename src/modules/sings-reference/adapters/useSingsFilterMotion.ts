import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

const entrySelector = "[data-sing-entry]";

export function useSingsFilterMotion() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLDivElement>(null);
  const exitLayerRef = useRef<HTMLDivElement>(null);
  const previousBounds = useRef<Map<string, DOMRect> | null>(null);
  const motionContext = useRef<gsap.Context | null>(null);

  const prepare = (nextIds: ReadonlySet<string>) => {
    const scope = scopeRef.current;
    const exitLayer = exitLayerRef.current;
    if (reducedMotion || !scope || !exitLayer) return;

    const origin = exitLayer.getBoundingClientRect();
    const bounds = new Map<string, DOMRect>();
    const exits = document.createDocumentFragment();

    for (const entry of scope.querySelectorAll<HTMLElement>(entrySelector)) {
      if (exitLayer.contains(entry)) continue;
      const id = entry.dataset.singEntry!;
      const rect = entry.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      bounds.set(id, rect);
      if (nextIds.has(id)) continue;

      const copy = entry.cloneNode(true) as HTMLElement;
      copy.removeAttribute("data-sing-entry");
      Object.assign(copy.style, {
        position: "absolute",
        left: `${rect.left - origin.left}px`,
        top: `${rect.top - origin.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: "none",
        opacity: getComputedStyle(entry).opacity,
      });
      exits.append(copy);
    }

    motionContext.current?.revert();
    exitLayer.replaceChildren(exits);
    previousBounds.current = bounds;
  };

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const exitLayer = exitLayerRef.current;
    return () => {
      motionContext.current?.revert();
      motionContext.current = null;
      previousBounds.current = null;
      if (scope && exitLayer) exitLayer.replaceChildren();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const before = previousBounds.current;
    const scope = scopeRef.current;
    const exitLayer = exitLayerRef.current;
    previousBounds.current = null;
    if (reducedMotion || !before || !scope || !exitLayer) return;

    motionContext.current = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => exitLayer.replaceChildren(),
      });

      if (exitLayer.children.length) {
        timeline.to(exitLayer.children, { opacity: 0, y: -8, duration: 0.18 }, 0);
      }

      for (const entry of scope.querySelectorAll<HTMLElement>(entrySelector)) {
        const old = before.get(entry.dataset.singEntry!);
        const next = entry.getBoundingClientRect();
        if (!next.width || !next.height) continue;
        if (!old) {
          timeline.from(
            entry,
            { opacity: 0, y: 10, duration: 0.24, clearProps: "opacity,transform" },
            0.06,
          );
          continue;
        }
        const x = old.left - next.left;
        const y = old.top - next.top;
        if (x || y) {
          timeline.from(entry, { x, y, duration: 0.28, clearProps: "transform" }, 0);
        }
      }
    }, scope);
  });

  return { scopeRef, exitLayerRef, prepare };
}
