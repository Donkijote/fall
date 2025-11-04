import { clsx } from "clsx";
import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import { AnimationKeys } from "@/application/services/AnimationService";

import { TableCards } from "./TableCards";
import { TableBackground } from "./components/TableBackground";

export const Table = ({ children }: { children: ReactNode }) => {
  const { players } = useGameStoreState();

  const onlyTwoPlayers = players.length === 2;

  return (
    <div className={"relative h-[calc(100dvh)] w-full"}>
      <TableBackground />
      <LayoutGroup id={AnimationKeys.GAME_CARDS}>
        <div
          className={clsx(
            "landscape:-translate-y-1/6 absolute left-1/2 top-1/2 h-[50%] -translate-x-1/2 -translate-y-1/2 transform lg:h-[45%] landscape:top-1/3 landscape:h-[40%] landscape:lg:top-1/2 landscape:lg:h-[45%] landscape:lg:-translate-y-1/2",
            {
              "w-[90%] landscape:lg:w-[60%]": onlyTwoPlayers,
              "w-[40%] landscape:lg:w-[55%]": !onlyTwoPlayers,
            },
          )}
        >
          <TableCards />
        </div>
        {children}
      </LayoutGroup>
    </div>
  );
};
