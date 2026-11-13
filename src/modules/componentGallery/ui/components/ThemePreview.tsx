import { FramedCard } from "@/components";

const colors = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["artwork-shadow", "artwork-foreground"],
];

const standaloneColors = ["border", "input", "ring", "destructive", "gold"];

export function ThemePreview() {
  return (
    <section className="grid gap-4" aria-labelledby="gallery-theme">
      <h2 id="gallery-theme" className="text-2xl">
        Theme
      </h2>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FramedCard className="gap-4 p-4">
          <h3 className="text-lg">Semantic colors</h3>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,9rem),1fr))] gap-2">
            {colors.map(([background, foreground]) => (
              <li
                key={background}
                className="grid content-center gap-1 rounded-md border border-border p-2 font-mono text-xs break-all"
                style={{ backgroundColor: `var(--${background})`, color: `var(--${foreground})` }}
              >
                <span>--{background}</span>
                <span>--{foreground}</span>
              </li>
            ))}
            {standaloneColors.map((color) => (
              <li
                key={color}
                className="flex items-center gap-2 rounded-md border border-border p-2 font-mono text-xs"
              >
                <span
                  aria-hidden="true"
                  className="size-5 shrink-0 rounded-sm border border-border"
                  style={{ backgroundColor: `var(--${color})` }}
                />
                --{color}
              </li>
            ))}
          </ul>
        </FramedCard>
        <FramedCard className="gap-4 p-4">
          <h3 className="text-lg">Type and radius</h3>
          <p className="title-type text-2xl">Tavern match</p>
          <p>Choose a format before taking a seat.</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-sm border border-gold p-2 font-mono text-xs">sm</span>
            <span className="rounded-md border border-gold p-2 font-mono text-xs">md</span>
            <span className="rounded-lg border border-gold p-2 font-mono text-xs">lg</span>
            <span className="rounded-xl border border-gold p-2 font-mono text-xs">xl</span>
          </div>
          <code className="text-xs text-muted-foreground">src/index.css</code>
        </FramedCard>
      </div>
    </section>
  );
}
