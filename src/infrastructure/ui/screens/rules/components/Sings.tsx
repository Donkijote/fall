import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RulesContent } from "@/domain/entities/Rules";

type SingsGridProps = { content: RulesContent };

export const SingsGrid = ({ content }: SingsGridProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Sings ranking</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 md:grid-cols-2">
      {content.singsRanking.map((sing) => (
        <Card key={sing.name} size="sm">
          <CardHeader>
            <CardTitle>{sing.name}</CardTitle>
            <Badge variant="secondary">{sing.optional ? "Optional" : "Mandatory"}</Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-muted-foreground">Pattern: {sing.pattern}</p>
            <p>
              Points: <span className="font-medium">{sing.points}</span>
            </p>
            {sing.notes && <p className="text-xs text-muted-foreground">{sing.notes}</p>}
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);
