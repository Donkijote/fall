import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useState } from "react";
import type { ComponentProps } from "react";

import crossMark from "@/assets/icons/cross-mark.svg";
import { DialogClose, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import type { DialogContent } from "@/components/ui/dialog";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useGSAP } from "@gsap/react";

import { ActionButton } from "../actions/ActionButton";
import { Icon } from "../icons/Icon";
import { modalSurfaceClassName } from "./surfaceStyles";
import "./ModalContent.css";

export function ModalContent({
  className,
  ref,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogContent>) {
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => popup!, [popup]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!popup || !overlay || reducedMotion) return;
      gsap.from(overlay, { opacity: 0, duration: 0.16 });
      gsap.from(popup, { opacity: 0, y: 4, duration: 0.18, ease: "power2.out" });
    },
    { dependencies: [popup, overlay, reducedMotion], revertOnUpdate: true },
  );

  return (
    <DialogPortal>
      <DialogOverlay ref={setOverlay} className="data-open:animate-none data-closed:animate-none" />
      <DialogPrimitive.Popup
        ref={setPopup}
        data-slot="dialog-content"
        className={cn(
          "game-dialog fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto rounded-md bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none sm:max-w-md dark:ring-foreground/10",
          modalSurfaceClassName,
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose render={<ActionButton iconOnly className="absolute top-4 right-4" />}>
            <Icon icon={crossMark} className="size-4 text-gold" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
