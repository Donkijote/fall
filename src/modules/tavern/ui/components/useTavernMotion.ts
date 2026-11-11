import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useTavernMotion(
  popup: HTMLDivElement | null,
  origin?: HTMLElement | null,
  returningFromTable = false,
) {
  const reducedMotion = useReducedMotion();
  const animation = useRef<{ timeline: gsap.core.Timeline; width: number; height: number } | null>(
    null,
  );
  const pendingClose = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!reducedMotion || !pendingClose.current) return;
    const close = pendingClose.current;
    pendingClose.current = null;
    close();
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (!popup || reducedMotion) return;

      const room = popup.querySelector("[data-tavern-room]");
      const chrome = popup.querySelector("[data-tavern-chrome]");
      const portal = popup.querySelector<HTMLElement>("[data-tavern-zoom]");
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      const width = popup.clientWidth;
      const height = popup.clientHeight;
      animation.current = { timeline, width, height };

      if (returningFromTable) {
        timeline.from("[data-tavern-picker-content]", { opacity: 0, duration: 0.22 });
        return () => {
          animation.current = null;
        };
      }

      const source = origin?.querySelector(".game-activity-art") ?? origin;
      const bounds = source?.getBoundingClientRect();
      const canZoom = Boolean(portal && bounds?.width && bounds.height);
      if (canZoom && portal && bounds) {
        const hall = origin?.closest('[data-slot="card-hall"]');
        if (hall) {
          const otherControls = [
            ...hall.querySelectorAll("header, footer"),
            ...Array.from(hall.querySelectorAll('[data-slot="game-activity-card"]')).filter(
              (card) => card !== origin,
            ),
          ];
          timeline.to(otherControls, { opacity: 0, duration: 0.16 }, 0);
        }
        const scale = Math.max(width / bounds.width, height / bounds.height) * 1.14;
        const x = width / 2 - bounds.left - bounds.width / 2;
        const y = height / 2 - bounds.top - bounds.height / 2;
        timeline
          .set(portal, {
            autoAlpha: 1,
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
          })
          .to(portal, { x, y, scale, duration: 0.38, ease: "power2.inOut" }, 0.025)
          .to(portal, { filter: "blur(5px)", duration: 0.15 }, 0.25)
          .to(portal, { autoAlpha: 0, duration: 0.12 }, 0.32);
      }

      timeline.from(
        room,
        {
          opacity: 0,
          scale: canZoom ? 1.035 : 1,
          filter: canZoom ? "blur(9px)" : "none",
          duration: canZoom ? 0.19 : 0.16,
        },
        canZoom ? 0.29 : 0,
      );
      timeline.from(chrome, { opacity: 0, duration: 0.16 }, canZoom ? 0.43 : 0.06);
      timeline.from(
        "[data-tavern-card]",
        {
          y: 20,
          opacity: 0,
          stagger: 0.042,
          duration: 0.17,
        },
        canZoom ? 0.43 : 0.06,
      );

      return () => {
        animation.current = null;
      };
    },
    {
      scope: popup ?? undefined,
      dependencies: [popup, origin, reducedMotion, returningFromTable],
      revertOnUpdate: true,
    },
  );

  function dismiss(onComplete: () => void) {
    const current = animation.current;
    if (
      !popup ||
      returningFromTable ||
      !current ||
      current.timeline.time() === 0 ||
      popup.clientWidth !== current.width ||
      popup.clientHeight !== current.height
    ) {
      pendingClose.current = null;
      onComplete();
      return;
    }
    pendingClose.current = onComplete;
    current.timeline
      .eventCallback("onReverseComplete", () => {
        pendingClose.current = null;
        onComplete();
      })
      .timeScale(1.5)
      .reverse();
  }

  return { dismiss };
}
