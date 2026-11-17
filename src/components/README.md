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

## Artwork audit follow-up

`ResourceReadout` mounts live balances in the existing ActionButton outline skin;
compact portrait layouts stack the glyph and value while wider layouts use a row.
It remains a noninteractive status group, with full amounts in its accessible text.
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
highlight position per mount, a continuously visible light that varies subtly in
intensity, and a static highlight under reduced motion. GSAP contexts clean up
on unmount. NumberMedallion offsets serif digits optically within the coin.

GuideLink keyboard focus reveals its brass-edged bookmark artwork without an
additional colored outline; forced-colors mode retains a system outline.
