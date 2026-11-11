import type { ReactNode } from "react";

import type { RuleItem } from "@/domain/entities/Rules";
export function RuleSections({
  items,
  illustrations,
}: {
  items: RuleItem[];
  illustrations?: Record<string, ReactNode>;
}) {
  return (
    <>
      {items.map((item) => (
        <section key={item.id} aria-labelledby={`rule-${item.id}`}>
          <h3 id={`rule-${item.id}`} tabIndex={-1} className="scroll-mt-6 text-lg outline-none">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[75ch] leading-relaxed whitespace-pre-line">{item.body}</p>
          {item.callouts?.map((callout) => (
            <p
              key={callout.text}
              role="note"
              className="mt-3 rounded-md border-l-2 border-gold bg-muted p-3 text-sm leading-relaxed text-muted-foreground"
            >
              {callout.text}
            </p>
          ))}
          {item.examples?.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {item.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          ) : null}
          {illustrations?.[item.id] && <div className="mt-4">{illustrations[item.id]}</div>}
        </section>
      ))}
    </>
  );
}
