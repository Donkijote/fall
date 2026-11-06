import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOME_PATH } from "@/routes/Routes";

import { createHowlerAudio } from "../adapters/audio/howlerAudio";
import { createZustandLabState } from "../adapters/state/zustandLabState";
import { LabViewport } from "../adapters/three/LabViewport";
import { MotionContext } from "../adapters/three/MotionSettings";
import { lessonsByStudy, studies } from "../application/catalog";
import { createLab } from "../application/lab";
import type { CardDropEffect, Experiment, Study } from "../application/lab";

type Settings = {
  speed: number;
  ease: string;
  rate: number;
  dpr: number;
  perf: boolean;
  effect: CardDropEffect;
};
const defaults: Settings = {
  speed: 1,
  ease: "original",
  rate: 110,
  dpr: 2,
  perf: false,
  effect: "plain",
};

// State-driven effects can start in their target state before the next frame.
// Timelines start after their subscribers have attached to the new lab.
const stateDrivenExperiments = new Set<Experiment>([
  "drop-card",
  "shatter-card",
  "drop-hot-card",
  "drop-flame-card",
  "drop",
  "reset-table",
]);

// Reset the lab without replacing the viewport or its WebGL context.
function createPreview(
  audio: ReturnType<typeof createHowlerAudio>,
  revision: number,
  effect: CardDropEffect,
  experiment?: Experiment,
) {
  const state = createZustandLabState();
  // Dependent studies start from a settled dealt hand on every replay.
  if (
    experiment === "play-card" ||
    experiment === "fall-capture" ||
    experiment === "capture-card" ||
    experiment === "cascade-capture"
  ) {
    state.update((current) => ({ ...current, tableDeals: 1 }));
  }
  if (experiment === "capture-card" || experiment === "cascade-capture") {
    state.update((current) => ({
      ...current,
      centerDeals: 1,
      activeCaptureMode: experiment === "cascade-capture" ? "cascade" : "card",
    }));
  }
  const lab = createLab(state, audio);
  lab.setCaptureIntensity(effect);
  const immediate = experiment !== undefined && stateDrivenExperiments.has(experiment);
  if (immediate) lab.run(experiment);
  return { revision, experiment, autoplay: immediate ? undefined : experiment, lab };
}

export function AnimationPlayground() {
  const [audio] = useState(createHowlerAudio);
  const [study, setStudy] = useState<Study>("card");
  const [selected, setSelected] = useState<Experiment>("flip");
  const [settings, setSettings] = useState(defaults);
  const [preview, setPreview] = useState(() => createPreview(audio, 0, settings.effect));
  const { lab } = preview;
  const state = useSyncExternalStore(lab.subscribe, lab.getState);
  const lessons = lessonsByStudy[study];

  useEffect(() => () => audio.dispose(), [audio]);

  function updateSettings(patch: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...patch }));
    setPreview((current) =>
      createPreview(
        audio,
        current.revision + 1,
        patch.effect ?? settings.effect,
        current.experiment,
      ),
    );
  }

  function play() {
    setPreview((current) => createPreview(audio, current.revision + 1, settings.effect, selected));
  }

  return (
    <main className="h-dvh overflow-y-auto bg-background text-foreground">
      <div className="mx-auto max-w-[100rem] space-y-6 p-4 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              to={HOME_PATH}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to The Fall
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold sm:text-3xl">Animation playground</h1>
              <Badge variant="secondary">Development only</Badge>
            </div>
          </div>
        </header>
        <nav aria-label="Animation studies" className="flex flex-wrap gap-2">
          {studies.map((item) => (
            <Button
              key={item.value}
              variant={study === item.value ? "default" : "outline"}
              aria-pressed={study === item.value}
              onClick={() => {
                setStudy(item.value);
                setSelected(lessonsByStudy[item.value][0].experiment);
                setPreview((current) =>
                  createPreview(audio, current.revision + 1, settings.effect),
                );
              }}
            >
              {item.label}
              <Badge variant="secondary">{lessonsByStudy[item.value].length}</Badge>
            </Button>
          ))}
        </nav>
        <div className="grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)_18rem]">
          <Card>
            <CardHeader>
              <CardTitle>Animation catalog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {lessons.map((item) => (
                <Button
                  key={item.experiment}
                  variant={selected === item.experiment ? "secondary" : "ghost"}
                  aria-pressed={selected === item.experiment}
                  className="h-auto w-full justify-start py-3 text-left whitespace-normal"
                  onClick={() => setSelected(item.experiment)}
                >
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>
          <div className="min-w-0">
            <MotionContext value={settings}>
              <LabViewport
                revision={preview.revision}
                lab={lab}
                state={state}
                settings={settings}
                study={study}
                experiment={preview.autoplay}
                footerActions={
                  <>
                    <Button onClick={play}>
                      <Play /> Play / replay
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPreview((current) =>
                          createPreview(audio, current.revision + 1, settings.effect),
                        )
                      }
                    >
                      <RotateCcw /> Reset scene
                    </Button>
                  </>
                }
              />
            </MotionContext>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Live tuning</CardTitle>
              <p className="text-xs text-muted-foreground">Changes restart the current preview.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <NumericControl
                label="Timeline speed"
                value={settings.speed}
                min={0.25}
                max={2}
                step={0.25}
                change={(speed) => updateSettings({ speed })}
              />
              <Choice
                label="Motion easing"
                value={settings.ease}
                choices={[
                  ["original", "Original choreography"],
                  ["none", "Linear"],
                  ["power2.inOut", "Smooth"],
                  ["back.out", "Overshoot"],
                ]}
                change={(ease) => updateSettings({ ease })}
              />
              <p className="text-xs text-muted-foreground">
                Speed adjusts GSAP timelines. Easing adjusts flips, deck motion, deals and plays.
                Impact curves and physics keep their original motion.
              </p>
              {study === "card" && (
                <NumericControl
                  label="Embers per second"
                  value={settings.rate}
                  min={10}
                  max={350}
                  step={5}
                  change={(rate) => updateSettings({ rate })}
                />
              )}
              {study === "table" && selected === "fall-capture" && (
                <Choice
                  label="Capture impact"
                  value={settings.effect}
                  choices={[
                    ["plain", "Card drop"],
                    ["ice", "Ice shatter"],
                    ["heat", "Heat transfer"],
                    ["flame", "Flame impact"],
                  ]}
                  change={(effect) => updateSettings({ effect: effect as CardDropEffect })}
                />
              )}
              <NumericControl
                label="Pixel ratio cap"
                value={settings.dpr}
                min={1}
                max={3}
                step={0.25}
                change={(dpr) => updateSettings({ dpr })}
              />
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={settings.perf}
                  onCheckedChange={(perf) => updateSettings({ perf })}
                />{" "}
                Performance HUD
              </Label>
              <Button variant="outline" className="w-full" onClick={() => updateSettings(defaults)}>
                Restore defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function NumericControl({
  label,
  value,
  min,
  max,
  step,
  change,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  change: (value: number) => void;
}) {
  return (
    <Label className="grid gap-2">
      {label}
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const next = event.target.valueAsNumber;
          if (Number.isFinite(next) && next >= min && next <= max) change(next);
        }}
      />
    </Label>
  );
}

function Choice({
  label,
  value,
  choices,
  change,
}: {
  label: string;
  value: string;
  choices: string[][];
  change: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next) change(next);
        }}
      >
        <SelectTrigger aria-label={label} className="w-full">
          <SelectValue>{choices.find(([key]) => key === value)?.[1]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {choices.map(([key, text]) => (
            <SelectItem key={key} value={key}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
