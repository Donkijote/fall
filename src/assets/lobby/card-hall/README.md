# Card Hall runtime artwork

The [simplified mockup](../../../../docs/design/home-lobby/mockup-simplified.png)
supplies the activity paintings and fallback portrait. The [clean Hall master](../../../../docs/design/home-lobby/background.png)
is the reference for all three responsive paintings. Labels, selection borders
and controls are live HTML.

| Export                | Source region `(left, top, right, bottom)` | Dimensions  |
| --------------------- | ------------------------------------------ | ----------- |
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

The [prompt manifest](../../../../docs/design/home-lobby/prompts.json) records
the three viewport prompts and final edits.
