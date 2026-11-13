import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef, type ComponentProps } from "react";

import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./ChoiceButton.css";

export function ChoiceButton({
  className,
  iconOnly = false,
  ref,
  ...props
}: ComponentProps<typeof ToggleGroupItem> & { iconOnly?: boolean }) {
  const button = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => button.current!);

  useGSAP(
    () => {
      const element = button.current;
      if (!element || reducedMotion) return;

      const isSelected = () => element.getAttribute("aria-pressed") === "true";
      const isInteractive = () => !element.matches(':disabled, [aria-disabled="true"]');
      let selected = isSelected();
      gsap.set(element, { "--choice-selected": Number(selected) });

      const select = gsap.quickTo(element, "--choice-selected", {
        duration: 0.36,
        ease: "sine.inOut",
      });
      const preview = gsap.quickTo(element, "--choice-preview", {
        duration: 0.2,
        ease: "power2.out",
      });
      const tiltX = gsap.quickTo(element, "--choice-tilt-x", { duration: 0.28 });
      const tiltY = gsap.quickTo(element, "--choice-tilt-y", { duration: 0.28 });

      const syncPreview = () => {
        preview(Number(isInteractive() && element.matches(":hover, :focus-visible")));
      };
      const trackPointer = (event: PointerEvent) => {
        if (event.pointerType === "touch" || !isInteractive()) return;
        const bounds = element.getBoundingClientRect();
        tiltX((0.5 - (event.clientY - bounds.top) / bounds.height) * 18);
        tiltY(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
      };
      const resetTilt = () => {
        tiltX(0);
        tiltY(0);
        syncPreview();
      };
      let motion: gsap.core.Timeline | undefined;
      const animateSelection = () => {
        motion?.kill();
        motion = gsap
          .timeline()
          .to(element, {
            "--choice-offset": selected ? 2 : -3,
            "--choice-squash": selected ? 0.065 : -0.025,
            duration: selected ? 0.13 : 0.16,
            ease: "power2.out",
          })
          .to(element, {
            "--choice-offset": 0,
            "--choice-squash": 0,
            duration: 0.28,
            ease: selected ? "back.out(2)" : "power2.out",
          });
      };
      const selection = new MutationObserver(() => {
        const next = isSelected();
        if (next !== selected) {
          selected = next;
          select(Number(selected));
          animateSelection();
        }
        if (isInteractive()) syncPreview();
        else resetTilt();
      });
      selection.observe(element, {
        attributeFilter: ["aria-pressed", "disabled", "aria-disabled"],
      });

      element.addEventListener("pointermove", trackPointer);
      const resetEvents = ["pointerleave", "pointercancel"];
      const previewEvents = ["pointerenter", "focus", "blur"];
      resetEvents.forEach((event) => element.addEventListener(event, resetTilt));
      previewEvents.forEach((event) => element.addEventListener(event, syncPreview));
      syncPreview();

      return () => {
        selection.disconnect();
        motion?.revert();
        element.style.removeProperty("--choice-offset");
        element.style.removeProperty("--choice-squash");
        element.removeEventListener("pointermove", trackPointer);
        resetEvents.forEach((event) => element.removeEventListener(event, resetTilt));
        previewEvents.forEach((event) => element.removeEventListener(event, syncPreview));
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <ToggleGroupItem
      {...props}
      ref={button}
      className={cn(
        "choice-button relative isolate min-h-11 min-w-11 cursor-pointer rounded-md border-transparent bg-transparent text-foreground transition-none hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent data-[state=on]:bg-transparent",
        iconOnly ? "px-0" : "px-4",
        className,
      )}
    />
  );
}
