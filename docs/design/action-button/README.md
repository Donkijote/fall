# Action button

The [Card Hall detailed mockup](../home-lobby/mockup-detailed.png) and supplied
Continue Campaign close-up guided the standalone, text-free primary and outline
skins. The primary skin has an oxblood face and aged brass. Outline uses a
charcoal face with a quieter rim. The quiet tone reveals the outline skin on
hover or expansion. Disabled actions dim their current tone. Icon-only actions
use a borderless hover surface.

The [runtime exports](../../../src/assets/ui/actions) are transparent WebP
images. ActionButton uses nine-slice scaling to keep the end ornaments and
bevel intact while the label determines the width. React renders the text and
icons and the button keeps its native focus and interaction behavior.
