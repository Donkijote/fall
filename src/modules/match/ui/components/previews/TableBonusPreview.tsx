import { useState } from "react";

import { ActionButton } from "@/components";

import { TableBonusControls, type TableBonusSettings } from "./TableBonusControls";
import { TableBonusTable } from "./TableBonusTable";

export function TableBonusPreview() {
  const [settings, setSettings] = useState<TableBonusSettings>({
    mode: "1vs1",
    pattern: "inc",
    order: "playersThenTable",
    example: "perfect",
    dealer: 0,
  });
  const [run, setRun] = useState({ revision: 0, playing: false });
  const [speed, setSpeed] = useState("1");
  function update(patch: Partial<TableBonusSettings>) {
    setSettings((current) => ({ ...current, ...(patch.mode ? { dealer: 0 } : {}), ...patch }));
    setRun((current) => ({ revision: current.revision + 1, playing: false }));
  }
  return (
    <div className="grid gap-4">
      <TableBonusControls
        settings={settings}
        update={update}
        speed={speed}
        changeSpeed={(value) => {
          setSpeed(value);
          setRun((current) => ({ revision: current.revision + 1, playing: current.playing }));
        }}
      />
      <TableBonusTable
        key={run.revision}
        settings={settings}
        playing={run.playing}
        speed={Number(speed)}
      />
      <div className="flex flex-wrap gap-2">
        <ActionButton
          onClick={() => setRun((current) => ({ revision: current.revision + 1, playing: true }))}
        >
          Play / replay
        </ActionButton>
        <ActionButton
          tone="outline"
          onClick={() => setRun((current) => ({ revision: current.revision + 1, playing: false }))}
        >
          Reset scene
        </ActionButton>
      </div>
    </div>
  );
}
