# Choice button

The selected choice uses a pressed oxblood wax surface inspired by the
[Leave Match parchment](../tavern-match/README.md). The
[standalone wax tile](../../../src/assets/ui/controls/choice-wax.webp) fills
the control behind the label or icon. Nine-slice scaling preserves the raised
corners as the label width changes. The surface tilts toward the pointer while
the content stays level. GSAP blends the previous and next selection states.
Keyboard focus shows a stationary preview and reduced motion uses immediate
state cues. Base UI owns selection and keyboard navigation.
