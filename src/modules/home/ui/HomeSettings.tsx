import { FlaskConical } from "lucide-react";
import { Link } from "react-router";

import { GameDialogContent } from "@/components/game";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/infrastructure/ui/components/theme/ThemeToggle";
import { ANIMATION_PLAYGROUND_PATH } from "@/routes/Routes";

type HomeSettingsProps = { open: boolean; onOpenChange: (open: boolean) => void };

export function HomeSettings({ open, onOpenChange }: HomeSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <GameDialogContent className="home-settings [&_[data-slot=button]]:min-h-11 [&_[data-slot=button]]:min-w-11 [&_[data-slot=dialog-close]]:size-11">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Make yourself at home.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <span className="text-sm font-medium">Appearance</span>
          <ThemeToggle />
        </div>
        {import.meta.env.DEV && (
          <Link
            to={ANIMATION_PLAYGROUND_PATH}
            onClick={() => onOpenChange(false)}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <FlaskConical className="size-4 text-primary" aria-hidden="true" />
            Animation playground
          </Link>
        )}
        <details className="text-xs text-muted-foreground">
          <summary className="flex min-h-11 cursor-pointer items-center font-medium">
            Icon credits
          </summary>
          <p>
            Icons made by Lorc, Delapouite, Faithtoken, Sbed and Skoll for{" "}
            <a className="underline" href="https://game-icons.net">
              Game-icons.net
            </a>
            . Fall applies its own colors. Licensed under{" "}
            <a className="underline" href="https://creativecommons.org/licenses/by/3.0/">
              CC BY 3.0
            </a>
            .
          </p>
        </details>
      </GameDialogContent>
    </Dialog>
  );
}
