import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef } from "react";
import type { ComponentProps, CSSProperties } from "react";

import thumb from "@/assets/ui/controls/brass-wax-thumb.webp";
import track from "@/assets/ui/controls/mute-track.webp";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { Switch } from "../ui/switch";
import "./WaxSwitch.css";

export function WaxSwitch({
  className,
  style,
  ref,
  ...props
}: Omit<ComponentProps<typeof Switch>, "size">) {
  const root = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => root.current!);

  useGSAP(
    () => {
      const element = root.current;
      if (!element || reducedMotion) return;

      const isChecked = () => element.hasAttribute("data-checked");
      const reveal = gsap.fromTo(
        element,
        { "--wax-switch-progress": 0 },
        { "--wax-switch-progress": 1, duration: 0.24, ease: "sine.inOut", paused: true },
      );
      reveal.progress(isChecked() ? 1 : 0);
      const observer = new MutationObserver(() => {
        if (isChecked()) reveal.play();
        else reveal.reverse();
      });
      observer.observe(element, { attributeFilter: ["data-checked"] });
      return () => observer.disconnect();
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <Switch
      {...props}
      ref={root}
      className={cn(
        "wax-switch isolate cursor-pointer px-0.25 transition-none data-[size=default]:h-6 data-[size=default]:w-14",
        "[&_[data-slot=switch-thumb]]:size-4.5 [&_[data-slot=switch-thumb]]:bg-transparent [&_[data-slot=switch-thumb]]:bg-contain [&_[data-slot=switch-thumb]]:bg-[image:var(--switch-thumb-art)] [&_[data-slot=switch-thumb]]:transition-none",
        className,
      )}
      style={
        {
          ...style,
          "--switch-track-art": `url("${track}")`,
          "--switch-thumb-art": `url("${thumb}")`,
        } as CSSProperties
      }
    />
  );
}
