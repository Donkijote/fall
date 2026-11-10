import { cn } from "cn";
import type { ComponentProps } from "react";

import { SelectTrigger as PrimitiveTrigger } from "@/components/ui/select";

export function SelectTrigger({ className, ...props }: ComponentProps<typeof PrimitiveTrigger>) {
  return <PrimitiveTrigger {...props} className={cn("rounded-md transition-none", className)} />;
}
