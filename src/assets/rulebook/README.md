# Rulebook archive artwork

The approved [clean landscape master](../../../docs/design/how-to-play/background.png)
is the source for the default export. The [prompt manifest](../../../docs/design/how-to-play/prompts.json)
records the landscape master and export. The painting
contains no controls, labels or instructional card art.

| Runtime file             | Source dimensions | Export                         |
| ------------------------ | ----------------- | ------------------------------ |
| `archive-landscape.webp` | 1672 × 941        | Full approved landscape master |

Pillow exports preserve each master's dimensions with WebP quality 83, method 6,
matching the Card Hall approach. Runtime
code imports only the optimized landscape asset, not the PNG design masters.

`ArchiveBackground` uses the landscape export at every viewport size. Its decorative artwork remains outside the accessibility tree; the guide owns normal vertical scrolling.

Current runtime policy (#137): landscape backgrounds only. Portrait exports were removed on 2026-11-20; their original prompts, provider information and edits remain in `docs/artwork-provenance/retired-portrait-exports.json`. Historical export descriptions above do not describe current selection. No new artwork was generated.
