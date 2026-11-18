import gsap from "gsap";
import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ComponentProps } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { Dialog } from "@base-ui/react/dialog";
import { Popover } from "@base-ui/react/popover";
import { useGSAP } from "@gsap/react";

const Presence = createContext<{ open: boolean; finish: () => void } | null>(null);

type Actions = { close: () => void; unmount: () => void };

function usePresence(open: boolean | undefined, defaultOpen = false) {
  const [current, setCurrent] = useState(open ?? defaultOpen);
  const actions = useRef<Actions | null>(null);
  // Controlled closes also go through Base UI's supported external-animation lifecycle.
  useLayoutEffect(() => {
    if (open === undefined || open === current) return;
    if (open) setCurrent(true);
    else actions.current?.close();
  }, [open, current]);
  return { current, setCurrent, actions };
}

export function MotionDialog({
  open,
  defaultOpen,
  onOpenChange,
  actionsRef,
  children,
  ...props
}: ComponentProps<typeof Dialog.Root>) {
  const { current, setCurrent, actions } = usePresence(open, defaultOpen);
  useImperativeHandle(actionsRef, () => ({
    close: () => actions.current?.close(),
    unmount: () => actions.current?.unmount(),
  }));
  return (
    <Presence.Provider value={{ open: current, finish: () => actions.current?.unmount() }}>
      <Dialog.Root
        {...props}
        open={current}
        actionsRef={actions}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);
          if (details.isCanceled) return;
          if (!next) details.preventUnmountOnClose();
          setCurrent(next);
        }}
      >
        {children}
      </Dialog.Root>
    </Presence.Provider>
  );
}

export function MotionPopover({
  open,
  defaultOpen,
  onOpenChange,
  actionsRef,
  children,
  ...props
}: ComponentProps<typeof Popover.Root>) {
  const { current, setCurrent, actions } = usePresence(open, defaultOpen);
  useImperativeHandle(actionsRef, () => ({
    close: () => actions.current?.close(),
    unmount: () => actions.current?.unmount(),
  }));
  return (
    <Presence.Provider value={{ open: current, finish: () => actions.current?.unmount() }}>
      <Popover.Root
        {...props}
        open={current}
        actionsRef={actions}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);
          if (details.isCanceled) return;
          if (!next) details.preventUnmountOnClose();
          setCurrent(next);
        }}
      >
        {children}
      </Popover.Root>
    </Presence.Provider>
  );
}

export function usePopupMotion(popup: HTMLElement | null, overlay: HTMLElement | null = null) {
  const presence = useContext(Presence);
  const open = presence?.open ?? true;
  const finish = useRef(presence?.finish);
  finish.current = presence?.finish;
  const reduced = useReducedMotion();
  const motion = useRef<gsap.core.Timeline | null>(null);
  const previousPopup = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!popup || open || !reduced) return;
    let canceled = false;
    // Base UI commits its closing state before the external-animation completion.
    queueMicrotask(() => {
      if (!canceled) finish.current?.();
    });
    return () => {
      canceled = true;
    };
  }, [popup, open, reduced]);
  useGSAP(
    () => {
      motion.current?.kill();
      if (!popup) return;
      if (reduced) {
        gsap.set(popup, { opacity: open ? 1 : 0, y: 0 });
        if (overlay) gsap.set(overlay, { opacity: open ? 1 : 0 });
        return;
      }
      const first = previousPopup.current !== popup;
      previousPopup.current = popup;
      if (first && open && !reduced) {
        gsap.set(popup, { opacity: 0, y: 4 });
        if (overlay) gsap.set(overlay, { opacity: 0 });
      }
      const timeline = (motion.current = gsap.timeline({
        onComplete: () => {
          if (!open) finish.current?.();
        },
      }));
      const duration = open ? 0.32 : 0.26;
      timeline.to(
        popup,
        {
          opacity: open ? 1 : 0,
          y: open ? 0 : 3,
          duration,
          ease: "sine.inOut",
        },
        0,
      );
      if (overlay) timeline.to(overlay, { opacity: open ? 1 : 0, duration, ease: "sine.inOut" }, 0);
      return () => {
        timeline.kill();
      };
    },
    { dependencies: [popup, overlay, open, reduced] },
  );
}
