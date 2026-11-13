import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link } from "react-router";

import { ActionButton, ChoiceButton, FramedCard, SelectField, TextInput } from "@/components";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { HOME_PATH } from "@/routes/Routes";

import { gallerySections } from "./components/galleryEntries";
import { ThemePreview } from "./components/ThemePreview";

const allCategories = "All categories";
const categories = [allCategories, ...gallerySections.map(({ title }) => title)];

export function ComponentGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allCategories);
  const { theme, setTheme } = useTheme();
  const search = query.trim().toLowerCase();
  const sections = gallerySections
    .filter(({ title }) => category === allCategories || category === title)
    .map((section) => ({
      ...section,
      entries: section.entries.filter(({ name, searchTerms = [] }) =>
        [name, ...searchTerms].some((term) => term.toLowerCase().includes(search)),
      ),
    }))
    .filter(({ entries }) => entries.length > 0);

  return (
    <main className="h-dvh overflow-y-auto bg-background px-4 py-6 text-foreground sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="grid gap-3">
          <ActionButton
            nativeButton={false}
            role="link"
            render={<Link to={HOME_PATH} />}
            className="justify-self-start"
          >
            <ArrowLeft aria-hidden="true" /> Hall
          </ActionButton>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl">Component gallery</h1>
            <ToggleGroup
              aria-label="App theme"
              value={theme ? [theme] : []}
              onValueChange={([value]) => {
                if (value) setTheme(value);
              }}
              className="flex gap-2"
            >
              <ChoiceButton value="light">Light</ChoiceButton>
              <ChoiceButton value="dark">Dark</ChoiceButton>
              <ChoiceButton value="system">System</ChoiceButton>
            </ToggleGroup>
          </div>
        </header>
        <ThemePreview />
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid w-full gap-1 text-sm sm:max-w-xs">
            Find a component
            <TextInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
            />
          </label>
          <SelectField
            options={categories.map((title) => ({ label: title, value: title }))}
            value={category}
            onValueChange={(value) => setCategory(value ?? allCategories)}
            triggerProps={{ "aria-label": "Category" }}
          />
        </div>
        {sections.length === 0 && (
          <p role="status" className="text-muted-foreground">
            No components match your search.
          </p>
        )}
        {sections.map(({ title, folder, entries }) => (
          <section key={folder} className="grid gap-4" aria-labelledby={`gallery-${folder}`}>
            <h2 id={`gallery-${folder}`} className="text-2xl">
              {title}
            </h2>
            <div
              className={
                folder === "match"
                  ? "grid grid-cols-1 gap-4 lg:grid-cols-2"
                  : "grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4"
              }
            >
              {entries.map(({ name, variants, usage, source, Preview }) => (
                <FramedCard key={name} className="min-w-0 gap-4 p-4">
                  <h3 className="text-lg">{name}</h3>
                  <Preview />
                  <dl className="grid gap-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Variants and states</dt>
                      <dd>{variants}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Used in</dt>
                      <dd>{usage}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Source</dt>
                      <dd>
                        <code className="text-xs break-all">
                          {source ?? `src/components/${folder}/${name}.tsx`}
                        </code>
                      </dd>
                    </div>
                  </dl>
                </FramedCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
