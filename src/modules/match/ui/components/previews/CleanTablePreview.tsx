import { useState } from "react";

import { ActionButton } from "@/components";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import type { CleanTableSettings } from "../../../application/cleanTablePreview";
import { CleanTableControls } from "./cleanTable/CleanTableControls";
import { CleanTableStage } from "./cleanTable/CleanTableStage";

export function CleanTablePreview() {
  const preferredReducedMotion = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  const [settings, setSettings] = useState<CleanTableSettings>({
    mode: "1vs1",
    example: "capture",
    player: 0,
  });
  const [run, setRun] = useState({ revision: 0, playing: false });
  function reset(playing = false) {
    setRun((current) => ({ revision: current.revision + 1, playing }));
  }
  return (
    <div className="grid gap-4">
      <CleanTableControls
        settings={settings}
        update={(patch) => {
          setSettings((current) => ({ ...current, ...patch }));
          reset();
        }}
        reduced={reduced || preferredReducedMotion}
        setReduced={(value) => {
          setReduced(value);
          reset();
        }}
      />
      <CleanTableStage
        key={run.revision}
        settings={settings}
        playing={run.playing}
        reducedMotion={reduced || preferredReducedMotion}
      />
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={() => reset(true)}>Play / replay</ActionButton>
        <ActionButton tone="outline" onClick={() => reset()}>
          Reset scene
        </ActionButton>
      </div>
    </div>
  );
}
