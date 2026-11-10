# Card Hall Settings

Design exploration for [issue #104](https://github.com/Donkijote/fall/issues/104). The next pass can implement and test the selected design.

## Reference study

Reviewed the 15 stills and sampled the 7.65-second Frostpunk transition at four frames per second. The source captures live in the local `inspirations/settings` folder. Motion observations apply to the Frostpunk clip.

| Game | Observed layout and interaction cues | Implication for Fall |
| --- | --- | --- |
| Anno 1800 | A full-screen Options surface layers dense, often two-column control grids over harbor artwork. Tabs organize gameplay, graphics, audio and controls. Bright value fields separate editable values from their labels. | Borrow alignment and strong label/value contrast. Two columns and category tabs would make a single preference harder to find. |
| Armello | Controller bindings appear in two columns over a dimmed game board, with Back and Apply Changes anchored to opposing corners. | Keep a return action in a stable position. A staged apply flow makes sense for batches of bindings. Appearance can save immediately. |
| Frostpunk | A compact left-hand settings block with horizontal tabs shares the screen with large character art. The clip shows the central menu replaced by the left settings block while the illustrated background pans and snow continues, then the composition reverses on Back. | Keep the scene continuous while changing UI layers. A stationary Hall and short dialog entrance provide the same sense of place with much less visual movement. |
| Gwent | An opaque framed surface sits over a darkened scene. A left rail highlights the active category in gold and includes Credits and Privacy Policy. The right side uses aligned rows and controls, and the bottom holds exit and settings actions. | Use warm framed surfaces and a distinct selected state. Move to a navigation rail only when several meaningful categories exist. |
| Legends of Runeterra mobile | Landscape options overlay the recognizable lobby. A vertical rail changes the content pane and a persistent footer holds support and Done. Audio uses sliders, while sparse pages leave much of the pane empty. | Keep the lobby visible and the exit stable. Use a grouped list while the settings set is small. |

## Two concepts

Both were generated with the built-in ImageGen tool. The [generation prompts](prompts.json) describe the visual references and intended labels. These are design masters. Live artwork and controls should remain separate.

- [Simplified](settings-simple.png) uses one centered column, a single brass frame, and flat grouped rows. This is the implementation recommendation. It fits the current scope and can use the existing Hall and dialog components.
- [Detailed](settings-detailed.png) uses a wider split panel with illustrated cards and a lantern. It explores how far Settings can carry the login art direction. It renders About as an extra interactive row. Use About as a section heading above Credits & licenses, as in the simplified concept. Both images are dark-theme landscape studies. The background HUD and artwork are illustrative.

## Settings and adjacent destinations

| Item | Placement and behavior |
| --- | --- |
| Appearance | **Preferences.** Keep persisted appearance switching for #104. The current button flips the resolved theme, while the app provider already supports Light, Dark and System and defaults to System. Use the stored preference to mark the selected option, with System resolving against the device. Keep the existing storage key. Dark can lead the artwork and mockups. Dark-only would remove a supported preference and would need a separate product decision and an assessment of the light theme’s accessibility value. |
| How to play and Sings reference | **Help shortcuts for #104.** Keep both existing routes reachable from the Hub Settings dialog. Longer term, put both under a visible Hub Help entry and surface How to play near first play. Keep the in-match Sings lookup for quick reference. Once the new Help entry is established, the shortcuts can move out of Settings. |
| Credits & licenses | **About.** Open a dedicated, scrollable view with a Back action to Settings. Carry the existing Game-icons.net author names, recolor note, source link and CC BY 3.0 license into it. Group future attributions by source. |
| Animation playground | **Developer tools** after About, gated by the existing development condition. Keep the route in #104. A future dev tools launcher can own it if developer tools grow. |
| Profile and account | Put display name, avatar and account actions under the Hub player identity when those features are available. Keep per-match choices such as formats and bots in the play flow. |

## Future preferences

| Candidate | When it earns a row |
| --- | --- |
| Language | Add once game UI, rules, and Sings reference are localized together. Start with English and Spanish as candidates, use self-named languages, and persist the player's choice. |
| Reduced motion | Honor the OS setting first. Consider an in-game System / Reduced choice once motion spans enough of the app to warrant an override. Keep the selected state and focus cues visible without animation. |
| Audio | Add mute and master volume when the game actually ships audio. Split music and effects when both exist and players benefit from independent control. |
| Card and text readability | Evaluate larger table labels, card rank/suit legibility and higher-contrast indicators after testing gameplay across themes and screen sizes. Prefer cues that combine shapes or text with color. |
| Gameplay assistance | Consider replaying onboarding, optional contextual hints and confirmation for consequential moves when those features exist. Keep rules and match-format changes in the relevant play flow. |
| Notifications and privacy | Add notification controls after introducing notifications. Place account privacy or data controls with the account that owns them when the relevant features exist. |

## Responsive and interaction specification

- Use one modal entered from the existing Hub gear. Center it on wide screens. In portrait use an inset near-full-width sheet with the same group order. For short landscape use a safe-area-constrained height, a scrollable body, and a visible header and exit action. Give interactive rows and close controls at least 44px hit areas. Let the appearance choices wrap or stack on narrow widths and allow labels to grow.
- Use Cinzel for the display title, Spline Sans for functional text, shadcn semantic surfaces and foregrounds for both themes, and the shared gold trim sparingly. A filled marker distinguishes the selected appearance option independently of its color.
- Give appearance changes immediate effect and persistence. Done, the close control and Escape dismiss the modal. Keep the existing backdrop dismissal behavior. Trap keyboard focus while open and restore it to the gear on dismissal. In the Credits subview, Back restores focus to the Credits row. A guide route should focus its destination and offer a return to the Hub.
- Use GSAP for an approximately 180ms scrim fade and a small panel lift, with a shorter exit. Keep the background stationary. Respect reduced motion, clean up GSAP contexts, and disable inherited primitive transitions. Treat art as decorative and keep it out of the accessibility tree.
- Implementation verification should cover keyboard navigation, dismissal and focus restoration, touch, theme persistence and System behavior, readable contrast, production gating, attribution links, long labels, and scroll access at phone and short-landscape sizes. Reuse port 3000 for visual checks.
