# Living Town: illustrated environment (#99)

## Art direction

The supplied `fall_living_town_lobby_ui.png` remains the composition reference:
a dusk valley, warm tavern in the left foreground, open plaza and room for future
landmarks. The earlier CSS/SVG/mesh blockouts were rejected as too cartoonish.
They are replaced, not rendered underneath or used as alternate art on mobile.

Use believable timber/stone forms and painterly material detail, not photorealism,
low-poly facets, candy colors or miniature/toy architecture. The prepared assets
in `src/assets/lobby/living-town` deliberately follow the existing hub's charcoal,
oxblood, muted plum and aged-bronze palette. Their generation briefs are preserved
in that directory's README. Do not mix in the softer alternative cottage set or
crop scenery from the flattened reference with its UI baked in.

## Integration with the HUD

`LivingTownScene` stays in the full-bleed `HomeHud.scene` slot, under the existing
HTML HUD. Player identity remains upper-left; resources and Settings upper-right;
the five player-system shortcuts remain below. Keep the central valley quiet for
future landmarks. HUD typography, tokens, icons, theme selection and gameplay
rules remain unchanged. The temporary central title/Play panel is removed.

The scenery has a fixed dusk palette in both themes. Local desaturation, depth
grading, horizon haze and a charcoal perimeter connect it to the HUD without
forcing dark mode or tinting the HTML controls. Warm tavern windows and the oxblood
awning echo existing ember/primary accents. The tavern is now the single Play
entry: its semantic button opens the existing mode picker, rather than starting a
match or changing any mode-selection behavior. Hover/focus adds an amber silhouette
glow; the cursor is a pointer. Enter, Space and touch use the same action. Escape
from the picker returns focus to the tavern. It is disabled until onboarding ends.

## Layer manifest

`scene/townArtwork.ts` owns imported URLs, intrinsic dimensions and back-to-front
art ordering. `living-town.css` owns composition and grading.

| Layer                       | Source/export dimensions | Composition                                         |
| --------------------------- | ------------------------ | --------------------------------------------------- |
| Sky                         | 1672 × 941               | Full frame, original aspect preserved with cover    |
| Far mountains               | 2172 × 724               | Top 8%, width 108%, left -4%; quieter/hazed         |
| Near mountains              | 2172 × 724               | Top 22%, same overscan; darker foothills            |
| Static haze / optional mist | Full reference frame     | Between terrain and foreground                      |
| Ground / plaza              | 1672 × 941 → 3344 × 602  | Tiled solid paving crop; top feathered into terrain |
| Tavern / contact shadow     | 1536 × 1024              | 32% of shared world width; mirrored to face inward  |
| Atmosphere                  | Full stage               | Dark upper/lower perimeter; never over HUD          |

Sky and distant mountains retain centered-cover framing, with a central valley
and no aspect stretching. Foreground destinations instead share a contained 16:9
world: `--town-world-width = min(scene width, scene height × 16/9)`. Its width is
1600 reference units, and its height is 900. The tavern is always 32% of that width
(512 reference units), with its native 3:2 image ratio. There is no separate mobile
zoom. Its image is mirrored horizontally so the facade faces the open square.
Future destinations should use this same frame, rather than viewport-sized images.

The world sits above max(14% scene height, 8rem) of dock clearance; screens at most
360px wide reserve 10.5rem for the two-row dock. The tavern's left inset is
max(1% world width, 2.75rem), leaving the lower-left Chat control clear. Transparent
source padding remains part of its bounds. A soft contact ellipse grounds the steps.
These HUD-safe offsets change placement, not relative asset scale or aspect ratio.

The paving is no longer a zoomed cover image. A solid crop of `plaza.png` at
(0, 640)–(1672, 941) is mirrored into a seamless 2 × 2 texture, exported as
3344 × 602 `plaza.webp`. CSS repeats it at 65% of world width with automatic height;
the tile-to-tavern ratio is therefore constant across screen sizes. It fills the
lower 42% of the stage, feathering into the terrain. This keeps flagstones smaller
without enlarging the whole foreground or reducing space for future landmarks.

PNG masters remain unchanged. Four image exports retain source dimensions/alpha;
the paving export is the derived RGB texture above. Rebuild it using
`python scripts/export-living-town-plaza.py` in an environment with Pillow installed.
All exports use quality 88, method 6. Five WebP exports total about 522 KiB versus
about 6 MiB of masters; Pillow is not an application dependency. Vite fingerprints
the URLs, and original PNGs are not emitted by the build.

## Loading, accessibility and enhancement

- Every image has empty alt text, explicit dimensions and disabled dragging.
  Only decorative layers are `aria-hidden`. The scene itself is not hidden, since
  it now contains the tavern button. Pointer events opt in only on that button.
- Images decode asynchronously and become visible after loading. Failed images
  stay hidden instead of showing broken-image placeholders. Other layers remain;
  CSS sky/ground colors provide a basic usable backdrop if all requests fail.
  The paving is a decorative CSS background and fails transparently. The tavern
  has a visible Play Caída label while loading or failed, and on hover/focus, so
  the mode picker remains reachable even when artwork requests fail.
- The raster composition is the primary presentation, including reduced motion,
  save-data and missing WebGL. There is no different geometric fallback style.
- The one lazy R3F canvas draws only a low-opacity drifting mist plane. It never
  hides or replaces artwork. Initialization/shader/context-loss errors disable it
  until remount. Reduced motion and save-data unmount it; hidden tabs stop frames.
- Desktop DPR is capped at 1.5, compact DPR at 1. The mist uses no antialiasing,
  texture downloads, lights, pointer listeners, camera controls or second clock.
  The shared preference hook and login atmosphere behavior are unchanged.

## Scope and further review

The castle, other landmarks, additional destination interactions and progression
rules are explicitly deferred. Issue #99 remains open. This is an integrated art-direction
pass, not final art approval. The fixed-view tavern contains painted illumination
and a soft warm fringe; changing its viewpoint or lighting needs revised artwork,
not dynamic relighting of a flat image. Edge cleanup, plaza perspective and the
final landmark scale remain candidates for the next art review. Prefer composition
and source-art corrections to adding bloom, clutter or more rendering libraries.

Scene tests cover layer order, intrinsic sizing, decorative semantics, individual
image failure, static paths and enhancement lifecycle. Home tests preserve
onboarding, Settings, the single existing Play entry and mode selection. Mocked
renderer tests do not establish GPU quality or physical-phone performance.

## Integration validation

- `pnpm check`, all 318 tests in 55 files, the production build and
  `git diff --check` pass. Obsolete geometry-model tests were removed with the
  rejected procedural art. Existing Three.js deprecation/large-chunk warnings remain.
- Production-build checks in isolated headless Chromium cover 1280 × 800,
  390 × 844, 320 × 568, 844 × 390, 1920 × 1080, 2560 × 1080 and 768 × 1024:
  contained 16:9 world, constant 32% tavern width/native 3:2 aspect, constant 65%
  paving tile width, inward flip, no horizontal overflow and an in-bounds tavern
  target at least 44px in each dimension.
- Desktop, portrait and hover compositions were captured and inspected. The central
  panel is absent; the smaller tavern leaves space for more destinations.
- Reduced motion retains the four images and paving without a canvas. Simulated context loss
  retains the art; blocking all image requests leaves the CSS fallback and usable Play.
  Light-theme mode selection and Settings dialogs work. No uncaught page errors
  were recorded. Physical-device GPU/battery performance and final art approval
  remain outstanding.
