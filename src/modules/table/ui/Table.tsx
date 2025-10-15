import type { ReactNode } from "react";

import { TableCards } from "./TableCards";
import { TableBackground } from "./components/TableBackground";

export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"relative h-[calc(100dvh)] w-full"}>
      <TableBackground />
      <div
        className={
          "landscape:lg:-translate-y-1/2 landscape:lg:top-1/2 landscape:lg:h-[40%] absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 transform landscape:top-1/3 landscape:h-[20%] landscape:-translate-y-1/6"
        }
      >
        <TableCards />
      </div>
      {children}
    </div>
  );
};
