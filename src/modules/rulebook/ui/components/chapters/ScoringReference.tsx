import { PointsBadge } from "@/components/cards/PointsBadge";
import { ParchmentArtwork } from "@/components/surfaces/ParchmentArtwork";
import { RULES } from "@/domain/constants/rules";

import { fallRankValues } from "../../../application/rulebookContent";

export function ScoringReference() {
  return (
    <section aria-labelledby="rule-fall-points">
      <h3 id="rule-fall-points" tabIndex={-1} className="scroll-mt-6 text-lg outline-none">
        Fall points by rank
      </h3>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {fallRankValues.map(([rank, points]) => (
          <div
            key={rank}
            className="relative isolate grid justify-items-center gap-2 p-4 text-artwork-shadow"
          >
            <ParchmentArtwork />
            <dt className="title-type text-sm">Rank {rank}</dt>
            <dd>
              <PointsBadge
                points={`+${points}`}
                label={`${points} points`}
                className="size-13 @2xl:size-13"
              />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 leading-relaxed">
        Clear the table with a capture to earn {RULES.scoring.cleanTable.points} points. The bonus
        does not apply once the deck is empty.
      </p>
    </section>
  );
}
