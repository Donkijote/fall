# Sings sorting table artwork

The [default scene master](../../../docs/design/sings-reference/background.png)
and [iteration prompts](../../../docs/design/sings-reference/prompts.json) live
with the design. The app selects the first matching WebP in this order:

| Export                   | Viewport                          |
| ------------------------ | --------------------------------- |
| `phone-portrait.webp`    | Aspect ratio up to 3/5            |
| `tablet-portrait.webp`   | Other portrait viewports          |
| `phone-landscape.webp`   | Landscape up to 500px high        |
| `tablet-landscape.webp`  | Remaining aspect ratios up to 3/2 |
| `desktop-landscape.webp` | Default                           |

Each export reframes the same sorting table. `SortingTableBackground` displays
it as decorative, full-viewport artwork behind the live gallery.
