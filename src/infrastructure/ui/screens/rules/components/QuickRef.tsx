import type { RulesContent } from "@/domain/entities/Rules";

type QuickRefProps = { content: RulesContent };

export const QuickRef = ({ content }: QuickRefProps) => {
  const { ranks } = content.scoring.fall;
  return (
    <div className="xl:block top-20 rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-lg sticky hidden h-fit border">
      <div className="text-base font-medium text-text-primary mb-2">
        Quick Reference
      </div>
      <div className="mb-3 text-text-primary">
        <div className="font-medium">Goal</div>
        <div>First to {content.scoring.goal} points</div>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-text-primary">
        <div className="font-medium mb-1">Fall points</div>
        <ul className="gap-x-4 gap-y-1 text-sm grid grid-cols-2">
          {Object.entries(ranks).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="text-text-secondary">Rank {k}</span>
              <span className="font-medium">+{v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-sm text-text-primary">
        <div className="font-medium mb-1">Clean Table</div>
        <div>+{content.scoring.cleanTable.points} (disabled in last round)</div>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-sm text-text-primary">
        <div className="font-medium mb-1">Round quotas</div>
        <ul className="space-y-1">
          <li>
            1v1: {content.modeQuotas.duel.quota}{" "}
            <span className="text-text-secondary">
              (extras +{content.modeQuotas.duel.extraPointPerCard})
            </span>
          </li>
          <li>
            1v1v1: {content.modeQuotas.ffa3.quota}{" "}
            <span className="text-text-secondary">
              (dealer {content.modeQuotas.ffa3.dealerQuota})
            </span>
          </li>
          <li>
            2v2: {content.modeQuotas.teams2v2.quota}{" "}
            <span className="text-text-secondary">
              (extras +{content.modeQuotas.teams2v2.extraPointPerCard})
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
