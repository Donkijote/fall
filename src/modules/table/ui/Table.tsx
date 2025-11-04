import type { ReactNode } from "react";

import { TableCards } from "./TableCards";
import { TableBackground } from "./components/TableBackground";

export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"relative h-[calc(100dvh)] w-full"}>
      <TableBackground />
      <div
        className={
          "landscape:-translate-y-1/6 absolute left-1/2 top-1/2 h-[50%] w-[90%] -translate-x-1/2 -translate-y-1/2 transform lg:h-[45%] landscape:top-1/3 landscape:h-[40%] landscape:lg:top-1/2 landscape:lg:h-[45%] landscape:lg:w-[60%] landscape:lg:-translate-y-1/2"
        }
      >
        <TableCards />
      </div>
      {children}
    </div>
  );
};
