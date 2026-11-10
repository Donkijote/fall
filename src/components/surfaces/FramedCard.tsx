import { cn } from "cn";
import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";

import { panelClassName } from "./surfaceStyles";

export function FramedCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card {...props} className={cn(panelClassName, className)} />;
}
