# How to Play: Rulebook

## Supported layout — #137 (2026-11-20)

The archive uses only `archive-landscape.webp`; portrait phone/tablet exports are retired. Reading content still scrolls normally. Smaller landscape layouts use unprefixed Tailwind utilities; larger layouts use standard width breakpoints. No orientation lock or rotate-device gate is implemented here; enforcement and native integration belong to #140. Earlier viewport reviews below describe historical implementations, not current portrait support.

Retired export prompts and generation evidence are preserved in [the provenance ledger](../../artwork-provenance/retired-portrait-exports.json).

The approved [simplified mockup](mockup-simplified.png) guides the live
`/rules` route. The [detailed mockup](mockup-detailed.png) adds ornament
to the same layout. The [clean archive master](background.png) establishes a
quiet stone and oak room with recessed shelves, a writing desk and warm lamps.
The [prompt manifest](prompts.json) preserves the generation and final edit
instructions, including the edits that removed the subtitle.

The guide opens as its own page in the archive. The title and search sit above
the reading surface, with open chapter navigation beside it. Only the article
has an opaque frame. On compact screens, the chapter rail becomes a disclosure.
Back to Hall is a route action, and Previous and Next belong to the article.
Use live text and examples over the artwork so the content can reflow and
retain contrast in both themes.

The [rulebook module](../../../src/modules/rulebook/README.md) documents behavior
and verification. Its [content audit](../../../src/modules/rulebook/content-plan.md)
maps the guide back to the rules and tracks engine discrepancies separately.
See the [runtime artwork inventory](../../../src/assets/rulebook/README.md)
for the landscape export; retired export evidence is in the provenance ledger.

The contents menu uses an illustrated leather bookmark tab with a bronze rail
and an oak engraving. Hover and keyboard focus reveal the tab, and the active
chapter keeps it visible. Sings use the shared declaration and points badges
alongside larger card examples on the same parchment as the Sings reference.

Rule callouts use a shared blackened leather panel with bronze trim and
separate glyphs for notes, tips, and warnings. The component gallery shows all
three states, including a wrapping example.

## Shared artwork finishing pass

Quick-start numbers use brass medallions from the
[capture-count artwork](../tavern-match/README.md). Illustration arrows reuse
BronzeArrow. Fall-rank panels and the quota table reuse the
[Sings parchment](../sings-reference/README.md), with faded artwork rules in the
semantic table. Rule-search rows now share the chapter bookmark treatment through
GuideLink. Live text, table semantics, source rules, and search behavior are retained.
