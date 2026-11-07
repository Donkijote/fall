# Living Town: illustrated environment (#99)

## Art direction and HUD

The supplied `fall_living_town_lobby_ui.png` remains the composition reference:
dusk valley, warm left-hand tavern, open square and space for future landmarks.
Prepared PNG masters live in `src/assets/lobby/living-town`, with generation
briefs in its README. Use believable painterly timber/stone forms, not toy-like
geometry, photorealism or candy colors. Charcoal, oxblood, plum and aged bronze
connect the environment to the existing HUD.

`LivingTownScene` occupies the full-bleed `HomeHud.scene` slot. Identity stays
upper-left, resources/Settings upper-right and player-system shortcuts below.
HTML HUD typography, theme handling and game-mode behavior are unchanged.
The temporary central title/Play panel is removed. The tavern is the single
Play entry: click, touch, Enter or Space opens the existing mode picker. It stays
disabled until onboarding completes; Escape from the picker restores focus.

The permanent **The Tavern** nameplate uses a dark wood-colored backing, double
bronze frame, diamond ends and the existing heading font, following the reference
landmark plaque. It is part of the button and remains visible even if the image
fails. There is no hover tooltip. The accessible button name is Play at the tavern.

## Layers and scale

`scene/townArtwork.ts` owns URLs, intrinsic dimensions and art order;
`living-town.css` owns anchors and grading. Selected PNG masters are preserved. All eight
WebP exports retain source dimensions/alpha, using quality 88, method 6, and total
about 1167 KiB. Vite fingerprints them; the PNG masters are not emitted in the build.

| Layer                       | Source/export size | Placement                                                                    |
| --------------------------- | ------------------ | ---------------------------------------------------------------------------- |
| Sky                         | 1672 × 941         | Centered-cover backdrop                                                      |
| Far mountains               | 2172 × 724         | Top 8%, width 108%, left -4%; hazed                                          |
| Near mountains              | 2172 × 724         | Top 22%, same overscan; darker foothills                                     |
| Static haze / optional mist | Reference frame    | Behind the foreground                                                        |
| Ground / plaza              | 1672 × 941         | One unrepeated image, vertically feathered, solid at side edges              |
| Arena                       | 1525 × 1031        | Left 14%, bottom 32% (28% short landscape), width 26%; elevated above tavern |
| Tavern                      | 1536 × 1024        | 32% of contained world width, mirrored inward                                |
| Merchant                    | 1536 × 1024        | Left -4.7%, bottom -11%, width 24%; in front of tavern                       |
| Quest board                 | 1246 × 1262        | Visible right edge at 99% of stage, bottom -4%, width 20%                    |
| Atmosphere                  | Full stage         | Quiet perimeter, never over HTML HUD                                         |

Foreground destinations share a contained 1600 × 900 world, with width
`min(scene width, scene height × 16/9)`. The tavern is always 512 reference units
wide with its native 3:2 aspect; there is no mobile-specific zoom. The world is
left-aligned, not centered within an ultrawide stage. The tavern anchor is -4%
of world width, accounting for transparent sprite padding while preserving the
visible building at the left edge and leaving the square open to the right.

Normal/portrait dock clearance is `max(20% scene height, 10.5rem)`, keeping the
left-shifted tavern clear of Chat. Landscapes at most 600px tall instead use
`max(5rem, 22% scene height)`, lowering the building into the foreground below
the header without putting it behind the system dock. HUD-safe offsets affect
placement, not relative art scale.

Portrait screens at most 360px wide reserve `max(20% scene height, 16rem)` for
the taller two-row system dock and Chat, rather than putting them over the facade.

The plaza is the original continuous painted image, shown once at stage width
with automatic height. There is **no repetition, reflection or texture atlas**.
Its vertical mask is anchored to the painted apron (22%–14% of world width
above the image bottom). Its side edges remain solid beneath the edge buildings,
including ultrawide screens. In portrait the apron extends 12% of world width
beyond world dock clearance so the forward Merchant does not stand below the floor;
landscape lets it extend behind the dock. CSS ground color and the perimeter
falloff connect the apron to the surrounding terrain without hard strips. Ground
occlusion follows that same apron anchor, so raised narrow-screen placement does
not reveal distant mountains underneath the paving like a floating platform.

The former mirrored crop created visible alternating bands and was discarded.
`export-living-town-plaza.py` was only an offline tile-export helper, never runtime
code. It is removed because that tile is no longer used. Ordinary WebP export
does not require a project-specific script or new application dependency.

## Arena, merchant and quest board

