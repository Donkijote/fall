import { Info, Lightbulb, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

type CalloutProps = { type: "info" | "tip" | "warning"; text: string };

const icons = { info: Info, tip: Lightbulb, warning: TriangleAlert };

export const Callout = ({ type, text }: CalloutProps) => {
  const Icon = icons[type];
  return (
    <Alert role="note" variant={type === "warning" ? "destructive" : "default"}>
      <Icon />
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
};
