# UI implementation rules

- Use Tailwind utilities for component styling and responsive layouts wherever possible.
- Start with the existing shadcn semantic colour tokens in `src/index.css`.
  Use their matching foregrounds, borders, inputs, and focus rings in both
  themes. Keep the shadcn token names and OKLCH values or semantic aliases.
  Use Tailwind palette utilities for one-off decorative colours. Add a global
  token only for a distinct, reusable role across features, such as the shared
  gold trim or artwork contrast. Give it a semantic name and define it in
  OKLCH. Avoid component palettes, raw hex UI colours, and duplicate tokens.
- Keep reusable styled components in `src/components`, outside the generated
  shadcn/Base UI primitives in `src/components/ui`. Do not customise generated core
  files to implement game-specific visuals.
- Preserve the proportional shadcn radius scale in `src/index.css`. Reusable
  styled components choose a named radius utility for their role. App controls
  and framed surfaces currently use `rounded-md` (8px). Other scale values remain
  available for future roles. Keep circles and pills for avatars, switches, and
  slider tracks. Joined controls square only their interior corners.
- Keep generated shadcn primitives unchanged. Organize reusable presentation
  under `src/components` by purpose: actions, controls, cards, navigation,
  surfaces, hud, and icons. Use descriptive names without a Game prefix.
  ActionButton owns app actions, NavigationButton/NavigationGroup own the docks,
  and FramedCard/ModalContent/PopoverPanel share the brass frame from
  `surfaces/surfaceStyles.ts`. Preserve native focus, dismissal, refs, keyboard,
  and touch behavior.
- Use the global primary token for action and value colors. Do not darken primary
  buttons locally or invent another frame, corner radius, or palette in a feature.
  Feature classes own layout and sizing. Update the shared token or styled component
  when a change should apply throughout the app.
- Use GSAP / `@gsap/react` for all DOM motion, Three.js or React Three Fiber for
  rendered scenes, and Three Quarks for 3D particle effects. This applies to
  simple fades and hover or focus motion as well as complex game sequences.
  Tailwind and CSS are for static styling, layout, and immediate state cues.
  Do not animate with CSS transitions, CSS keyframes, or Tailwind animation
  utilities. Disable inherited primitive transitions in features that adopt
  this guidance. Respect reduced motion, clean up animation contexts and
  listeners, and keep decorative effects out of the accessibility tree.
- Only add custom CSS when utilities cannot reasonably express the requirement.
  Name that stylesheet exactly after its owning component, e.g. `HomeLobby.css`
  for `HomeLobby.tsx`. Do not accumulate shared component styling in a generic CSS file.
- Name tests after the component or module under test, e.g. `HomeLobby.test.tsx`.
  Each test file owns one component or module; do not bundle unrelated component
  tests. Feature integration tests may exercise their composed dependencies.
- Runtime artwork belongs under `src/assets`. Files in `docs/design` are reference
  masters only; export optimised runtime assets rather than importing from docs.
- The user already runs the app on port 3000. Reuse it; do not start another server.
- Preserve manual edits and deletions. Do not commit or push without a request.
