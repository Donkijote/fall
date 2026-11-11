# Rulebook archive artwork

The approved clean landscape master lives at
`docs/design/how-to-play/archive-background-v1.png`. The phone and tablet masters
are `archive-background-phone.png` and `archive-background-tablet.png` alongside
it. Built-in ImageGen recomposed those two views from the approved room; exact
prompts are in `prompts-responsive.json`. These paintings contain no controls,
labels or instructional card art.

| Runtime file             | Source dimensions | Export                             |
| ------------------------ | ----------------- | ---------------------------------- |
| `archive-landscape.webp` | 1672 × 941        | Full approved landscape master     |
| `archive-tablet.webp`    | 1122 × 1402       | Dedicated tablet portrait painting |
| `archive-phone.webp`     | 909 × 1731        | Dedicated narrow portrait painting |

Pillow exports preserve each master's dimensions with WebP quality 83, method 6,
matching the Card Hall approach. These three files total roughly 360 KB. Runtime
code imports only these optimized assets, not the PNG design masters.

`ArchiveBackground` selects phone at aspect ratios up to 3/5, tablet up to 5/4,
and landscape otherwise. The fixed background fills the viewport; one normal
page scroll owns the guide. Artwork is decorative and excluded from the
accessibility tree. Missing artwork leaves the semantic background and all live
text, navigation and controls intact. Responsive composition retains the shelf,
desk, warm lantern and cool stone/daylight without squeezing a landscape frame
into portrait.
