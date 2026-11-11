import { ArrowLeft, FlaskConical, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useId, useState } from "react";
import { Link } from "react-router";

import { ActionButton, ChoiceButton, ModalContent, SelectPanel, SelectTrigger } from "@/components";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  resetGamePreferences,
  updateGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";
import { useGamePreferences } from "@/infrastructure/ui/hooks/useGamePreferences";
import { ANIMATION_PLAYGROUND_PATH } from "@/routes/Routes";

type HomeSettingsProps = { open: boolean; onOpenChange: (open: boolean) => void };

const appearances = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];
const rowClassName = "flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3";
const sectionClassName = "text-base";

function SettingsContent({ onOpenChange }: Pick<HomeSettingsProps, "onOpenChange">) {
  const { theme, setTheme } = useTheme();
  const { volume, muted, motion } = useGamePreferences();
  const id = useId();
  const [credits, setCredits] = useState(false);

  return (
    <ModalContent className="home-settings max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 overflow-hidden sm:max-w-xl">
      <DialogHeader className="min-h-11 justify-center pr-12">
        <DialogTitle className="text-2xl font-normal">
          {credits ? "Credits & licenses" : "Settings"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {credits
            ? "Artwork and icon attributions."
            : "Appearance, audio, and accessibility preferences."}
        </DialogDescription>
      </DialogHeader>
      <div className="min-h-0 [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden">
        {credits ? (
          <div className="space-y-4 pb-3 text-sm">
            <h2 className={sectionClassName}>Icons</h2>
            <p>
              Icons made by Lorc, Delapouite, Faithtoken, Sbed and Skoll for{" "}
              <a
                className="underline focus-visible:outline-2 focus-visible:outline-ring"
                href="https://game-icons.net"
              >
                Game-icons.net
              </a>
              . Fall applies its own colors. Licensed under{" "}
              <a
                className="underline focus-visible:outline-2 focus-visible:outline-ring"
                href="https://creativecommons.org/licenses/by/3.0/"
              >
                CC BY 3.0
              </a>
              .
            </p>
            <p>The Help icon uses project-drawn geometry.</p>
          </div>
        ) : (
          <>
            <section aria-labelledby={`${id}-general`}>
              <h2 id={`${id}-general`} className={sectionClassName}>
                General
              </h2>
              <div className={rowClassName}>
                <span id={`${id}-appearance`} className="font-medium">
                  Appearance
                </span>
                <ToggleGroup
                  aria-labelledby={`${id}-appearance`}
                  value={[theme ?? "system"]}
                  onValueChange={(values) => {
                    if (values[0]) setTheme(values[0]);
                  }}
                  variant="outline"
                >
                  {appearances.map(({ value, label, icon: Icon }) => (
                    <ChoiceButton key={value} value={value} aria-label={label} title={label}>
                      <Icon aria-hidden="true" className="size-5" />
                    </ChoiceButton>
                  ))}
                </ToggleGroup>
              </div>
            </section>
            <Separator className="my-3" />
            <section aria-labelledby={`${id}-audio`}>
              <h2 id={`${id}-audio`} className={sectionClassName}>
                Audio
              </h2>
              <div className={rowClassName}>
                <Label id={`${id}-volume`} className="font-medium">
                  Card effects volume
                </Label>
                <div className="flex w-52 max-w-full items-center gap-3">
                  <Slider
                    aria-labelledby={`${id}-volume`}
                    value={[Math.round(volume * 100)]}
                    onValueChange={(values) =>
                      updateGamePreferences({
                        volume: (Array.isArray(values) ? values[0] : values) / 100,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="flex min-h-11 items-center [&_[data-slot=slider-thumb]]:transition-none"
                  />
                  <output className="w-10 shrink-0 text-right text-xs tabular-nums">
                    {Math.round(volume * 100)}%
                  </output>
                </div>
              </div>
              <div className={rowClassName}>
                <Label
                  htmlFor={`${id}-mute`}
                  className="flex min-h-11 flex-1 cursor-pointer items-center font-medium"
                >
                  Mute card effects
                </Label>
                <div className="flex min-h-11 items-center pr-3">
                  <Switch
                    id={`${id}-mute`}
                    checked={muted}
                    onCheckedChange={(checked) => updateGamePreferences({ muted: checked })}
                    className="transition-none [&_[data-slot=switch-thumb]]:transition-none"
                  />
                </div>
              </div>
            </section>
            <Separator className="my-3" />
            <section aria-labelledby={`${id}-accessibility`}>
              <h2 id={`${id}-accessibility`} className={sectionClassName}>
                Accessibility
              </h2>
              <div className={rowClassName}>
                <div>
                  <Label id={`${id}-motion`} className="font-medium">
                    Motion
                  </Label>
                  <p id={`${id}-motion-description`} className="mt-1 text-xs text-muted-foreground">
                    Follow your device or reduce motion in Fall.
                  </p>
                </div>
                <Select
                  value={motion}
                  onValueChange={(value) => {
                    if (value === "system" || value === "reduced")
                      updateGamePreferences({ motion: value });
                  }}
                  items={{ system: "System", reduced: "Reduced" }}
                >
                  <SelectTrigger
                    aria-labelledby={`${id}-motion`}
                    aria-describedby={`${id}-motion-description`}
                    className="min-h-11 min-w-32 transition-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPanel>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="reduced">Reduced</SelectItem>
                  </SelectPanel>
                </Select>
              </div>
            </section>
            <Separator className="my-3" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ActionButton
                tone="quiet"
                onClick={() => {
                  resetGamePreferences();
                  setTheme("system");
                }}
              >
                Reset preferences
              </ActionButton>
              {import.meta.env.DEV && (
                <ActionButton
                  tone="quiet"
                  render={
                    <Link to={ANIMATION_PLAYGROUND_PATH} onClick={() => onOpenChange(false)} />
                  }
                >
                  <FlaskConical aria-hidden="true" />
                  Animation playground
                </ActionButton>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {credits ? (
          <ActionButton tone="quiet" onClick={() => setCredits(false)}>
            <ArrowLeft aria-hidden="true" />
            Back
          </ActionButton>
        ) : (
          <ActionButton tone="quiet" onClick={() => setCredits(true)}>
            Credits & licenses
          </ActionButton>
        )}
        <DialogClose render={<ActionButton tone="primary" />}>Done</DialogClose>
      </div>
    </ModalContent>
  );
}

export function HomeSettings({ open, onOpenChange }: HomeSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <SettingsContent onOpenChange={onOpenChange} />}
    </Dialog>
  );
}
