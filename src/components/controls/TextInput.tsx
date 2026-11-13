import { cn } from "cn";
import gsap from "gsap";
import { useRef, type ComponentProps, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./TextInput.css";

export function TextInput({
  className,
  leadingIcon,
  ...props
}: ComponentProps<typeof Input> & { leadingIcon?: ReactNode }) {
  const frame = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const element = frame.current;
      if (!element || reducedMotion) return;

      const brighten = gsap.quickTo(element, "--input-focus", {
        duration: 0.24,
        ease: "sine.out",
      });
      const orbit = gsap.fromTo(
        element,
        { "--input-glint-angle": "0deg" },
        {
          "--input-glint-angle": "360deg",
          duration: 8,
          repeat: -1,
          ease: "none",
          paused: true,
        },
      );
      const focus = () => {
        brighten(1);
        orbit.play();
      };
      const blur = () => {
        brighten(0);
        orbit.pause();
      };

      element.addEventListener("focusin", focus);
      element.addEventListener("focusout", blur);
      if (element.matches(":focus-within")) focus();
      else gsap.set(element, { "--input-focus": 0 });

      return () => {
        element.removeEventListener("focusin", focus);
        element.removeEventListener("focusout", blur);
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <span ref={frame} className="relative isolate grid w-full min-w-0 rounded-md text-input">
      {leadingIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-3 z-10 grid place-items-center text-gold [&>svg]:size-4"
        >
          {leadingIcon}
        </span>
      )}
      <Input
        {...props}
        className={cn(
          "min-h-11 rounded-md border-transparent bg-transparent text-base text-artwork-foreground transition-none placeholder:text-artwork-foreground/70 focus-visible:border-transparent focus-visible:ring-0 aria-invalid:border-transparent aria-invalid:ring-0 dark:aria-invalid:border-transparent md:text-sm",
          leadingIcon && "ps-10",
          className,
        )}
      />
    </span>
  );
}
