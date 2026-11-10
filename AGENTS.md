# UI implementation rules

- Use Tailwind utilities for component styling and responsive layouts wherever possible.
- Keep shared colours and theme decisions in `src/index.css`, using semantic global
  tokens in both light and dark appearances. Do not introduce a Home-only theme or
  duplicate a global palette inside component styles. Artwork-specific contrast
  tokens must also be global and reusable across illustrated screens.
- Keep reusable styled components in `src/components`, outside the generated
  shadcn/Base UI primitives in `src/components/ui`. Do not customise generated core
  files to implement game-specific visuals.
- Use the installed GSAP / `@gsap/react` tools for DOM animation and Three.js /
  React Three Fiber for scenes that need an actual 3D renderer. Do not build rich
  motion with CSS keyframes. Respect reduced motion, clean up animation contexts
  and listeners, and keep decorative effects out of the accessibility tree.
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
