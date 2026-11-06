import type { PropsWithChildren } from "react";

export const Pill = ({ children }: PropsWithChildren) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-text-secondary backdrop-blur">
    {children}
  </span>
);