The newest reference-restored arena and quest booth are selected from
`arena-reference.png` and the updated `quest-board.png`, respectively. The latter
matches the newest Downloads `quests.png` byte-for-byte, replacing the older
symmetrical noticeboard. The arena export preserves its native 1525 × 1031 aspect;
the quest booth keeps its near-square 1246 × 1262 aspect, not a stretched 3:2 box.
The arena sits higher in the upper-left district and shifts toward the square,
so its facade reads above and beside the tavern instead of being buried behind it.
Its slightly smaller scale and feathered foundation suggest an elevated, more
distant terrace. Short landscape screens lower its anchor slightly for header
clearance. Narrow landscapes with the HUD's two-row header use 16% bottom clearance
(10% at heights up to 375px), rather than hiding the Arena badge behind resources.
The earlier `arena.png` study is not used at runtime.

The smaller
merchant overlaps the tavern's lower-left facade, with its painted silhouette
at the left screen border rather than detached in the square. The noticeboard's
painted right edge follows the stage's right border with 1% breathing room, even
when the contained foreground world is narrower than an ultrawide screen.
Both sit slightly forward of the tavern. The Merchant retains its inward mirror
and adds a restrained 24-degree CSS perspective adjustment around its foot line,
with perspective depth proportional to world width so the turn is stable across resolutions;
this is a projected sprite, not newly generated side geometry. The latest Quests
art already faces left into the square and must not be mirrored.

Detached oval ground shadows are removed. A tight one-pixel silhouette shadow
provides edge occlusion instead; continuous paving now reaches beneath the
painted feet, including portrait's lower Merchant and the stage edges. The unrepeated floor spans
the full stage so both edge districts remain over paving. The middle stays open
for a future focal point, with the upper town reserved for later landmarks.

All three planned landmarks use permanent bronze nameplates. Merchant and Quests
plaques sit on their roofs at 32% of each native image height; Arena uses 38%.
The Merchant plaque centres at 52% of its image box to follow the projected roof,
with only a minimum left-edge inset on narrow screens to keep its bronze ends visible.
At widths of at least 1024px and heights of at least 601px, planned-landmark badge
type grows from 16px to 24px and tavern type from 16px to 26px. Compact/short
landscape badges retain their smaller sizing to avoid covering the artwork or HUD.
They are disabled buttons announced as coming soon, matching the existing planned
HUD destinations. They do not open the game picker or introduce shop/quest logic,
hover tooltips, active glows or additional tab stops. Nameplates survive image
failure. The tavern remains the only playable landmark.

## Hover, motion and failure behavior

- The tavern uses a pointer cursor and a focus ring. Warm silhouette shadows and
  mild brightness interpolate over 1.4 seconds with ease-in-out, in both directions.
- Up to six tiny embers (four on compact devices) drift over seven-second cycles.
  They fade with the hover/focus state, do not catch pointer events, and animate
  only while hovered/focused and the tab is visible. Motion reduction or save-data
  removes them along with the optional mist enhancement. Reduced motion also
  removes the glow transition, retaining an immediate static focus/hover cue.
- The single lazy R3F canvas draws only mist. It never replaces or hides artwork.
  Initialization/shader/context-loss failure disables it until remount. Compact
  DPR is 1; desktop caps at 1.5. Hidden tabs stop rendering.
- Images have empty alt text, explicit dimensions, asynchronous decoding and no
  dragging. Failed images hide instead of showing broken-image icons. The CSS
  paving fails transparently; ground colors and the permanent tavern plaque keep
  the single Play entry usable. Only decorative layers are aria-hidden.
- Input opts in only on the tavern button, never on a full-screen scene overlay.
  The shared login/home atmosphere preference hook remains unchanged.

## Scope and validation

Castle, observatory, new modes and progression rules remain deferred; #99
stays open. This is an iterative art pass, not final art approval. The painted
tavern cannot be dynamically relit or viewed from another angle without new art.

Scene tests cover ordering, decorative semantics, image failure, the permanent
nameplate, compact/reduced-motion/hidden-tab ember behavior and renderer failure.
Home tests retain onboarding, deep links, every match format, Settings and dialog
focus restoration. Mocked canvas tests do not establish GPU quality.

Validation includes `pnpm check`, the full test suite, production build and
`git diff --check`, plus isolated Chromium checks at portrait, short landscape,
desktop and ultrawide sizes. Inspect floor edges, visible facade/HUD separation,
nameplate bounds, hover fade-in/out and click/keyboard behavior. Existing Three.js
deprecation/large-chunk warnings and physical-phone GPU/battery review remain.
