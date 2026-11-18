import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef, type ComponentProps, type CSSProperties } from "react";

import thumb from "@/assets/ui/controls/brass-wax-thumb.webp";
import rail from "@/assets/ui/controls/volume-rail.webp";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { Slider } from "../ui/slider";
import "./BronzeSlider.css";

export function BronzeSlider({
  className,
  ref,
  onValueCommitted,
  ...props
}: ComponentProps<typeof Slider>) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!);
  const reduced = useReducedMotion();
  const mounted = useRef(false);
  const halo = useRef<gsap.core.Tween | null>(null);
  const { contextSafe } = useGSAP(
    () => {
      mounted.current = true;
      const element = root.current;
      element?.style.removeProperty("--slider-settle");
      return () => {
        mounted.current = false;
        halo.current?.kill();
        element?.style.removeProperty("--slider-settle");
      };
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );
  const settle = contextSafe(() => {
    if (!mounted.current || !root.current || reduced || props.disabled) return;
    halo.current?.kill();
    halo.current = gsap.fromTo(
      root.current,
      { "--slider-settle": 1 },
      {
        "--slider-settle": 0,
        duration: 0.16,
        ease: "power2.out",
        overwrite: true,
      },
    );
  });
  return (
    <Slider
      {...props}
      ref={root}
      onValueCommitted={(value, details) => {
        onValueCommitted?.(value, details);
        settle();
      }}
      className={cn(
        "bronze-slider flex items-center data-[orientation=horizontal]:min-h-11 [&>div]:data-[orientation=horizontal]:min-h-11",
        "[&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:cursor-grab [&_[data-slot=slider-thumb]]:bg-transparent [&_[data-slot=slider-thumb]]:bg-contain [&_[data-slot=slider-thumb]]:bg-[image:var(--slider-thumb-art)] [&_[data-slot=slider-thumb]]:ring-0 [&_[data-slot=slider-thumb]]:transition-none [&_[data-slot=slider-thumb]]:active:cursor-grabbing [&_[data-slot=slider-thumb]]:focus-visible:ring-2 [&_[data-slot=slider-thumb]]:focus-visible:ring-gold",
        className,
      )}
      style={
        {
          ...props.style,
          "--slider-rail-art": `url("${rail}")`,
          "--slider-thumb-art": `url("${thumb}")`,
        } as CSSProperties
      }
    />
  );
}
