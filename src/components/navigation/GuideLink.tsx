import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef, type ComponentProps } from "react";
import { Link } from "react-router";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./GuideLink.css";

/** Shared leather bookmark for guide navigation, menus, and search results. */
export function GuideLink({ className, ref, ...props }: ComponentProps<typeof Link>) {
  const link = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => link.current!);

  useGSAP(
    (_, contextSafe) => {
      const element = link.current;
      if (!element || reducedMotion) return;
      const hover = window.matchMedia?.("(any-hover: hover)");
      const amount = () =>
        element.getAttribute("aria-current") === "page"
          ? 1
          : Number(
              element.matches(":focus-visible") ||
                Boolean(hover?.matches && element.matches(":hover")),
            ) * 0.92;
      let previous = amount();
      gsap.set(element, { "--guide-reveal": previous });
      const sync = contextSafe?.(() => {
        const next = amount();
        if (previous === next) return;
        previous = next;
        gsap.to(element, {
          "--guide-reveal": next,
          duration: next === 1 ? 0.43 : 0.3,
          ease: next === 1 ? "back.out(1.25)" : "power2.out",
          overwrite: "auto",
        });
      });
      if (!sync) return;
      const events = ["pointerenter", "pointerleave", "focus", "blur"];
      events.forEach((event) => element.addEventListener(event, sync));
      const selection = new MutationObserver(sync);
      selection.observe(element, { attributeFilter: ["aria-current"] });
      return () => {
        selection.disconnect();
        events.forEach((event) => element.removeEventListener(event, sync));
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <Link
      {...props}
      ref={link}
      className={cn(
        "guide-link relative isolate block min-h-11 rounded-md px-7 py-3 outline-none",
        className,
      )}
    />
  );
}
