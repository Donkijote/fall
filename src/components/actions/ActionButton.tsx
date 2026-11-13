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
  framed?: boolean;
};

const buttonVariants = { primary: "default", quiet: "ghost", outline: "outline" } as const;

export function ActionButton({
  className,
  tone = "quiet",
  iconOnly = false,
  framed = true,
  ref,
  ...props
}: ActionButtonProps) {
  const useSkin = framed && !iconOnly;

  const animateSurface = framed && (iconOnly || tone === "quiet");
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

  return (
    <Button
      {...props}
      ref={button}
      variant={framed && iconOnly ? "ghost" : buttonVariants[tone]}
      size={iconOnly ? "icon" : "default"}
      data-tone={tone}
      data-icon-ornament={framed && iconOnly ? "" : undefined}
      data-frame={useSkin ? "" : undefined}
      className={cn(
        "game-button h-auto min-h-11 min-w-11 gap-2.5 rounded-md px-4 py-2.5 text-sm transition-none active:not-aria-[haspopup]:translate-y-0 compact-landscape:text-sm",
        useSkin &&
          "relative border-transparent px-6 bg-transparent hover:bg-transparent aria-expanded:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
        useSkin &&
          tone === "primary" &&
          "title-type text-base text-primary-foreground uppercase tracking-wide hover:text-primary-foreground compact-landscape:text-sm",
        tone === "primary" && "min-h-12 compact-landscape:min-h-11",
        !framed &&
          tone === "primary" &&
          "border-gold/55 bg-primary text-primary-foreground shadow-sm shadow-artwork-shadow/25 hover:bg-primary/90 text-base font-semibold",
        useSkin &&
          tone === "outline" &&
          "text-artwork-foreground hover:text-artwork-foreground aria-expanded:text-artwork-foreground",
        useSkin &&
          tone === "quiet" &&
          "enabled:hover:text-artwork-foreground focus-visible:text-artwork-foreground aria-expanded:text-artwork-foreground dark:enabled:hover:text-artwork-foreground",
        framed &&
          iconOnly &&
          "relative border-transparent bg-transparent text-foreground hover:bg-transparent dark:hover:bg-transparent",
        !framed && tone === "outline" && "border-gold/55",
        iconOnly &&
          "game-button-icon p-2.5 [&_svg:not([class*='size-'])]:size-[clamp(22px,1.9vw,30px)] [&_svg]:stroke-[1.5]",
        className,
      )}
    />
  );
}
