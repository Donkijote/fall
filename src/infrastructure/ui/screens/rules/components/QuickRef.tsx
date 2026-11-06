import { motion } from "framer-motion";

import type { RulesContent } from "@/domain/entities/Rules";

type QuickRefProps = { content: RulesContent };

export const QuickRef = ({ content }: QuickRefProps) => {
  const { ranks } = content.scoring.fall;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-20 hidden h-fit rounded-2xl border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur xl:block"
    >
      <div className="mb-2 text-base font-medium text-text-primary">Quick Reference</div>
      <div className="mb-3 text-text-primary">
        <div className="font-medium">Goal</div>
        <div>First to {content.scoring.goal} points</div>
      </div>
      <div className="my-3 h-px bg-white/20" />
      <div className="text-text-primary">
        <div className="mb-1 font-medium">Fall points</div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {Object.entries(ranks).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="text-text-secondary">Rank {k}</span>
              <span className="font-medium">+{v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-3 h-px bg-white/20" />
      <div className="text-sm text-text-primary">
        <div className="mb-1 font-medium">Clean Table</div>
        <div>+{content.scoring.cleanTable.points} (disabled in last round)</div>
      </div>
      <div className="my-3 h-px bg-white/20" />
      <div className="text-sm text-text-primary">
        <div className="mb-1 font-medium">Round quotas</div>
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
    </motion.div>
  );
};
