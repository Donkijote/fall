import "./FramedCard.css";

export const frameClassName = "rounded-md border-2 border-gold/70 inset-ring-1 inset-ring-gold/25";

export const brassPanelClassName =
  "brass-panel isolate rounded-md border-2 border-transparent bg-transparent shadow-none ring-0 dark:ring-0";

const floatingSurfaceClassName = `${brassPanelClassName} text-popover-foreground [--brass-face:var(--popover)]`;

export const modalSurfaceClassName = `${floatingSurfaceClassName} modal-brass-frame`;
export const popoverSurfaceClassName = `${floatingSurfaceClassName} popover-brass-frame relative`;
export const selectSurfaceClassName = `${floatingSurfaceClassName} select-brass-frame relative`;
