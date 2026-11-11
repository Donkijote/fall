import type { RuleItem } from "@/domain/entities/Rules";
export function RuleSections({ items }: { items: RuleItem[] }) {
  return (
    <>
      {items.map((item) => (
        <section key={item.id} aria-labelledby={`rule-${item.id}`} className="max-w-[75ch]">
          <h3
            id={`rule-${item.id}`}
            tabIndex={-1}
            className="scroll-mt-6 text-lg font-semibold outline-none"
          >
            {item.title}
          </h3>
          <p className="mt-2 leading-relaxed whitespace-pre-line">{item.body}</p>
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
        </section>
      ))}
    </>
  );
}
