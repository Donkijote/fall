import type { RulesContent } from "@/domain/entities/Rules";
import { Pill } from "@/infrastructure/ui/screens/rules/components/Pill";

type SingsGridProps = { content: RulesContent };

export const SingsGrid = ({ content }: SingsGridProps) => (
  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
    <div className="mb-2 text-base font-medium text-text-primary">
      Sings ranking
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {content.singsRanking.map((s) => (
        <div
          key={s.name}
          className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-text-primary">{s.name}</div>
            <Pill>{s.optional ? "Optional" : "Mandatory"}</Pill>
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            Pattern: {s.pattern}
          </div>
          <div className="mt-1 text-sm text-text-primary">
            Points: <span className="font-medium">{s.points}</span>
          </div>
          {s.notes ? (
            <div className="mt-1 text-xs text-text-secondary">{s.notes}</div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);
