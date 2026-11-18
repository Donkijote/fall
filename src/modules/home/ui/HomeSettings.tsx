import { FlaskConical, LayoutGrid, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef } from "react";
import { Link, useLocation } from "react-router";

import { ActionButton, BronzeArrow, ChoiceButton, ModalContent, SelectField } from "@/components";
import { BronzeSlider } from "@/components/controls/BronzeSlider";
import { WaxSwitch } from "@/components/controls/WaxSwitch";
import { MotionDialog as Dialog } from "@/components/surfaces/PopupMotion";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  resetGamePreferences,
  updateGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";
import { useGamePreferences } from "@/infrastructure/ui/hooks/useGamePreferences";
import { ANIMATION_PLAYGROUND_PATH, COMPONENT_GALLERY_PATH, CREDITS_PATH } from "@/routes/Routes";

type HomeSettingsProps = { open: boolean; onOpenChange: (open: boolean) => void };

const appearances = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];
const rowClassName = "flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3";
const sectionClassName = "text-base";

function SettingsContent({ open, onOpenChange }: HomeSettingsProps) {
  const { theme, setTheme } = useTheme();
  const { volume, muted, motion } = useGamePreferences();
  const id = useId();
  const location = useLocation();
  const creditsLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (open && location.state?.focusCredits) {
      const frame = requestAnimationFrame(() => creditsLink.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [open, location.key, location.state]);

  return (
    <ModalContent className="home-settings max-h-[calc(100dvh-var(--safe-area-top)-var(--safe-area-bottom)-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 overflow-hidden sm:max-w-xl">
      <DialogHeader className="min-h-11 justify-center pr-12">
        <DialogTitle className="text-2xl font-normal">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Appearance, audio, and accessibility preferences.
        </DialogDescription>
      </DialogHeader>
      <div className="min-h-0 [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden">
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
                  <ChoiceButton iconOnly key={value} value={value} aria-label={label} title={label}>
                    <Icon aria-hidden="true" className="size-5" />
                  </ChoiceButton>
                ))}
              </ToggleGroup>
            </div>
          </section>
          <BronzeArrow tone="faded" className="my-3 h-0.5 w-full" />
          <section aria-labelledby={`${id}-audio`}>
            <h2 id={`${id}-audio`} className={sectionClassName}>
              Audio
            </h2>
            <div className={rowClassName}>
              <Label id={`${id}-volume`} className="font-medium">
                Card effects volume
              </Label>
              <div className="flex w-52 max-w-full items-center gap-3">
                <BronzeSlider
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
                <WaxSwitch
                  id={`${id}-mute`}
                  checked={muted}
                  onCheckedChange={(checked) => updateGamePreferences({ muted: checked })}
                />
              </div>
            </div>
          </section>
          <BronzeArrow tone="faded" className="my-3 h-0.5 w-full" />
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
              <SelectField
                value={motion}
                onValueChange={(value) => {
                  if (value === "system" || value === "reduced")
                    updateGamePreferences({ motion: value });
                }}
                options={[
                  { value: "system", label: "System" },
                  { value: "reduced", label: "Reduced" },
                ]}
                triggerProps={{
                  "aria-labelledby": `${id}-motion`,
                  "aria-describedby": `${id}-motion-description`,
                  className: "min-h-11 min-w-32",
                }}
              />
            </div>
          </section>
          <BronzeArrow tone="faded" className="my-3 h-0.5 w-full" />
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
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  tone="quiet"
                  nativeButton={false}
                  role="link"
                  render={
                    <Link to={ANIMATION_PLAYGROUND_PATH} onClick={() => onOpenChange(false)} />
                  }
                >
                  <FlaskConical aria-hidden="true" />
                  Animation playground
                </ActionButton>
                <ActionButton
                  tone="quiet"
                  nativeButton={false}
                  role="link"
                  render={<Link to={COMPONENT_GALLERY_PATH} onClick={() => onOpenChange(false)} />}
                >
                  <LayoutGrid aria-hidden="true" />
                  Component gallery
                </ActionButton>
              </div>
            )}
          </div>
        </>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ActionButton
          tone="quiet"
          nativeButton={false}
          render={<Link ref={creditsLink} to={CREDITS_PATH} onClick={() => onOpenChange(false)} />}
          role="link"
        >
          Credits & licenses
        </ActionButton>
        <DialogClose render={<ActionButton tone="primary" />}>Done</DialogClose>
      </div>
    </ModalContent>
  );
}

export function HomeSettings({ open, onOpenChange }: HomeSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SettingsContent open={open} onOpenChange={onOpenChange} />
    </Dialog>
  );
}
