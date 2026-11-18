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

## Resource and Help finishing pass

Resource counters reuse the approved [outline action skin](../action-button/README.md)
with live icons and values. Portrait layouts stack icon/value within compact mounts;
desktop and short landscape use rows. Help menu links reuse the How to Play leather
bookmark through `GuideLink`, with an artwork arrow. These compositions reuse
canonical runtime assets; no new generation or alternate skins are introduced.

## Interaction review — GHI #124

The priority pass strengthens the available Tavern card's brass light and broadens
its moving reflection. Hover, keyboard focus and the first touch tap use the same
attention state. Coming-soon cards keep their existing subdued treatment. The
frame arrives in 280ms and releases in 360ms; its sweep takes 3.4s, without adding
another transform owner. Reduced motion keeps a static bright frame and focus cue.

Header and dock share one safe-area-aware horizontal gutter: the existing dock
values below `lg` (4px below 360px, 12px from 360px, 16px from `sm`, and 6px in
compact landscape), then the existing header clamp of 16px–48px at `lg` and above.
Resource readouts retain the outline artwork and its intact full-height end
strips. An absolute size container scales their width from the actual readout
height using the source's 52:116 ratio; only the center stretches horizontally.
The earlier four-sided slicing split the painted face and was reverted. Compact
counters reserve enough width and padding for the end ornaments and their value.

Resource-frame correction was reviewed in the running app at 1280×800,
375×667, 320×568 and 667×375 for the HUD, and at 1280×800, 375×667 and
768×1024 in the standalone gallery. Both gallery themes were checked. The end
ornaments keep their source proportions and the 320px HUD has no horizontal
overflow. The broader app-wide motion/device acceptance matrix remains pending.
