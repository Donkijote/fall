import { cn } from "cn";
import type { ComponentProps, CSSProperties } from "react";

import thumb from "@/assets/ui/controls/brass-wax-thumb.webp";
import rail from "@/assets/ui/controls/volume-rail.webp";

import { Slider } from "../ui/slider";
import "./BronzeSlider.css";

export function BronzeSlider({ className, ...props }: ComponentProps<typeof Slider>) {
  return (
    <Slider
      {...props}
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
