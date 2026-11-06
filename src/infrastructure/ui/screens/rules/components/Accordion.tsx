import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { RuleItem } from "@/domain/entities/Rules";

import { Callout } from "./Callout";

type SectionAccordionProps = { items: RuleItem[] };

export const SectionAccordion = ({ items }: SectionAccordionProps) => {
  const allIds = useMemo(() => items.map((item) => item.id), [items]);
  const [open, setOpen] = useState<string[]>(allIds);
  const [previousIds, setPreviousIds] = useState(allIds);
  if (previousIds !== allIds) {
    setPreviousIds(allIds);
    setOpen(allIds);
  }

  return (
    <Accordion
      multiple
      value={open}
      onValueChange={setOpen}
      className="bg-card text-card-foreground"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger id={`acc-btn-${item.id}`} data-testid={`acc-btn-${item.id}`}>
            <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
              <span>{item.title}</span>
              <span className="flex flex-wrap gap-1">
                {item.badges?.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent id={`acc-${item.id}`}>
            <p className="leading-relaxed">{item.body}</p>
            {item.callouts?.length ? (
              <div className="mt-3 space-y-2">
                {item.callouts.map((callout, index) => (
                  <Callout key={callout.type + index} type={callout.type} text={callout.text} />
                ))}
              </div>
            ) : null}
            {item.examples?.length ? (
              <div className="mt-3">
                <div className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
                  Example
                </div>
                <ul className="list-disc space-y-1 pl-5">
                  {item.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
