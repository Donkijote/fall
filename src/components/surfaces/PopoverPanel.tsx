import { cn } from "cn";
import { useImperativeHandle, useState } from "react";
import type { ComponentProps } from "react";

import { PopoverContent } from "@/components/ui/popover";

import { usePopupMotion } from "./PopupMotion";
import { popoverSurfaceClassName } from "./surfaceStyles";
import "./PopoverPanel.css";

export function PopoverPanel({ className, ref, ...props }: ComponentProps<typeof PopoverContent>) {
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => popup!, [popup]);

  usePopupMotion(popup);

  return (
    <PopoverContent
      {...props}
      ref={setPopup}
      className={cn(
        popoverSurfaceClassName,
        "transition-none data-open:animate-none data-closed:animate-none",
        className,
      )}
    />
  );
}
