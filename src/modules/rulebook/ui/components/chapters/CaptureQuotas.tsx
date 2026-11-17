import fadedRule from "@/assets/ui/dividers/faded-rule.webp";
import { ParchmentArtwork } from "@/components/surfaces/ParchmentArtwork";
import { RULES } from "@/domain/constants/rules";

export function CaptureQuotas() {
  return (
    <div className="relative isolate mt-5 overflow-x-auto p-5 text-artwork-shadow sm:p-6">
      <ParchmentArtwork />
      <table className="w-full text-left text-sm">
        <caption className="mb-3 text-left title-type text-base">Captured-card quotas</caption>
        <thead>
          <tr
            className="bg-[length:100%_2px] bg-bottom bg-no-repeat"
            style={{ backgroundImage: `url(${fadedRule})` }}
          >
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
            <tr
              key={label}
              className="bg-[length:100%_2px] bg-bottom bg-no-repeat"
              style={{ backgroundImage: `url(${fadedRule})` }}
            >
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
