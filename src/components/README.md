# Shared components

Generated shadcn/Base UI components live in `ui/`. Reusable app presentation is
grouped by purpose beside that directory. Import public styled components from
`@/components`. Component internals use direct relative imports.

| Folder        | Responsibility                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `actions/`    | `ActionButton` owns primary, quiet, and outline actions.                                                    |
| `controls/`   | `ChoiceButton`, `TextInput`, and `SelectField` compose native value controls with the shared app treatment. |
| `cards/`      | `ActivityCard` owns illustrated activity selection, focus, fallback, and motion.                            |
| `navigation/` | `Navigation`, `NavigationButton`, and `NavigationGroup` keep both Hall docks consistent.                    |
| `surfaces/`   | `FramedCard`, `ModalContent`, and `PopoverPanel` share the brass frame in `surfaceStyles.ts`.               |
| `hud/`        | `PlayerIdentity` and `ResourceReadout` present identity and status.                                         |
| `icons/`      | `Icon` renders artwork masks and Lucide icons.                                                              |
| `ui/`         | Generated primitives own native accessibility and interaction defaults.                                     |

## Theme and shape

`src/index.css` owns the semantic palette and proportional radius scale.
The base radius stays at 0.625rem, with the original multipliers from sm through
4xl. Styled app components choose `rounded-md`, currently 8px, as their common
rectangular shape. This keeps the rest of the scale available when another role
needs a different radius. Generated primitives retain their own defaults.

`ActionButton` chooses its radius in its component definition. Framed surfaces
choose theirs in `surfaces/surfaceStyles.ts`. Joined navigation groups remove
only internal corners. Avatar circles, switches, and slider tracks retain shapes
that communicate their function. Features supply layout and size, and reuse the
appropriate styled component for presentation.

The global `--primary` and `--primary-foreground` tokens coordinate Login, Done,
sliders, and switches. The semantic `--ring` is lightened against dark surfaces
for visible focus. Brass trim uses the existing `--gold` token. Keep surface,
foreground, input, border, and focus roles aligned in both themes.

## Actions and selection

Use `ActionButton tone="primary"` for the main action, its quiet default for
secondary actions, and `tone="outline"` for outlined actions. `ChoiceButton`
uses a pressed wax surface for selected choices and a subdued preview on hover or
keyboard focus. It preserves the ToggleGroup keyboard and
selection behavior.

## Ownership and behavior

Keep generated files suitable for regeneration. Add or extend a styled component
when presentation should be reused, with a descriptive name and purpose-based
folder. Preserve refs, labels, disabled state, focus, keyboard, touch, and
dismissal behavior. Co-locate component tests and any necessary stylesheet using
the component's own name.

Use GSAP for DOM motion and honor both the stored and device reduced-motion
preference. Clean up animation contexts and listeners. Decorative artwork stays
outside the accessibility tree and never intercepts input.

## Artwork and interaction behavior

`ResourceReadout` mounts live balances in the existing ActionButton outline skin;
compact portrait layouts stack the glyph and value while wider layouts use a row.
Its decorative size container scales intact end strips with the readout height
rather than using a fixed end width or cutting seams through the face. The
minimum compact width and padding keep the ornaments clear of the value. It
is a native resource-action button, with the full balance in its accessible name
and an optional activation handler for the future resource screens.
`BrassCheckbox` composes Base UI directly, using the approved input frame and
ChoiceButton wax. It preserves the hidden native input, controlled values, refs,
form submission, disabled state, and Space-key selection. Generated `ui/` files
remain unchanged.

`GuideLink` owns the shared leather bookmark and GSAP hover/current-page reveal
for guide links, chapter navigation, and search results. The feature supplies the
destination and content. It responds immediately with reduced motion and uses
semantic ink at rest, artwork foreground over the revealed leather, and explicit
artwork ink when displayed over a scene. `NumberMedallion` reuses the captured-card
bonus coin for unit-free step numbers. `EmptyCardSlot` uses the approved input
artwork as a quiet empty recess, with labeling left to the containing card pile.

The gallery includes isolated previews for these components plus DeclarationBadge,
PointsBadge, PlayerPortrait, and ParchmentFigure. Runtime art stays at its canonical
source rather than being duplicated for these compositions.

ActionButton and ResourceReadout share `surfaces/useBorderGlint`: one random
highlight position per mount. Actions retain their subtle intensity variation;
resource buttons opt into a 3.2s orbit around the outline's actual beveled rim
while hovered or keyboard-focused. It pauses at its current point and resumes
that same lap. Resize preserves the lap phase, touch does not synthesize hover,
and reduced motion uses a static light. GSAP contexts, resize observers and
interaction listeners clean up on unmount. NumberMedallion offsets serif digits optically within the coin.

GuideLink keyboard focus reveals its brass-edged bookmark artwork without an
additional colored outline; forced-colors mode retains a system outline.

## Motion inventory — GHI #124

Use 240–380ms `power2.out` for state arrivals/releases and 280–360ms for brass
attention (`sine.inOut` where an existing reversible timeline owns the effect).
Long ambient loops remain decorative and stop under reduced motion. State
changes must remain readable immediately when motion is reduced. Extend each
owner below instead of adding competing transforms. No new idle motion is needed.

