import { cn } from "cn";
import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";

export function TextInput({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("rounded-md transition-none", className)} />;
}
