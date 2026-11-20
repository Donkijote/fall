# Tavern picker

Landscape presentation (#137): use the small landscape layout as the unprefixed Tailwind base and standard width breakpoints for larger layouts. There are no portrait layout branches or compact-orientation variants. See [the supported viewport policy](../../../docs/design/README.md#supported-viewport-policy) for verification targets. Orientation enforcement is deferred to #140; historical portrait reviews below do not imply current support.

`index.ts` exports `TavernPicker`. Home supplies the Tavern button used for
the Hall entrance animation. The legacy bottom navigation can open the same
picker without a zoom origin. The `bottomSidebar` query opens the picker
after local onboarding.

Mouse and keyboard activate formats directly. Touch previews a format on
the first tap and activates it on the second. `useTavernMotion` handles travel
between the Hall and the Tavern. `useMatchTravel` fades the mode cards before navigation. The match screen
crossfades between the Tavern and table artwork. On return, the mode cards
fade back in over the Tavern artwork. Reduced motion
skips the animation.

The [match module](../match/README.md) owns the table and waiting state.
See the [picker design notes](../../../docs/design/tavern/README.md).
The Home and legacy navigation tests cover entry and dismissal.

The module entry point also exports `tavernGallery` for the development-only
Component gallery. Preview fixtures live under `ui/components/previews` and
render this module’s styled components with sample props.
