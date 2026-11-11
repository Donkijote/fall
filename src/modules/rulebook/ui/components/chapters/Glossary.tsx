import { RULES } from "@/domain/constants/rules";
export function Glossary() {
  return (
    <dl className="space-y-4">
      {RULES.glossary.map((term, index) => (
        <div key={term.term}>
          <dt
            id={`rule-term-${index}`}
            tabIndex={-1}
            className="scroll-mt-6 font-semibold outline-none"
          >
            {term.term}
          </dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">{term.def}</dd>
        </div>
      ))}
    </dl>
  );
}
