import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./ActionButton.css";

export type ActionButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
  tone?: "primary" | "quiet" | "outline";
  iconOnly?: boolean;
};

const buttonVariants = { primary: "default", quiet: "ghost", outline: "outline" } as const;

export function ActionButton({
  className,
  tone = "quiet",
  iconOnly = false,
  ref,
  ...props
}: ActionButtonProps) {
  const animateSurface = iconOnly || tone === "quiet";
  const button = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => button.current!);

  useGSAP(
    () => {
      const element = button.current;
      if (!element || !animateSurface || reducedMotion) return;

      const reveal = gsap.fromTo(
        element,
        { "--action-reveal": 0 },
        { "--action-reveal": 1, duration: 0.24, ease: "power2.out", paused: true },
      );
      const sync = () => {
        const active =
          !element.matches(':disabled, [aria-disabled="true"]') &&
          element.matches(':hover, :focus-visible, [aria-expanded="true"]');
        if (active) reveal.play();
        else reveal.reverse();
      };
      const observer = new MutationObserver(sync);
      observer.observe(element, {
        attributeFilter: ["aria-expanded", "disabled", "aria-disabled"],
      });
      const events = ["pointerenter", "pointerleave", "focus", "blur"];
      events.forEach((event) => element.addEventListener(event, sync));
      sync();
      return () => {
        observer.disconnect();
        events.forEach((event) => element.removeEventListener(event, sync));
      };
    },
    { dependencies: [animateSurface, reducedMotion], revertOnUpdate: true },
  );

  const glint = !iconOnly;
  const glintPosition = useRef<{ x: string; y: string }>(null);
  useGSAP(
    () => {
      const element = button.current;
      if (!element || !glint) return;

      const random = gsap.utils.random;
      const position = (glintPosition.current ??= {
        x: `${random(20, 80)}%`,
        y: random(0, 1, 1) ? "4%" : "96%",
      });

      gsap.set(element, {
        "--action-glint-x": position.x,
        "--action-glint-y": position.y,
        "--action-glint": 0.72,
      });

      if (!reducedMotion) {
        gsap.to(element, {
          "--action-glint": 0.94,
          duration: random(1.8, 2.8),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    },
    { dependencies: [glint, reducedMotion], revertOnUpdate: true },
  );

  return (
    <Button
      {...props}
      ref={button}
      variant={iconOnly ? "ghost" : buttonVariants[tone]}
      size={iconOnly ? "icon" : "default"}
      data-tone={tone}
      data-icon-ornament={iconOnly ? "" : undefined}
      data-glint={glint ? "" : undefined}
      data-frame={!iconOnly ? "" : undefined}
      className={cn(
        "game-button h-auto min-h-11 min-w-11 gap-2.5 rounded-md px-4 py-2.5 text-sm transition-none active:not-aria-[haspopup]:translate-y-0 compact-landscape:text-sm",
        !iconOnly &&
          "relative border-transparent px-6 bg-transparent hover:bg-transparent aria-expanded:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
        !iconOnly &&
          tone === "primary" &&
          "title-type text-base text-primary-foreground uppercase tracking-wide hover:text-primary-foreground compact-landscape:text-sm",
        tone === "primary" && "min-h-12 compact-landscape:min-h-11",
        !iconOnly &&
          tone === "outline" &&
          "text-artwork-foreground hover:text-artwork-foreground aria-expanded:text-artwork-foreground",
        !iconOnly &&
          tone === "quiet" &&
          "enabled:hover:text-artwork-foreground focus-visible:text-artwork-foreground aria-expanded:text-artwork-foreground dark:enabled:hover:text-artwork-foreground",
        iconOnly &&
          "relative border-transparent bg-transparent text-foreground hover:bg-transparent dark:hover:bg-transparent",
        iconOnly &&
          "game-button-icon p-2.5 [&_svg:not([class*='size-'])]:size-[clamp(22px,1.9vw,30px)] [&_svg]:stroke-[1.5]",
        className,
      )}
    />
  );
}
