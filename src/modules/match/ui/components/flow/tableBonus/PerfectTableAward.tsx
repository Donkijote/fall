import type { ScoreAward } from "@/domain/entities/GameState";

import { AwardPlaque } from "../awards/AwardPlaque";

export function PerfectTableAward({ award }: { award?: ScoreAward }) {
  if (award?.sourceCards?.length !== 4) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-[60%]">
        <AwardPlaque
          data-perfect-award
          title="Perfect table!"
          points={`+${award.amount}`}
          perfectEffects
          titleClassName="top-[30%]"
          badgeClassName="size-16 sm:size-20"
          className="w-[min(25rem,76cqw,82cqh)]"
        />
      </div>
    </div>
  );
}
