import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useState } from "react";
import type { ComponentProps } from "react";

import { PopoverContent } from "@/components/ui/popover";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { panelClassName } from "./surfaceStyles";

export function PopoverPanel({ className, ref, ...props }: ComponentProps<typeof PopoverContent>) {
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(ref, () => popup!, [popup]);

  useGSAP(
    () => {
      if (!popup || reducedMotion) return;
      gsap.from(popup, { opacity: 0, y: 4, duration: 0.16, ease: "power2.out" });
    },
    { dependencies: [popup, reducedMotion], revertOnUpdate: true },
  );

  return (
    <PopoverContent
      {...props}
      ref={setPopup}
      className={cn(panelClassName, "data-open:animate-none data-closed:animate-none", className)}
    />
  );
}
