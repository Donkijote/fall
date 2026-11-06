import type { FC, ReactNode } from "react";

export const StatPill: FC<{ label: string; value?: ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
    <div className="text-xs tracking-wide text-text-disabled uppercase">
      {label}
    </div>
    <div className="text-base font-semibold text-text-primary">
      {value ?? "—"}
    </div>
  </div>
);
