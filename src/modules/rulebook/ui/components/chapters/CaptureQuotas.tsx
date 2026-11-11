import { RULES } from "@/domain/constants/rules";

export function CaptureQuotas() {
  return (
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
  );
}
