import type { ReactNode } from "react";

export function NavigationGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul
      aria-label={label}
      className="flex list-none -space-x-px rounded-md bg-linear-to-b from-artwork-shadow/75 to-artwork-shadow shadow-md ring-1 shadow-artwork-shadow/60 ring-artwork-shadow [&>li:first-child>button]:rounded-l-md [&>li:last-child>button]:rounded-r-md"
    >
      {children}
    </ul>
  );
}
