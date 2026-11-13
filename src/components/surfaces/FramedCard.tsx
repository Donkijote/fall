import { cn } from "cn";
import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";

import { brassPanelClassName } from "./surfaceStyles";
export function FramedCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card {...props} className={cn(brassPanelClassName, "relative", className)} />;
}
