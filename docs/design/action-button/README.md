# Action button

The [Card Hall detailed mockup](../home-lobby/mockup-detailed.png) and supplied
Continue Campaign close-up guided the standalone, text-free primary and outline
skins. The primary skin has an oxblood face and aged brass. Outline uses a
charcoal face with a quieter rim. The quiet tone reveals the outline skin from
the center outward on hover, keyboard focus, or expansion and retracts it when
idle. Disabled actions dim their current tone. Icon-only actions reveal a
tapered brass engraving with a central diamond below the icon. Both effects
respect reduced motion.

The [runtime exports](../../../src/assets/ui/actions) are transparent WebP
images. ActionButton uses three full-height slices to keep the end ornaments and
bevel intact while the label determines the width. React renders the text and
icons and the button keeps its native focus and interaction behavior.
