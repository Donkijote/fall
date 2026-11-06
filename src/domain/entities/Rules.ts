export type RuleCallout = { type: "info" | "tip" | "warning"; text: string };

export type RuleItem = {
  id: string;
  title: string;
  body: string;
  badges?: string[];
  examples?: string[];
  callouts?: RuleCallout[];
};

export type RuleSection = {
  id: string;
  title: string;
  items: RuleItem[];
};

export type RulesContent = {
  hero: { title: string; subtitle: string };
  sections: RuleSection[];
  modeQuotas: {
    duel: { quota: number; extraPointPerCard: number };
    ffa3: { quota: number; dealerQuota: number; extraPointPerCard: number };
    teams2v2: { quota: number; extraPointPerCard: number };
  };
  scoring: {
    fall: { base: string; ranks: Record<string, number> };
    cleanTable: { points: number; disabledWhen: string };
    goal: number;
  };
  singsRanking: Array<{
    name: string;
    pattern: string;
    points: string | number;
    optional?: boolean;
    mandatory?: boolean;
    notes?: string;
  }>;
  glossary: Array<{ term: string; def: string }>;
};
