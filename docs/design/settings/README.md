# Card Hall Settings

The [simplified mockup](mockup-simplified.png) guides the live Settings dialog.
The [detailed mockup](mockup-detailed.png) compares a richer material treatment
using the same layout. Both were composed in the browser over the running Hall.
The [prompt manifest](prompts.json) contains reusable briefs reconstructed from
the approved mockups.

Settings shares the [Card Hall background master](../home-lobby/background.png).
The dialog dims the live lobby behind it, including the viewport-specific Hall
painting, activity cards and HUD. It has no separate background asset.

Keep the header and actions visible while the body scrolls. Appearance, card
volume and mute, motion preference, Reset, and Credits & licenses are available.
The Animation Playground is development only. Help owns How to Play and Sings;
identity owns account actions; the Tavern picker owns match setup. The mockups
show some proposed preferences beyond the current controls.

See the [Home module](../../../src/modules/home/README.md) for the live dialog
and preference behavior. Check both themes, short and narrow viewports, and
keyboard dismissal and focus return to the gear when iterating.

The audio controls share a standalone brass and red wax thumb. Each has its
own illustrated blackened-iron track with a bronze rim. The volume rail scales
through the middle to preserve its ends, and the mute track gains an oxblood
tint when muted. The live controls also appear in the component
gallery.

The red fills use alpha masks traced from the painted channels. The slider mask
uses the same end slices as the rail so the curves stay aligned at different
widths.
