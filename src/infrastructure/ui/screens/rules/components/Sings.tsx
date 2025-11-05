import type { RulesContent } from "@/domain/entities/Rules";
import { Pill } from "@/infrastructure/ui/screens/rules/components/Pill";

type SingsGridProps = { content: RulesContent };

export const SingsGrid = ({ content }: SingsGridProps) => (
  <div className="rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-sm border">
    <div className="text-base font-medium text-text-primary mb-2">
      Sings ranking
    </div>
    <div className="md:grid-cols-2 xl:grid-cols-3 gap-3 grid grid-cols-1">
      {content.singsRanking.map((s) => (
        <div
          key={s.name}
          className="rounded-xl border-white/10 bg-white/10 backdrop-blur p-3 border"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-text-primary">{s.name}</div>
            <Pill>{s.optional ? "Optional" : "Mandatory"}</Pill>
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Pattern: {s.pattern}
          </div>
          <div className="text-sm mt-1 text-text-primary">
            Points: <span className="font-medium">{s.points}</span>
          </div>
          {s.notes ? (
            <div className="text-xs text-text-secondary mt-1">{s.notes}</div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);
