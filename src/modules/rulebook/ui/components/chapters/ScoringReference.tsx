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
          <div key={rank} className="rounded-md bg-muted p-3">
            <dt className="text-sm text-muted-foreground">Rank {rank}</dt>
            <dd className="mt-1 w-fit rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">
              +{points}
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
