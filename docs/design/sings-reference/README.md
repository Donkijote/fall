# Sings reference

The [simplified mockup](mockup-simplified.png) guides the live `/sings` page.
It uses an open gallery of card combinations, compact filters and a Back to Hall
action. The [detailed mockup](mockup-detailed.png) explores richer trim and surfaces.
The [clean sorting-table master](background.png) sets the camera, light and wood
texture behind the gallery. Keep card faces, points and filter labels live.

The [prompt manifest](prompts.json) contains reusable briefs reconstructed from
the approved artwork. The [runtime artwork inventory](../../../src/assets/sings-reference/README.md)
lists the five viewport exports. See the [Sings module](../../../src/modules/sings-reference/README.md)
for catalog ownership, filter behavior and verification.

Each combination entry places the title and declaration at the top, with its
score in a bronze medallion. The pressed-wax Optional and hammered-brass Mandatory badges
use live labels. The existing three-card examples sit on a parchment mat, with
the pattern description below. The catalog keeps its responsive column layout.

## Filter artwork

The Mandatory only filter now uses shared BrassCheckbox: the approved
[text-input frame](../text-input/README.md) surrounds a
[pressed wax selection](../choice-button/README.md). The tick is live, the artwork
is decorative, and Base UI retains native checkbox and form behavior. No new
bitmap or variant flag is needed for this reuse.
