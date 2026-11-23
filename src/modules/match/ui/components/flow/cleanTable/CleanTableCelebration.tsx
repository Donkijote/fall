import type { ScoreAward } from "@/domain/entities/GameState";

import { AwardPlaque } from "../awards/AwardPlaque";

export function CleanTableCelebration({ award }: { award?: ScoreAward }) {
  if (!award) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-x-0 top-[48%] h-[38cqh] -translate-y-1/2 overflow-hidden rounded-md">
        <span
          data-clean-sweep
          className="absolute inset-y-0 left-0 w-1/5 -skew-x-12 bg-linear-to-r from-transparent via-gold/55 to-transparent opacity-0 blur-sm"
        />
      </div>
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-[60%]">
        <AwardPlaque
          data-clean-award
          title="Clean table!"
          points={`+${award.amount}`}
          glintKind="clean"
        />
      </div>
    </div>
  );
}
