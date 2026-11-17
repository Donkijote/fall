import { cn } from "cn";
import gsap from "gsap";
import { Check } from "lucide-react";
import { useImperativeHandle, useRef } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { Checkbox } from "@base-ui/react/checkbox";
import { useGSAP } from "@gsap/react";

import "./BrassCheckbox.css";

export function BrassCheckbox({ className, ref, ...props }: Checkbox.Root.Props) {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => root.current!);
  useGSAP(
    () => {
      const element = root.current;
      if (!element || reducedMotion) return;
      const selected = () => Number(element.getAttribute("aria-checked") !== "false");
      gsap.set(element, { "--checkbox-pressed": selected() });
      const update = () =>
        gsap.to(element, {
          "--checkbox-pressed": selected(),
          duration: 0.28,
          ease: "back.out(1.5)",
          overwrite: "auto",
        });
      const observer = new MutationObserver(update);
      observer.observe(element, { attributeFilter: ["aria-checked"] });
      return () => {
        observer.disconnect();
        gsap.killTweensOf(element);
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );
  return (
    <Checkbox.Root
      {...props}
      ref={root}
      className={cn(
        "brass-checkbox relative isolate inline-grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-primary-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
    >
      <Checkbox.Indicator
        keepMounted
        aria-hidden="true"
        className="brass-checkbox-mark relative grid place-items-center"
      >
        <Check className="size-4 stroke-[2.5] drop-shadow-sm" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
