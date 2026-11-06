import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RulesContent } from "@/domain/entities/Rules";

type QuickRefProps = { content: RulesContent };

export const QuickRef = ({ content }: QuickRefProps) => {
  const { ranks } = content.scoring.fall;
  return (
    <Card className="sticky top-8 hidden h-fit xl:flex">
      <CardHeader>
        <CardTitle>Quick Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="font-medium">Goal</div>
          <div>First to {content.scoring.goal} points</div>
        </div>
        <Separator className="my-3" />
        <div>
          <div className="mb-1 font-medium">Fall points</div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {Object.entries(ranks).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-muted-foreground">Rank {k}</span>
                <span className="font-medium">+{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-3" />
        <div className="text-sm">
          <div className="mb-1 font-medium">Clean Table</div>
          <div>+{content.scoring.cleanTable.points} (disabled in last round)</div>
        </div>
        <Separator className="my-3" />
        <div className="text-sm">
          <div className="mb-1 font-medium">Round quotas</div>
          <ul className="space-y-1">
            <li>
              1v1: {content.modeQuotas.duel.quota}{" "}
              <span className="text-muted-foreground">
                (extras +{content.modeQuotas.duel.extraPointPerCard})
              </span>
            </li>
            <li>
              1v1v1: {content.modeQuotas.ffa3.quota}{" "}
              <span className="text-muted-foreground">
                (dealer {content.modeQuotas.ffa3.dealerQuota})
              </span>
            </li>
            <li>
              2v2: {content.modeQuotas.teams2v2.quota}{" "}
              <span className="text-muted-foreground">
                (extras +{content.modeQuotas.teams2v2.extraPointPerCard})
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
