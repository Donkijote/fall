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

### Current layer manifest (back to front)

| Layer                | Source                            | Bounds / anchor                                    | Purpose                                                              |
| -------------------- | --------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Sky                  | CSS gradients                     | Full stage; glow at 57% x, 64% y                   | Plum zenith into ember horizon                                       |
| Distant clouds       | CSS radial gradients              | 120% stage width, 48% height; top 21%, left -10%   | Muted rose/plum cloud banks                                          |
| Near clouds          | CSS radial gradients              | 120% stage width, 63% height; top -13%, left -10%  | Dark overhead framing                                                |
| Mountains            | SVG polygons from shared model    | 1600 × 900 reference frame; centered cover         | Distant ridge, middle ridge, near foothills with light/shadow facets |
| Mountain enhancement | Lazy React Three Fiber / Three.js | Same frame/cover for meshes; full-stage mist plane | Matching ridgelines plus drifting haze                               |
| Static mountain haze | CSS gradient                      | Full stage; strongest around 57% y                 | Consistent warm atmospheric separation in both paths                 |
| Atmosphere           | CSS gradients                     | Full stage                                         | Edge vignette and lower falloff                                      |

Layers follow DOM paint order. Bounds are relative to the same scene stage, not
the viewport or HUD rows. Portrait widens the sky and cloud fields rather than
scaling a landscape illustration down. Mountain cover cropping preserves the
central valley without stretching the peaks. The complete static presentation
has no exported raster images, texture requests or rendering dependencies.

### Enhancement and fallback

- The shared `useAtmospherePreferences` hook is also used by the login atmosphere;
  it was moved to `infrastructure/ui/hooks` without changing its behavior.
- Reduced motion, data saving or missing WebGL2 keep the SVG/CSS composition only.
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

Review the mountain setting next, then add a single tavern landmark. Keep the
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
motion/data/visibility preferences. Renderer lifecycle tests use a mocked canvas;
they do not validate GPU output. Automated tests do not approve the visual
composition; the mountain increment still needs landscape/portrait, light/dark
and representative-phone visual/performance review before the full scene is ready.
