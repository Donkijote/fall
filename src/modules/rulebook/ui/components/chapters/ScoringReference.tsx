import { RULES } from "@/domain/constants/rules";

import { fallRankValues } from "../../../application/rulebookContent";

export function ScoringReference() {
  return (
    <section aria-labelledby="rule-fall-points">
      <h3
        id="rule-fall-points"
        tabIndex={-1}
        className="scroll-mt-6 text-lg font-semibold outline-none"
      >
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
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="mb-3 text-left font-semibold">Captured-card quotas</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4">
                Format
              </th>
              <th scope="col" className="py-2">
                Quota
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1v1", RULES.modeQuotas.duel.quota],
              [
                "Three players",
                `${RULES.modeQuotas.ffa3.quota} per player; ${RULES.modeQuotas.ffa3.dealerQuota} for the dealer`,
              ],
              ["2v2", `${RULES.modeQuotas.teams2v2.quota} per team`],
            ].map(([label, quota]) => (
              <tr key={label} className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-medium">
                  {label}
                </th>
                <td className="py-3">{quota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
