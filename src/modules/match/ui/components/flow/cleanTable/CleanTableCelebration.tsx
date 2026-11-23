import plaque from "@/assets/lobby/tavern-match/clean-table-plaque.webp";
import { PointsBadge } from "@/components/cards/PointsBadge";
import type { ScoreAward } from "@/domain/entities/GameState";

export function CleanTableArtworkPreload() {
  return <link rel="preload" as="image" href={plaque} />;
}

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
        <div
          data-clean-award
          className="relative isolate aspect-[3/2] w-[min(22rem,70cqw,78cqh)] opacity-0"
        >
          <img
            src={plaque}
            alt=""
            loading="eager"
            decoding="async"
            className="pointer-events-none absolute inset-0 -z-10 size-full object-contain"
          />
          <h3 className="absolute top-[33%] left-1/2 -translate-1/2 artwork-title text-xl whitespace-nowrap sm:text-2xl">
            Clean table!
          </h3>
          <div className="absolute top-[60%] left-1/2 -translate-1/2">
            <PointsBadge points={`+${award.amount}`} className="size-14 sm:size-16" />
            <span
              data-clean-glint
              className="absolute top-1/2 -left-5 size-2.5 -translate-y-1/2 bg-gold opacity-0 shadow-[0_0_12px_var(--gold)]"
            >
              <span className="absolute inset-[2px] bg-artwork-foreground/90" />
            </span>
            <span
              data-clean-glint
              className="absolute top-1/2 -right-5 size-2.5 -translate-y-1/2 bg-gold opacity-0 shadow-[0_0_12px_var(--gold)]"
            >
              <span className="absolute inset-[2px] bg-artwork-foreground/90" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
