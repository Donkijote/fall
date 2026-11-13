# Home lobby: Card Hall

The [simplified mockup](mockup-simplified.png) is the implementation and
activity artwork reference. The [detailed mockup](mockup-detailed.png) shows the
same composition with richer ornament. The [clean Hall master](background.png)
supplies the stone arches, window light, banner and oak table for responsive
paintings. [Prompts](prompts.json) record both treatments, the clean plate, and
its landscape, tablet and phone edits.

The live lobby uses three activity cards above compact navigation. Tavern opens
the match format picker; Campaign and Arena are previews. The identity, resource
readouts, titles and controls are live. Sample progress, quest copy and the
Campaign action in the mockups are illustrative.

Portrait uses a horizontally scrolling activity row. Keyboard focus and touch
preview share the selection cues, and reduced motion keeps the static cues.
Settings opens over this same Hall. See the [Home module](../../../src/modules/home/README.md)
for behavior and verification and the [runtime artwork inventory](../../../src/assets/lobby/card-hall/README.md)
for viewport exports and exact crop coordinates.

Card Hall and the Component Gallery use the same ActivityCard frames. Each
activity has standalone portrait artwork with larger diagonal corner plates
and symbols engraved into the metal. Tavern uses the Spanish suits, including
a wooden club. Campaign uses exploration symbols and Arena uses arms and
tournament symbols. Idle uses the worn frame, active brightens it, and
unavailable cards use a matte finish.

Both Card Hall docks use blackened iron frames with softly rounded corners with aged bronze trim and
brass icon silhouettes. Joined controls share one frame with painted corners
and fine dividers between buttons. The dark metal and fine trim come from the supplied
navigation reference. Compact icon groupings follow the supplied main-menu
reference. Both docks use the shared NavigationButton and NavigationGroup.

Oak-leaf engravings mark the outer corners. The bronze has even lighting at rest.
The shared GSAP reveal lights all four leaves on standalone controls, the nearest
leaf pair on grouped edge controls, and the rails on middle controls. It responds
to hover, keyboard focus, and an open popover.
