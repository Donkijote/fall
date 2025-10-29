import type { PropsWithChildren } from "react";

export const Pill = ({ children }: PropsWithChildren) => (
  <span className="border-white/10 bg-white/10 backdrop-blur px-2 py-0.5 text-xs text-text-secondary inline-flex items-center rounded-full border">
    {children}
  </span>
);
