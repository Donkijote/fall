# Sings sorting table artwork

The [default scene master](../../../docs/design/sings-reference/background.png)
and [iteration prompts](../../../docs/design/sings-reference/prompts.json) live
with the design. The app selects the first matching WebP in this order:

| Export                   | Viewport                          |
| ------------------------ | --------------------------------- |
| `phone-landscape.webp`   | Viewport below 1024px wide        |
| `tablet-landscape.webp`  | Remaining aspect ratios up to 3/2 |
| `desktop-landscape.webp` | Default                           |

Each export reframes the same sorting table. `SortingTableBackground` displays
it as decorative, full-viewport artwork behind the live gallery.

Current runtime policy (#137): landscape backgrounds only. Portrait exports were removed on 2026-11-20; their original prompts, provider information and edits remain in `docs/artwork-provenance/retired-portrait-exports.json`. Historical export descriptions above do not describe current selection. No new artwork was generated.
