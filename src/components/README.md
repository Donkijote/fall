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
| `hud/`        | `PlayerIdentity`, `ResourceReadout`, and `ContextStrip` present identity and status.                        |
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
