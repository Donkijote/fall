import { PointsBadge } from "@/components/cards/PointsBadge";
import type { ScoreAward } from "@/domain/entities/GameState";

export function PerfectTableAward({
  award,
  reducedMotion,
}: {
  award?: ScoreAward;
  reducedMotion: boolean;
}) {
  return award?.sourceCards?.length === 4 ? (
    <div
      data-perfect-award
      aria-hidden="true"
      className={
        reducedMotion
          ? "pointer-events-none grid justify-items-center gap-5 p-4 text-center opacity-0"
          : "pointer-events-none absolute inset-0 z-30 grid content-center justify-items-center gap-5 bg-background/90 p-4 text-center opacity-0"
      }
    >
      <h3 className="text-2xl text-primary sm:text-4xl">Perfect table!</h3>
      <div className="scale-[1.8]">
        <PointsBadge points={`+${award.amount}`} />
      </div>
      <p className="mt-2 text-sm">
        Dealer {award.player} · Side {award.side}
      </p>
    </div>
  ) : null;
}