| Interaction                                    | Existing owner and decision                                                                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Login arrival and atmosphere                   | `LoginScreen`, `LoginAtmosphere`: retain coordinated arrival and WebGL fade.                                                                                                                                 |
| Card Hall background and activity attention    | `CardHall`, `ActivityCard`: retain parallax/sway; strengthen available frame and reflection, shorten attention arrival.                                                                                      |
| Settings, onboarding and confirmation dialogs  | `ModalContent`: retain shared fade/4px entry and native dismissal/focus restoration. No delayed close orchestration added.                                                                                   |
| Help/menu popover                              | `PopoverPanel`: retain short entry and native immediate dismissal.                                                                                                                                           |
| Shared actions and guide links                 | `ActionButton`, `GuideLink`: retain existing reveal owners.                                                                                                                                                  |
| Choices, text focus and select menus/options   | `BrassCheckbox`, `TextInput`, `SelectField`: retain wax press, input light and option reveal. Sliders/switches keep immediate value cues.                                                                    |
| Tavern room entry, dismissal and table travel  | `useTavernMotion`, `useMatchTravel`: retain coordinated travel; do not replay an overlay entry on top.                                                                                                       |
| Tavern format hover/focus/touch selection      | `useTavernCardMotion`: increase frame light, shorten lift/settle; reuse its reversible attention timeline.                                                                                                   |
| Current-turn ring                              | `PlayerPortrait` / `usePortraitTurnMotion`: orbit-led 650ms draw/wipe of the bright rim, then the existing 1.9s orbit; interruptions retrace the current arc, reduced motion uses a complete immediate ring. |
| How to Play chapter/disclosure navigation      | `useArticleMotion`, `GuideLink`: retain chapter entry and current-page reveal; keep disclosure state immediate.                                                                                              |
| Sings search, filters, lists and empty results | `useSingsFilterMotion`: retain outgoing clones, list reflow and incoming results; no second list animation. Empty-state content stays immediate/readable.                                                    |
| Loading and empty handoffs                     | Keep existing readable placeholders/statuses; no artificial delay or idle control animation.                                                                                                                 |

Shared previews use the live ActivityCard, ModalContent, PopoverPanel and resource
readouts. PlayerPortrait now has a manual turn toggle for repeated interruption
and preference changes. Tavern's module gallery retains the real picker/cards.

Focused automated coverage exercises ring/head alignment, orbital release, interrupted draws/wipes, completed-exit reactivation, preference changes during arrival, and unmount cleanup. Existing feature tests cover activity navigation,
touch selection and dialog semantics. A visual pass on desktop, phone portrait
and landscape, both themes and physical touch remains required before acceptance;
unit tests do not establish artwork quality or device layout. Score-award travel
and winner celebrations remain owned by #127 and #128.

## HUD action preparation and cursor policy — GHI #124

`ProfileButton` owns native profile activation, pointer/focus cues and portrait
attention; `PlayerIdentity.onProfileClick` supplies its future destination.
`ResourceReadout.onClick` supplies each future resource destination. These optional
callbacks do not yet open new screens or mutate balances. Native Enter/Space,
focus outlines and accessible resource amounts are present now. The gallery
renders both controls directly and through the real HUD.

`PlayerPortrait.attention` drives only the existing glint owner, without drawing
a turn rim. A turn indicator takes priority over hover attention. Reduced motion
keeps a static highlight. Shared primitives under `ui/` remain unchanged.

The global base layer uses an arrow cursor and nonselectable static interface
text, including titles and modal copy. Text inputs, textareas and editable
content explicitly retain selection and text cursors. Links, buttons and native
disclosures retain pointer feedback; slider thumbs retain their grab cursor.

## State changes and surface lifecycle

`MotionDialog` pairs with `ModalContent`, and `MotionPopover` pairs with
`PopoverPanel`. These roots use a 320ms entry and defer Base UI unmounting for a 260ms GSAP exit,
including controlled closes, and cancel that exit when reopened. The shared
backdrop and popover unconditionally override inherited primitive CSS animation
and transition utilities, keeping GSAP the sole fade owner in every state. Native focus,
Escape and outside dismissal remain owned by Base UI. Tavern travel keeps its
existing orchestration. Keep surface children mounted through closing.

`ResourceReadout` briefly brightens changed amounts without delaying accessible
values. `PlayerIdentity` delegates XP to `ExperienceMeter`: gains advance over 750ms,
with forty brighter sparks emitted from the live leading edge and a short trailing fade. Level-up fills
the old bar over 450ms before progressing from zero in the next level; interrupted
gains continue from their displayed position. Accessible values update immediately.
The crest lights once on level-up. Hovering the identity copy or portrait brightens
the brass rim and nameplate; keyboard profile focus receives the same shine. Neither replays on an unchanged
render. Navigation extends the existing action reveal with one outer-frame light
pass. `BronzeSlider` adds a 160ms decorative halo on committed changes; native
values and callbacks remain immediate. All effects honor reduced motion.

## Native artwork interactions

Global base styles disable mobile artwork callouts, artwork selection and native
image dragging. `useAssetInteractions` mounts once with the router and cancels native
artwork context menus and drag starts, including lazy-loaded assets and portal
content. Image, picture, SVG, canvas, video, object and embed elements share this
policy; future assets inherit it automatically. The portrait also explicitly opts
out of native dragging. Taps, keyboard activation, scrolling and pinch gestures
remain native. Inputs, textareas and editable content retain their editing menus.
