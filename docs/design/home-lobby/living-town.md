# Living Town · issue #99

## Increment 1: sky foundation

The approved composition reference is `fall_living_town_lobby_ui.png`, supplied
in the issue implementation conversation. Its plum dusk sky, warm peach/ember
horizon and darker overhead clouds guide this first pass. This is a CSS atmosphere
study, not final illustrated artwork or approval of the complete town composition.
Do not use the earlier HTML town blockouts as the art target.

`LivingTownScene` occupies the existing full-bleed `HomeHud.scene` slot beneath
the HUD. The current Caída entry, onboarding and Settings remain unchanged. A
theme-aware backing keeps the temporary arrival text readable over the sky.
The scenery has a fixed dusk palette; it does not force the HUD into dark mode.

## Increment 2: distant mountains

The sky was reviewed in the implementation conversation. The next chosen element
is the distant mountain setting: three faceted ridgelines, warm-facing rock planes,
plum shadows and a lower central valley. This establishes the surroundings before
adding the single tavern. The mountains are code-native geometry, not generated
or final painted artwork; no castles, buildings, text or hotspots are introduced.

`scene/mountainModel.ts` defines the shared 1600 × 900 composition. The always-on
SVG backdrop and the lazily loaded React Three Fiber renderer consume exactly
the same ridge/facet coordinates. SVG uses centered `slice` sizing; the orthographic
Three.js scene uses the equivalent cover scale, including portrait cropping.
The SVG has independent gradient IDs and remains mounted behind the renderer.

Three.js renders layered mountain meshes and a low-opacity procedural mist shader
that drifts slowly across their bases. There are no texture downloads, pointer
listeners, camera controls or destination changes. GSAP is not required for this
continuous shader effect; avoid introducing a second animation clock just to use
another installed library.

## Increment 3: the tavern

The next landmark is a single left-foreground tavern, not the future mountain-top
castle. The user requested a more grounded/material-rich direction after reviewing
the faceted mountain study. `scene/Tavern.tsx` therefore builds a three-quarter
timber-and-stone building with real depth, rough materials, roof shingles, a stone
chimney, timber braces, arched leaded windows, a sheltered porch, steps, lanterns,
a barrel, a crate and a small hanging tankard sign. It remains a 3D architectural
study, not final photorealistic or reference-matched painted artwork.

Four deterministic 128 × 128 RGBA data textures provide stone courses/mortar,
timber grain/planks, roof courses and plaster grain. They are generated locally
from `tavernModel.ts`, repeated as color/bump maps and disposed on unmount. There
are no stock-asset downloads, image-generation API calls or added dependencies.
Warm emissive window/lantern materials and two local lights contrast with a warm
directional key and cool ambient light. No flicker or new animation is added.

The tavern shares the existing lazy renderer, now named `LivingTownCanvas`; no
second WebGL context or frame loop is introduced. Mountain and mist materials
respect the tavern depth buffer so the background cannot paint over the building.
The mist remains behind the foreground architecture. Desktop antialiasing is
enabled; compact devices retain DPR 1 without multisample antialiasing.

`TavernBackdrop` supplies a self-contained, detailed SVG alternative with stone,
roof and wood patterns, warm windows and lantern halos. It stays mounted and is
hidden only once the renderer is ready; renderer failure or preference changes
restore it. This fallback approximates the 3D composition, not pixel-identical art.
It has no raster loading dependency and does not intercept input.

### Placement manifest

Both paths use the existing centered-cover 1600 × 900 reference frame. The 3D
building ground anchor is (290, 756), with 55 reference pixels per model unit;
portrait moves it to (655, 777) at 47 pixels per unit so part of the landmark
remains visible rather than being lost to the landscape crop. The SVG fallback
uses a local 600 × 650 drawing translated to (87, 319), scaled 0.68; portrait uses
(481, 402), scaled 0.58. Placement values are recorded in `tavernModel.ts` and CSS.
The HUD and the temporary central Play entry retain their existing space and
pointer ownership. The tavern introduces no hotspot, unlock rule or new game flow.

### Current layer manifest (back to front)

