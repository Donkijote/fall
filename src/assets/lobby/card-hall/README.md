# Card Hall runtime artwork

Source of truth: `docs/design/main-menu-research/image-concepts/card-hall.png`.
Its approved activity paintings are reused directly.
All labels, selection borders, buttons and other interface elements are real HTML.

The detailed `card-hall-background-detailed.png` is the reference for the
three responsive hall paintings. The adjacent
`card-hall-background-2.png` contains an older, fully composited interface and is
not a clean background; it is intentionally not imported.

| Export                | Source region `(left, top, right, bottom)` | Dimensions  |
| --------------------- | ------------------------------------------ | ----------- |
| `hall.webp`           | Earlier clean background export            | 1672 × 941  |
| `hall-landscape.webp` | Expanded landscape painting                | 1683 × 935  |
| `hall-tablet.webp`    | Tablet portrait painting                   | 1122 × 1402 |
| `hall-phone.webp`     | Narrow phone portrait painting             | 852 × 1846  |
| `tavern.webp`         | `(215, 164, 589, 550)` in revised master   | 374 × 386   |
| `campaign.webp`       | `(636, 125, 1037, 516)` in revised master  | 401 × 391   |
| `arena.webp`          | `(1085, 164, 1461, 550)` in revised master | 376 × 386   |
| `traveller.webp`      | `(53, 21, 141, 109)` in revised master     | 88 × 88     |

The campaign crop stops above the illustrative CHAPTER II text. Card titles and
other baked UI/frame elements are outside the artwork crops. WebP uses Pillow
quality 92/method 6 for the paintings/portrait and quality 90/method 6 for the hall.
The master PNGs stay in the design folder unchanged and are not runtime imports.
The three responsive paintings use WebP quality 83/method 6. The browser
selects the matching source by viewport aspect ratio.

The Traveller portrait is a visual fallback, not a real account photo. A supplied
user avatar takes priority, and failed artwork never removes the real controls.
At larger sizes these small source crops are upscaled: dedicated higher-resolution
paintings can replace the exports later without rebuilding the component layout.

## ImageGen prompt set

The built-in ImageGen tool used the detailed painting as its edit and identity
reference. Each prompt requested a full-bleed backdrop of the same medieval
stone hall with cool daylight, ivy windows, a recessed central arch, a red and
gold banner, a lion chair, and leather books and parchment on the oak table.
The prompts called for coherent perspective, a quiet center, dark upper
corners for the HUD, and no baked text, controls, cards, or people.

- **Phone:** Recompose for approximately 9:19.5. Bring the window and banner
  inward around the central arch and group the books and map in the lower
  right, above the bottom edge. Extend the ceiling and tabletop vertically.
- **Tablet:** Reframe at 3:4 to 4:5. Pull back to show both sides of the hall.
  Keep the table and its props in the lower quarter.
- **Landscape:** Expand the composition around all four sides. Keep major
  props inside a safe area for approximately 1.4:1 to 2.3:1 framing.
