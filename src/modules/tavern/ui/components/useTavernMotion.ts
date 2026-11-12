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
  const animation = useRef<{
    timeline: gsap.core.Timeline;
    exit?: gsap.core.Timeline;
    width: number;
    height: number;
  } | null>(null);
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
      const timeline = gsap.timeline({ defaults: { ease: "sine.inOut" } });
      const width = popup.clientWidth;
      const height = popup.clientHeight;
      animation.current = { timeline, width, height };

      if (returningFromTable) {
        timeline.from("[data-tavern-picker-content]", { opacity: 0, duration: 0.22 });
        const exit = gsap
          .timeline({ paused: true, defaults: { ease: "sine.inOut" } })
          .to("[data-tavern-picker-content]", { opacity: 0, duration: 0.26, overwrite: "auto" })
          .to(room, { opacity: 0, duration: 0.42 }, 0.12);
        animation.current = { timeline, exit, width, height };
        return () => {
          animation.current = null;
        };
      }

      const bounds = origin?.getBoundingClientRect();
      const canZoom = Boolean(origin && portal && bounds?.width && bounds.height);
      if (canZoom && origin && portal && bounds) {
        // Carry a frozen copy above the dialog while the real button stays in its layout.
        const card = origin.cloneNode(true) as HTMLElement;
        card.removeAttribute("id");
        card.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
        card.style.height = "100%";
        portal.append(card);

        const hall = origin.closest('[data-slot="card-hall"]');
        if (hall) {
          const otherControls = [
            ...hall.querySelectorAll("header, footer"),
            ...Array.from(hall.querySelectorAll('[data-slot="game-activity-card"]')).filter(
              (card) => card !== origin,
            ),
          ];
          timeline.to(otherControls, { opacity: 0, duration: 0.28 }, 0);
        }
        const scale = Math.max(width / bounds.width, height / bounds.height) * 1.14;
        const x = width / 2 - bounds.left - bounds.width / 2;
        const y = height / 2 - bounds.top - bounds.height / 2;
        timeline
          .set(origin, { opacity: 0 }, 0)
          .set(
            portal,
            {
              autoAlpha: 1,
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            },
            0,
          )
          .to(portal, { x, y, scale, duration: 0.62 }, 0)
          .to(portal, { filter: "blur(5px)", duration: 0.24 }, 0.42)
          .to(portal, { autoAlpha: 0, duration: 0.22 }, 0.52);
      }

      timeline.from(
        room,
        {
          opacity: 0,
          scale: canZoom ? 1.035 : 1,
          filter: canZoom ? "blur(9px)" : "none",
          duration: canZoom ? 0.32 : 0.42,
        },
        canZoom ? 0.44 : 0,
      );
      const revealControlsAt = canZoom ? 0.62 : 0.18;
      timeline.from(chrome, { opacity: 0, duration: 0.26 }, revealControlsAt);
      timeline.from(
        "[data-tavern-card]",
        {
          y: 20,
          opacity: 0,
          stagger: 0.06,
          duration: 0.28,
        },
        revealControlsAt,
      );

      return () => {
        portal?.replaceChildren();
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
    if (pendingClose.current) return;
    const current = animation.current;
    if (
      !popup ||
      !current ||
      (!current.exit && current.timeline.time() === 0) ||
      popup.clientWidth !== current.width ||
      popup.clientHeight !== current.height
    ) {
      pendingClose.current = null;
      onComplete();
      return;
    }
    pendingClose.current = onComplete;
    const finish = () => {
      pendingClose.current = null;
      onComplete();
    };
    if (current.exit) {
      current.exit.eventCallback("onComplete", finish).play();
    } else {
      current.timeline.eventCallback("onReverseComplete", finish).reverse();
    }
  }

  return { dismiss };
}
