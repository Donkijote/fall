import { Equal, Layers, Minus, Plus, Trophy } from "lucide-react";

import { ParchmentFigure } from "@/components/surfaces/ParchmentFigure";

import { scoringExample } from "../../../application/rulebookExamples";
import { CaptureQuotas } from "./CaptureQuotas";

const equation =
  "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:gap-4";

function Quantity({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-heading text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs sm:text-sm">{label}</p>
    </div>
  );
}

export function scoringIllustrations() {
  const { captured, quota, earned, goal, startingScore } = scoringExample;
  return {
    quotas: (
      <>
        <CaptureQuotas />
        <div className="mt-4">
          <ParchmentFigure
            title="Count the extras"
            caption={`In a duel, ${captured} captured cards are ${captured - quota} over the ${quota}-card quota. That earns ${earned} points.`}
          >
            <Layers aria-hidden="true" className="mx-auto mb-4 size-7" />
            <div className={equation} aria-hidden="true">
              <Quantity value={captured} label="Cards captured" />
              <Minus className="size-4" />
              <Quantity value={quota} label="Card quota" />
              <Equal className="size-4" />
              <Quantity value={earned} label="Points earned" />
            </div>
          </ParchmentFigure>
        </div>
      </>
    ),
    end: (
      <ParchmentFigure
        title="Reach the winning score"
        caption={`If you had ${startingScore} points before counting, the ${earned} points from the example bring you to ${goal}. You win the match.`}
      >
        <Trophy aria-hidden="true" className="mx-auto mb-4 size-7" />
        <div className={equation} aria-hidden="true">
          <Quantity value={startingScore} label="Starting score" />
          <Plus className="size-4" />
          <Quantity value={earned} label="Points earned" />
          <Equal className="size-4" />
          <Quantity value={goal} label="Winning score" />
        </div>
      </ParchmentFigure>
    ),
  };
}
