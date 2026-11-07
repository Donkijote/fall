import { BookOpen, FlaskConical, ScrollText } from "lucide-react";
import { Link } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/infrastructure/ui/components/theme/ThemeToggle";
import { ANIMATION_PLAYGROUND_PATH, RULES_PATH, SINGS_SHEETS } from "@/routes/Routes";

type HomeSettingsProps = { open: boolean; onOpenChange: (open: boolean) => void };

export function HomeSettings({ open, onOpenChange }: HomeSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="home-settings [&_[data-slot=button]]:min-h-11 [&_[data-slot=button]]:min-w-11 [&_[data-slot=dialog-close]]:size-11">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Make yourself at home.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <span className="text-sm font-medium">Appearance</span>
          <ThemeToggle />
        </div>
        <nav aria-label="Guides and tools" className="grid gap-2">
          <Link
            to={RULES_PATH}
            onClick={() => onOpenChange(false)}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <BookOpen className="size-4 text-primary" aria-hidden="true" />
            How to play
          </Link>
          <Link
            to={SINGS_SHEETS}
            onClick={() => onOpenChange(false)}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ScrollText className="size-4 text-primary" aria-hidden="true" />
            Sings reference
          </Link>
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
        </nav>
      </DialogContent>
    </Dialog>
  );
}