| Layer                | Source                            | Bounds / anchor                                    | Purpose                                                              |
| -------------------- | --------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Sky                  | CSS gradients                     | Full stage; glow at 57% x, 64% y                   | Plum zenith into ember horizon                                       |
| Distant clouds       | CSS radial gradients              | 120% stage width, 48% height; top 21%, left -10%   | Muted rose/plum cloud banks                                          |
| Near clouds          | CSS radial gradients              | 120% stage width, 63% height; top -13%, left -10%  | Dark overhead framing                                                |
| Mountains            | SVG polygons from shared model    | 1600 × 900 reference frame; centered cover         | Distant ridge, middle ridge, near foothills with light/shadow facets |
| Tavern fallback      | Patterned SVG architecture        | Shared reference frame; placement above            | Always-available decorative landmark                                 |
| Scene enhancement    | Lazy React Three Fiber / Three.js | Same frame/cover for meshes; full-stage mist plane | Matching ridgelines, mist and textured 3D tavern                     |
| Ground apron         | CSS gradients                     | Full stage; lower third and left foreground        | Dark ground contact and warm lantern spill                           |
| Static mountain haze | CSS gradient                      | Full stage; strongest around 57% y                 | Consistent warm atmospheric separation in both paths                 |
| Atmosphere           | CSS gradients                     | Full stage                                         | Edge vignette and lower falloff                                      |

Layers follow DOM paint order. Bounds are relative to the same scene stage, not
the viewport or HUD rows. Portrait widens the sky and cloud fields rather than
scaling a landscape illustration down. Mountain cover cropping preserves the
central valley without stretching the peaks. The complete static presentation
has no exported raster images, texture requests or rendering dependencies. The
enhanced tavern uses only generated in-memory texture data.

### Enhancement and fallback

- The shared `useAtmospherePreferences` hook is also used by the login atmosphere;
  it was moved to `infrastructure/ui/hooks` without changing its behavior.
- Reduced motion, data saving or missing WebGL2 keep the SVG/CSS sky, mountains and tavern.
  Preference changes unmount the renderer immediately.
- Canvas is transparent, lazy-loaded and invisible until its first frame. Its
  loading, initialization, shader and context-loss failures retain the backdrop.
  After failure the enhancement stays off until the scene remounts.
- Compact/coarse-pointer devices render at DPR 1; desktop DPR is capped at 1.5.
  Hidden tabs stop the frame loop. Time steps are capped to prevent large jumps
  on resume. Declarative geometries/materials are disposed on unmount.
- The WebGL canvas never owns input; semantic HTML HUD and gameplay controls stay
  above the scene. No new controls or accessibility announcements are added.

### Next increments

Review the tavern and its material direction next. The castle remains a later
composition step; do not add it or other landmarks without agreement. Keep the
entire sky and mountain backdrop intact behind future foreground layers. Before replacing
this study with raster art, agree on the complete static composition and document
source/export dimensions, compression, anchors and cropping. Generate clean art
without text, HUD elements or badges; do not crop layers from the flattened
reference. Built-in image generation was unavailable for this increment; no API
key or image-generation integration has been added.

Do not add a tavern hotspot until its artwork and destination behavior are agreed.
No other landmarks, game modes, progression rules or icon-library changes are
implemented in these increments. Issue #99 remains open for those later steps.

### Validation boundary

Home integration tests cover decorative scene ownership and preservation of the
existing gameplay entry. Mountain tests cover SVG composition/unique gradients,
triangulatable model coordinates, cover scaling, renderer lifecycle/failure and
motion/data/visibility preferences. Tavern tests cover deterministic texture buffers,
distinct surfaces, portrait/landscape anchors and decorative fallback preservation.
Renderer lifecycle tests use a mocked canvas; they do not validate GPU output.

The tavern increment also receives a production-build visual/integration pass
using isolated headless Chromium (not the user's browser profile), because the
shared preview's screenshot bridge timed out. Desktop (1280 × 800), portrait
(390 × 844 and 320 × 568), phone landscape (844 × 390) and wide desktop
(1920 × 1080) have no horizontal overflow, one canvas, and an in-bounds Play
button with at least 44px targets. Desktop and portrait screenshots were captured
and inspected. Reduced motion removes the canvas and reveals the tavern fallback;
a fallback screenshot was also inspected. A light-theme mode-picker smoke test
passes, and simulated WebGL context loss restores the static tavern. No uncaught
page errors were recorded.

`pnpm check`, all 331 tests in 57 files, and the production build pass. Existing
Three.js deprecation and bundle-size warnings remain. These checks are not art
approval or representative physical-phone GPU/battery performance measurement.
The full composition and its eventual realistic art treatment remain iterative.
