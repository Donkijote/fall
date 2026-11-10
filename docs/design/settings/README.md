# Card Hall Settings

Design draft for [issue #104](https://github.com/Donkijote/fall/issues/104). Settings owns persistent player preferences. Help owns rules and lookups.

## Mockups

All three images were captured at 1600 × 900 over the existing Card Hall on port 3000. The study panels were composed in the browser for these captures. The Hall painting, activity cards, HUD, emblem, and typography come from the running project. Settings adds a scrim over the Hall, while Help leaves the Hall unobscured. The original artwork and app code are intact.

| Study | What it shows |
| --- | --- |
| [Simplified Settings](settings-simple.png) | The flat treatment of General, Audio, and Accessibility, with quiet borders and a compact title. |
| [Detailed Settings](settings-detailed.png) | The same controls and section order with an engraved brass frame, textured charcoal, recessed controls, and a framed red action. The ornament draws on [the detailed login](../main-menu-research/image-concepts/login-detailed.png) and [the detailed Hall study](../main-menu-research/image-concepts/card-hall-background-2.png). |
| [Hub Help](hub-help.png) | A Help entry next to the gear, in the slot currently occupied by the disabled Messages shortcut. The open panel shows two links with short descriptions. |

Both Settings images use the expanded preference set to compare visual style. The #104 release scope still starts with Appearance and Credits & licenses, with the Animation Playground available in development.

## Game reference study

Reviewed the 15 stills and sampled the 7.65-second Frostpunk clip at four frames per second from the local `inspirations/settings` folder. The stills show layout and control states. The clip shows the transition behavior.

| Reference | What the capture shows | Decision for Fall |
| --- | --- | --- |
| **Anno 1800** | The harbor is visible behind a full-screen Options surface. Audio, controls, gameplay and graphics divide dense forms into horizontal tabs. Light value fields give controls a clear edge against darker rows. | Borrow aligned rows and visible inputs for the expanded design. Keep a single-column modal for the current settings count. |
| **Armello** | Controller bindings use two columns over a dim board. Back and Apply Changes anchor opposite corners. The content is specific to the input device. | Preserve a stable exit position. Consider device-specific bindings only after Fall has meaningful controller actions to remap. Theme changes can take effect immediately. |
| **Frostpunk** | The centered main menu gives way to a left-aligned settings panel, with a horizontal tab strip and large character art on the right. The scene pans under the UI and snow continues across both states. Back reverses the move. | Preserve the same scene across entry and exit. Keep the Hall stationary and animate the scrim and panel briefly so Settings feels connected to the gear. |
| **Gwent** | An opaque, framed surface over a dim background uses a vertical rail and a strong gold selected state. Credits and Privacy Policy share the navigation rail with options. | Borrow the clear selection marker and framed surface. Keep Credits accessible from a small footer link. Add a category rail only when multiple groups are long enough to need one. |
| **Legends of Runeterra mobile** | The landscape options overlay leaves the lobby recognizable. A vertical rail switches sparse panels. A persistent footer separates support and sign-out from Done. | Keep the lobby recognizable and Done in a predictable location. Use a separate Help entry for player guidance and keep account actions with identity. |

## Where each item belongs

| Item | Destination | Rationale and behavior |
| --- | --- | --- |
| **Appearance** | **Settings** | A persistent, device-local preference. Offer Light, Dark and System. The provider already supports System and defaults to it. Use the saved choice for the selected marker and preserve the existing `fall-theme` key. Dark is the mockup presentation. A dark-only product direction would require changing #104’s appearance requirement and evaluating readability for players who use light mode. |
| **How to play** | **Hub → Help**, with a contextual shortcut in the Tavern play picker | Learning the rules is a task players do before a match. Keep the existing `/rules` route and make it accessible even before the player starts a match. |
| **Sings reference** | **Hub → Help**, plus the existing in-match lookup | This is a lookup players may need both before and during play. Keep the searchable `/sings` route in Help and retain the existing View sings modal during a match. Keep the rules page’s explanation of Sings for players learning the game. |
| **Credits & licenses** | **Settings footer → Credits & licenses** | About is app-wide information. One low-emphasis link gives it a predictable home without adding a category. Preserve the icon authors, recolor note, source and CC BY 3.0 link. The credits view returns to the Settings footer link. |
| **Animation playground** | **Development-only Settings footer action** | Preserve #104’s existing access and development gate. A separate dev launcher makes sense if more tools arrive. The production footer in the mockups shows the player-facing actions. |
| **Display name, avatar, sign-in and account data** | **Player identity** | Personal and account details belong with the player badge once editable. If cloud sync becomes a feature, place sync status and data management here. |
| **Match format, opponents, bots and difficulty** | **Tavern play picker** | These choices describe the next match. A future remember-last-selection preference could be automatic, with the actual match choices still shown at setup. |

Move both guide links when the new Help entry ships, in the same change. Issue #104 requires the Hub to retain access to both destinations. If the issue owner interprets that as requiring access from inside Settings specifically, record the placement change on the issue before implementation. If the project later activates Messages, allocate its own dock slot at widths that fit and use a labeled Utilities overflow in compact layouts if needed.

## Candidate preferences

| Priority | Preference | Design and dependency |
| --- | --- | --- |
| **#104** | Appearance | Show Light, Dark and System as a single choice group. Apply immediately and keep the same storage key. |
| **Next** | Card sound volume and mute | The production game already plays a sound when a card is played. The deal sound exists in the development playground. Start with one card-effects channel and remember the last nonzero level independently of mute. Add a separate music control if music ships. |
| **Next** | Reduced motion | Honor the device preference. A future System / Reduced control could suppress nonessential Hall, login and table effects. Keep essential card movement outcomes and turn cues legible when decorative motion is reduced. |
| **Next, after table testing** | Card readability | Try larger rank and suit marks first. Evaluate high-contrast selection and turn indicators with combined shape, text and color. Test in the light theme and on a short landscape phone before committing to a toggle. |
| **When localized** | Language | Offer System plus supported languages by their own names, such as English and Español if both ship. Translate rules, Sings, and game terminology together, with a consistent glossary for Caída and Cantos. |
| **When teaching features ship** | Hints and confirmation | Let players choose contextual hints or confirm consequential actions if testing finds accidental plays. Put Replay tutorial in Help as an action. Keep turn legality and scoring rules fixed for everyone in a match. |
| **When input support grows** | Keyboard shortcuts and controller bindings | Put the shortcut reference in Help. Add remapping to Settings after there are enough supported actions and a way to detect conflicts and restore defaults. |
| **When effects warrant it** | Performance | Consider reduced scene effects or lower render quality if measurements show the Hall or table effects cause slowdowns. Keep adaptive defaults and avoid a desktop-style resolution menu for a responsive web game. |
| **When online features ship** | Notifications and social visibility | Allow opt-in by notification type once those events exist. Keep profile visibility, account privacy and cloud data controls with the player account. |

Expose only implemented controls. Both Settings studies show a plausible first expansion. Keep later ideas in the backlog until the corresponding features exist or user testing establishes a need.

## Layout, motion, and acceptance

- Use a centered dialog over the existing Hall on desktop. On portrait use a near-full-width inset sheet. In short landscape constrain the height to the safe area, scroll the content, and keep the close action visible. Use 44px minimum targets and let controls stack when copy wraps.
- Reuse Card Hall’s Cinzel and Spline Sans typography, the shared gold trim, and semantic surfaces, foregrounds, and focus rings in both themes. Use a sun, moon and monitor for Light, Dark and System. Give each icon an accessible name and a label on hover and keyboard focus. Combine a filled glyph and a visible border for the selected choice.
- Use the existing dialog primitives for modal focus and dismissal. Restore focus to the gear after Done, Close, Escape, or backdrop dismissal. The Help trigger toggles its panel. Escape dismisses it and returns focus to the trigger. Use an inset panel when the anchored layout will not fit. Focus the guide heading on navigation and give direct visits an explicit return to the Hall.
- Use GSAP for a short scrim fade and small panel lift, around 160–180ms. Reduced motion applies the final states immediately. Keep underlying Hall motion stationary while Settings is open, disable inherited primitive transitions, and clean up the GSAP context. Treat the Hall art as decorative.
- During implementation, verify both themes and System persistence, keyboard focus and dismissal, the Help and guide return paths, in-match Sings access, attributions, development-only gating, and scroll reachability at 320px portrait and 568×320 landscape. The images are desktop design studies.
