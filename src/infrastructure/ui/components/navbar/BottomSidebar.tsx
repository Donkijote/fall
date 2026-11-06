import { useNavigate } from "react-router";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { StorageKeys, StorageService } from "@/application/services/StorageService";
import OneVsOne from "@/assets/lobby/1vs1.webp";
import OneVsOneVsOne from "@/assets/lobby/1vs2.webp";
import TwoVsTwo from "@/assets/lobby/2vs2.webp";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { GameMode } from "@/domain/entities/GameState";
import type { User } from "@/domain/entities/User";
import { GAME_PATH } from "@/routes/Routes";

type BottomSidebarProps = { isOpen: boolean; onClose: () => void };

const gameModes = [
  { id: "1vs1", title: "1 vs 1", description: "Classic duel", bg: OneVsOne },
  { id: "1vs2", title: "1 vs 2", description: "Battle royale style", bg: OneVsOneVsOne },
  { id: "2vs2", title: "2 vs 2", description: "Team match", bg: TwoVsTwo },
] satisfies Array<{ id: GameMode; title: string; description: string; bg: string }>;

export const BottomSidebar = ({ isOpen, onClose }: BottomSidebarProps) => {
  const gameStoreService = useGameStoreService();
  const navigate = useNavigate();
  const onSelectGameMode = (gameMode: GameMode) => {
    const user = StorageService.get<User>(StorageKeys.FALL_USER);
    if (!user) throw new Error("User not found in storage");
    gameStoreService.setupGame(user.id, gameMode);
    onClose();
    navigate(GAME_PATH);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="bottom" className="rounded-none data-[side=bottom]:h-dvh">
        <SheetHeader className="sr-only">
          <SheetTitle>Choose your game</SheetTitle>
          <SheetDescription>Play a duel, a free-for-all, or a team match.</SheetDescription>
        </SheetHeader>
        <div className="grid min-h-0 flex-1 grid-cols-3">
          {gameModes.map((mode) => (
            <Button
              key={mode.id}
              variant="ghost"
              aria-label={`Play ${mode.title}`}
              aria-describedby={`mode-description-${mode.id}`}
              className="group relative h-full w-full overflow-hidden rounded-none border-0 px-3 py-6 whitespace-normal focus-visible:z-10 focus-visible:ring-inset"
              onClick={() => onSelectGameMode(mode.id)}
            >
              <img
                src={mode.bg}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-black/60" />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-primary/15 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span className="relative flex flex-col items-center gap-3 text-white">
                <span className="font-heading text-2xl font-bold sm:text-4xl lg:text-6xl">
                  {mode.title}
                </span>
                <span aria-hidden="true" className="h-1 w-12 rounded-full bg-primary" />
                <span
                  id={`mode-description-${mode.id}`}
                  className="text-sm font-normal sm:text-base"
                >
                  {mode.description}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
