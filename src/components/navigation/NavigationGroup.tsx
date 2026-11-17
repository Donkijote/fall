import type { ReactNode } from "react";

import "./NavigationGroup.css";

export function NavigationGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul aria-label={label} className="game-navigation-group relative isolate flex list-none">
      {children}
    </ul>
  );
}
