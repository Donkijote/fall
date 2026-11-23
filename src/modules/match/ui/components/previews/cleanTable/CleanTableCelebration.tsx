import { PointsBadge } from "@/components/cards/PointsBadge";
import type { ScoreAward } from "@/domain/entities/GameState";

export function CleanTableCelebration({
  award,
  recipient,
}: {
  award?: ScoreAward;
  recipient: string;
}) {
  if (!award) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-x-0 top-[48%] h-[38cqh] -translate-y-1/2 overflow-hidden rounded-md">
        <span
          data-clean-sweep
          className="absolute inset-y-0 left-0 w-1/5 -skew-x-12 bg-linear-to-r from-transparent via-gold/55 to-transparent opacity-0 blur-sm"
        />
      </div>
      <div className="absolute top-[48%] left-1/2 -translate-1/2">
        <div data-clean-award className="relative grid justify-items-center opacity-0">
          <h3 className="absolute bottom-full mb-3 text-xl whitespace-nowrap text-primary sm:text-2xl">
            Clean table!
          </h3>
          <PointsBadge points={`+${award.amount}`} className="size-16" />
          <span
            data-clean-glint
            className="absolute top-1 -left-4 size-2 rotate-45 bg-gold opacity-0"
          />
          <span
            data-clean-glint
            className="absolute right-[-1rem] bottom-2 size-1.5 rotate-45 bg-gold opacity-0"
          />
          <p className="absolute top-full mt-3 text-xs whitespace-nowrap text-muted-foreground">
            {recipient}
          </p>
        </div>
      </div>
    </div>
  );
}
