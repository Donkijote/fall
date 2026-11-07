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
`living-town.css` owns anchors and grading. PNG masters are unchanged. All seven
WebP exports retain source dimensions/alpha, using quality 88, method 6, and total
about 712 KiB. Vite fingerprints them; the PNG masters are not emitted in the build.

| Layer                        | Source/export size | Placement                                                 |
| ---------------------------- | ------------------ | --------------------------------------------------------- |
| Sky                          | 1672 × 941         | Centered-cover backdrop                                   |
| Far mountains                | 2172 × 724         | Top 8%, width 108%, left -4%; hazed                       |
| Near mountains               | 2172 × 724         | Top 22%, same overscan; darker foothills                  |
| Static haze / optional mist  | Reference frame    | Behind the foreground                                     |
| Ground / plaza               | 1672 × 941         | One unrepeated image, feathered on all edges              |
| Tavern / contact shadow      | 1536 × 1024        | 32% of contained world width, mirrored inward             |
| Merchant / contact shadow    | 1536 × 1024        | Left -4.7%, bottom -8%, width 24%; in front of tavern     |
| Quest board / contact shadow | 1536 × 1024        | Visible right edge at 98% of stage, bottom -4%, width 25% |
| Atmosphere                   | Full stage         | Quiet perimeter, never over HTML HUD                      |

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
above the image bottom); horizontal feathering spans the stage, including ultrawide
screens. In portrait the apron ends at world dock clearance, under the tavern;
landscape lets it extend behind the dock. CSS ground color and the perimeter
falloff connect the apron to the surrounding terrain without hard strips. Ground
occlusion follows that same apron anchor, so raised narrow-screen placement does
not reveal distant mountains underneath the paving like a floating platform.

The former mirrored crop created visible alternating bands and was discarded.
`export-living-town-plaza.py` was only an offline tile-export helper, never runtime
code. It is removed because that tile is no longer used. Ordinary WebP export
does not require a project-specific script or new application dependency.

## Merchant and quest board

The supplied merchant and quest-board masters are integrated unchanged, with
native 3:2 proportions and the same restrained grading as the tavern. The smaller
merchant overlaps the tavern's lower-left facade, with its painted silhouette
at the left screen border rather than detached in the square. The noticeboard's
painted right edge follows the stage's right border with 2% breathing room, even
when the contained foreground world is narrower than an ultrawide screen.
Both sit slightly forward of the tavern. Their transparent image padding is
retained; contact shadows align to actual opaque foot positions, not image-box
bottoms (tavern 94.8%, merchant 91.7%, noticeboard 98.5% of image height).
Shadows stay short and scale their blur with the scene. The unrepeated floor spans
the full stage so both edge districts remain over paving. The middle stays open
for a future focal point, with the upper town reserved for later landmarks.

Both use permanent bronze nameplates, labelled **Merchant** and **Quests**.
These smaller plaques are centred over the stall's counter and noticeboard face,
not the roof line. The merchant plaque receives only a minimum left-edge inset
on narrow screens to keep the text and bronze ends visible.
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

Castle, arena, observatory, new modes and progression rules remain deferred; #99
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
