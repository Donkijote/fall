import { cn } from "cn";
import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";

import "./FramedCard.css";

export function FramedCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      {...props}
      className={cn(
        "framed-card relative isolate rounded-md border-2 border-transparent bg-transparent shadow-none ring-0 dark:ring-0",
        className,
      )}
    />
  );
}
