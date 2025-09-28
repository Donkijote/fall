import type { ReactNode } from "react";

import { TableBackground } from "./TableBackground";
import { TableCards } from "./TableCards";

export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"relative h-[calc(100dvh)] w-full"}>
      <TableBackground />
      <div
        className={
          "absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 transform"
        }
      >
        <TableCards />
      </div>
      {children}
    </div>
  );
};
