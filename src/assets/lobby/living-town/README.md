# Living Town artwork

These are independent source PNGs generated with the built-in image tool for
issue #99. The supplied town-square image served as the composition
reference. The layers below are ordered from back to front.

| Asset                | Source size | Alpha  | Placement                                                                                         |
| -------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------- |
| `sky.png`            | 1672 × 941  | Opaque | Cover the scene. Keep the upper HUD over the dark plum portion.                                   |
| `mountains-far.png`  | 2172 × 724  | Yes    | Span the stage with overscan. Keep the right-side summit visible beside The Hearth.               |
| `mountains-near.png` | 2172 × 724  | Yes    | Overlap the far ridge and keep the valley opening in the middle.                                  |
| `plaza.png`          | 1672 × 941  | Yes    | Align to the bottom of the stage. Keep the open flagstone square continuous behind the lower HUD. |
| `tavern.png`         | 1536 × 1024 | Yes    | Anchor the foot of the steps in the left foreground.                                              |

Sky/mountains use a centered-cover backdrop. Foreground destinations use a separate
contained 1600 × 900 frame. The tavern occupies 512 reference pixels (32% width),
retains its native 3:2 aspect and is horizontally mirrored to face inward. That
same scale applies on mobile; there is no portrait-specific landmark enlargement.

## Runtime exports

The PNG masters above are preserved unchanged. The application imports only
`.webp` exports (about 1970 KiB combined), using `quality=88, method=6`.
The original eight exports retain source dimensions, with alpha for cutouts. The Merchant
uses the supplied 1536 × 1024 master. The updated `quest-board.png` matches the
latest Downloads `quests.png` (1246 × 1262); `arena.webp` uses the newer
`arena-reference.png` (1525 × 1031), matching Downloads `area.png`. The latest Downloads `castle.png`, `observatory.png`,
`fountain.png` and `gates.png` are also preserved unchanged under those master names.
Their WebP exports trim transparent padding with an eight-pixel margin around the
alpha-above-16 silhouette: castle 1137 × 1009, observatory 948 × 1375,
fountain 1658 × 424 and gates 1088 × 1114. This removes the fountain's empty upper
canvas without distorting its shallow oval. All native artwork aspects are preserved.
The twelve exports include no baked labels or new terrain images; district
foundations reuse the existing painted ridges as cached CSS backgrounds. The plaza is
shown once at full stage width and feathered into the terrain, not repeated
or reflected. The discarded mirrored tile caused dark bands; its offline helper
`export-living-town-plaza.py` has been removed. Re-export after changing a master.
The current implementation uses positioned HTML images for the primary artwork,
not textured WebGL planes, so reduced-motion and missing-WebGL presentations
keep exactly the same art. R3F supplies only optional mist behind the foreground.
See `docs/design/home-lobby/living-town.md` for implemented anchors, grading and
failure behavior. The plane guidance below is for a possible future renderer,
not the current implementation.

In React Three Fiber, give each layer its own plane and use sRGB color
textures. Use unlit materials with tone mapping disabled to preserve the painted
colors. Enable transparency and disable depth writes on the cutout planes, with
explicit back-to-front render order. Leave the HUD in the existing HTML layer.
The current mist shader can sit between the ridges and move independently.
GSAP can animate layer transforms without changing the textures.

The tavern is a fixed-view cutout with
painted lighting. It can translate for parallax, and changing the viewing
angle or relighting the building would require geometry and material maps.

## Generation prompts

Every asset used the following shared prompt and its layer-specific brief below.

> Generate one standalone scenery asset for Fall’s orthographic 2.5D game lobby. Reference the attached image for the medieval town-square composition and warm dusk mood. Match Fall’s actual UI palette of charcoal brown, aged brass, cream and oxblood. Understated hand-painted game environment, believable forms, deliberate broad value groups, selectively detailed surfaces, soft matte finish. Avoid photorealism, oversharpening, dense microtexture, neon, bloom, candy color, outlines, low-poly facets. UI, words, symbols, borders, characters and watermarks must be absent.

**plaza.png**

> Wide 16:9 town square GROUND ONLY. Continuous broad walkable medieval plaza, filling roughly bottom 40% of canvas from edge to edge, with real transparent alpha above the rear edge. Moderately elevated street-level view. Large irregular worn flagstones in dusty warm gray and umber, gently arcing paving courses around a clear center, no separate path, no dais or circular object. Square remains wide at the rear with a shallow mostly horizontal back edge, no valley or vanishing road. Dry matte stone, subtle warm light from left, a few subdued joints. Clear open area, no rocks, plants, buildings, props, mountains, sky, or bright reflections. Think the plaza beneath the reference's portal, as an empty surface for separately placed landmarks.

