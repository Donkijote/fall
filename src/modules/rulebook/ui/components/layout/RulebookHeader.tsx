import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { TextInput } from "@/components";

export function RulebookHeader({
  query,
  onQueryChange,
  backLink,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  backLink: ReactNode;
}) {
  return (
    <header className="space-y-4 lg:col-start-2 lg:pb-2">
      <div className="lg:hidden">{backLink}</div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-[clamp(1.8rem,3.5vw,3.8rem)] leading-tight font-bold text-artwork-foreground uppercase [text-shadow:0_2px_5px_var(--artwork-shadow)]">
          How to play
        </h1>
        <form
          role="search"
          className="relative w-full sm:w-64"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="find-rule" className="sr-only">
            Find a rule
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground"
          />
          <TextInput
            id="find-rule"
            type="search"
            placeholder="Find a rule"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="min-h-11 border-gold/70 bg-background pl-10 text-foreground"
          />
        </form>
      </div>
    </header>
  );
}
