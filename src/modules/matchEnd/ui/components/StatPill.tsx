import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export const StatPill = ({ label, value }: { label: string; value?: ReactNode }) => (
  <Card size="sm">
    <CardContent className="text-center">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="text-base font-semibold">{value ?? "—"}</div>
    </CardContent>
  </Card>
);
