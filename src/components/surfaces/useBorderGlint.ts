import gsap from "gsap";
import { useRef, type RefObject } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Persistent brass highlight; optional attention follows the outline skin's beveled rim. */
export function useBorderGlint(
  surface: RefObject<HTMLElement | null>,
  enabled = true,
  { orbitOnAttention = false }: { orbitOnAttention?: boolean } = {},
) {
  const reducedMotion = useReducedMotion();
  const position = useRef<{ x: string; y: string }>(null);
  const phase = useRef<number | null>(null);

  useGSAP(
    (context) => {
      const element = surface.current;
      if (!element || !enabled) return;
      const random = gsap.utils.random;
      const origin = (position.current ??= {
        x: `${random(20, 80)}%`,
        y: random(0, 1, 1) ? "4%" : "96%",
      });
      gsap.set(element, {
        "--border-glint-x": origin.x,
        "--border-glint-y": origin.y,
        "--border-glint": 0.72,
      });
      if (!orbitOnAttention) {
        if (!reducedMotion) {
          gsap.to(element, {
            "--border-glint": 0.94,
            duration: random(1.8, 2.8),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
        return;
      }

      let hovered = element.matches(":hover");
      let focused = element.matches(":focus-visible");
      let orbit: gsap.core.Timeline | undefined;
      const brighten = !reducedMotion
        ? gsap.quickTo(element, "--border-glint", { duration: 0.18, ease: "power2.out" })
        : undefined;
      const sync = () => {
        const active =
          (hovered || focused) && !element.matches(':disabled, [aria-disabled="true"]');
        if (active) orbit?.play();
        else orbit?.pause();
        if (brighten) brighten(active ? 0.94 : 0.72);
        else element.style.setProperty("--border-glint", active ? "0.94" : "0.72");
      };
      const buildOrbit = () => {
        if (reducedMotion) return;
        orbit?.kill();
        const bounds = element.getBoundingClientRect();
        const width = bounds.width || 100;
        const height = bounds.height || 48;
        // The outline's full-height end strips scale at the source 52:116 ratio.
        const shoulder = Math.min(width / 2, height * 0.276);
        const edge = height * 0.034;
        const points = [
          [shoulder, height * 0.04],
          [width - shoulder, height * 0.04],
          [width - edge, height * 0.34],
          [width - edge, height * 0.66],
          [width - shoulder, height * 0.96],
          [shoulder, height * 0.96],
          [edge, height * 0.66],
          [edge, height * 0.34],
        ];
        const lengths = points.map((point, index) => {
          const next = points[(index + 1) % points.length];
          return Math.hypot(next[0] - point[0], next[1] - point[1]);
        });
        const perimeter = lengths.reduce((sum, length) => sum + length, 0);
        const coordinates = ([x, y]: number[]) => ({
          "--border-glint-x": `${(x / width) * 100}%`,
          "--border-glint-y": `${(y / height) * 100}%`,
        });
        orbit = gsap.timeline({ paused: true, repeat: -1 });
        orbit.set(element, coordinates(points[0]));
        points.forEach((_, index) => {
          orbit!.to(element, {
            ...coordinates(points[(index + 1) % points.length]),
            duration: (3.2 * lengths[index]) / perimeter,
            ease: "none",
          });
        });
        orbit.progress(phase.current ?? random(0, 1));
        orbit.eventCallback("onUpdate", () => {
          phase.current = orbit!.progress();
          position.current = {
            x: element.style.getPropertyValue("--border-glint-x"),
            y: element.style.getPropertyValue("--border-glint-y"),
          };
        });
        phase.current = orbit.progress();
        sync();
      };
      buildOrbit();
      const enter = (event: Event) => {
        if ((event as PointerEvent).pointerType === "touch") return;
        hovered = true;
        sync();
      };
      const leave = () => {
        hovered = false;
        sync();
      };
      const focus = () => {
        focused = element.matches(":focus-visible");
        sync();
      };
      const blur = () => {
        focused = false;
        sync();
      };
      const resize = () => context.add(buildOrbit);
      const observer =
        typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : undefined;
      observer?.observe(element);
      if (!observer) window.addEventListener("resize", resize);
      const events = {
        pointerenter: enter,
        pointerleave: leave,
        pointercancel: leave,
        focus,
        blur,
      };
      Object.entries(events).forEach(([event, handler]) =>
        element.addEventListener(event, handler),
      );
      sync();
      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", resize);
        Object.entries(events).forEach(([event, handler]) =>
          element.removeEventListener(event, handler),
        );
      };
    },
    { dependencies: [enabled, reducedMotion, orbitOnAttention], revertOnUpdate: true },
  );
}