**tavern.png**

> Isolated single compact medieval tavern, 3:2 landscape sprite with true alpha around and through all openings. Ground-level three-quarter front with right side visible. Broad readable silhouette, compact limestone footing, dark oak framing, matte plum-brown tile roof with a small chimney, a few muted amber window panes, restrained oxblood awning and shallow step onto a level plaza. Broad strokes, some visible material wear only at focal points. No grounds, background, colored halo, cast shadow, adjacent structure, vegetation or clutter. Keep the building entirely in frame.

**mountains-far.png**

> Ultra-wide 3:1 distant ridge sprite. A restrained low horizon of eroded peaks, receding in cool dusty muted plum and slate. Highest peak right of center, smooth saddle around the middle. Deliberately simplify the rock into broad hand-painted tonal planes, subdued enough to sit behind a future medieval town. Upper silhouette on actual clear alpha, terrain solid to bottom and side edges, zero sky, clouds, buildings or trees.

**mountains-near.png**

> Ultra-wide 3:1 low foothill sprite with real alpha above. Read as a distant low hillside behind a built town square, not a wilderness foreground. Slate-charcoal and muted umber rock, quiet dark trees grouped in a few sparse silhouette masses, lower saddle through middle and modest rise on right. Painterly material masses, no saturated foliage, no isolated scenic centerpiece, no structures or foreground boulders. Solid land to both side edges and bottom.

**sky.png**

> Wide 16:9 opaque sky-only matte painting. Rich dark charcoal-plum upper third for legibility behind brass HUD, quiet violet-grey cloud shapes framing the edges, thin muted copper dusk glow near lower-middle right. Deliberately large sparse cloud shapes, subtle texture and restrained brightness. A continuous sky plate all the way to the edges, no ground, buildings, trees or horizon silhouette.

## Additional landmark masters

Retained generation notes for the merchant, quest-board and arena source masters.
These support the artwork currently used by the running lobby.

Shared generation brief

> Create a NEW single isolated environmental game asset for Fall's 2.5D medieval town square, transparent PNG with actual alpha outside silhouette and through open gaps. First reference is the tavern, use as exact art direction for matte hand-painted surface quality, believable broad forms, restrained texture, warm amber light, cream limestone, oak and oxblood accents, soft shadow transitions. The second reference is for subject design only. Ignore and omit every label, badge, name, UI element, notification dot, text, and surrounding scene. Ground-level front three-quarter view showing front and right side, matching tavern perspective. Full silhouette including base, comfortable padding, no baked floor, cast shadow, scenery, people or halo.

**merchant.png**

> A small low merchant booth, a single open oak market counter with a low sloping oxblood fabric canopy, slim wood posts, restrained brass trim, a few earthenware jars and neatly stacked goods on the counter, and one small wooden crate under the counter. Cozy and compact, distinctly shorter and simpler than a tavern. No hanging sign or plaque.

**quest-board.png**

> A standalone covered quest noticeboard, tall dark oak framed board on two wooden posts with an open-sided peaked oxblood cloth canopy, one small amber lantern, and five loosely arranged pinned parchment sheets. Parchment can have faint abstract marks with no legible characters. Freestanding noticeboard, no service counter or merchandise. No emblem or title area.

**arena-reference.png** is the source master used for the current arena WebP export.

> Directly restore and isolate the arena building in this supplied pixelated crop. This is a faithful image edit and upscale, not a reinterpretation. Copy the existing projected outline, apparent camera distance, exact viewpoint looking up, central-left tall turret and short turret at left, sloping curved crown and all visible arch shapes, offsets, narrow ledges, lower structure, and gold patches as closely as possible. Preserve the compact proportions, the cool shadow on the left, warm light on the right and warm event light coming from within open deep archways. Remove the floating Arena label and reconstruct ONLY the architecture it hides by continuing adjacent stonework. Remove the foreground rooftops, adjacent buildings, sky and mountains; extend only the obscured lower arena enough to complete the structure, with the broad visible lower tier below the two narrower upper tiers. Clean up pixelation in the existing hand-painted Fall tavern style without changing any visible architectural design or lighting. Correct each original flagpole to carry exactly ONE red pennant, attached on the right only, all blowing to the right with one fabric tip per pole. No new decorative elements, no camera rotation, no higher viewpoint, no recentering of architectural features relative to one another. Entire isolated asset with small margins on true transparent alpha. No lettering or UI.
