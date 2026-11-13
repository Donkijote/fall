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
        <h1 className="artwork-title text-[clamp(1.8rem,3.5vw,3.8rem)]">How to play</h1>
        <form
          role="search"
          className="relative w-full sm:w-64"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="find-rule" className="sr-only">
            Find a rule
          </label>
          <TextInput
            id="find-rule"
            type="search"
            placeholder="Find a rule"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            leadingIcon={<Search />}
          />
        </form>
      </div>
    </header>
  );
}
