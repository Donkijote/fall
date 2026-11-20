# Native host

Fall's Tauri host packages the existing React app. Game rules and module
application code remain independent of Tauri. Native integrations belong here
and in `src/infrastructure/adapters/platform`; route effects live in
`src/infrastructure/ui/hooks`.

## Development and packages

Use `pnpm desktop`, `pnpm ios`, or `pnpm android`. Tauri's `beforeDevCommand`
starts Vite on port 3000 with browser opening disabled. Stop any separately
started web development server before these commands. `pnpm dev` remains the
browser-only workflow. Do not start an additional server alongside Tauri.

`pnpm exec tauri build` builds `dist` and packages local assets.
`pnpm exec tauri ios build` uses the generated Apple project. Neither release
package should require the development server. Store upload, production signing,
notarization, and release validation are separate steps; see the
[distribution investigation](../docs/design/platform-distribution/README.md).

## Configuration ownership

- `tauri.conf.json` reads the marketing version from `../package.json` (currently
  `0.2.0`). Keep Cargo's package version and the generated Apple project's
  `CFBundleShortVersionString` aligned when bumping it. Apple build numbers are
  separate: `bundle.iOS.bundleVersion` and `bundle.macOS.bundleVersion` start at
  `1`, matching `CFBundleVersion` in `project.yml` and `Info.plist`. Increment the
  build number for subsequent uploads of the same version.
- The minimums are iOS/iPadOS 17.0 and macOS 14.0. Keep the iOS floor aligned in
  the Tauri config, XcodeGen `project.yml`, Xcode project and Podfile. The macOS
  Tauri bundler sets its deployment target for package builds; Tauri ignores
  that setting during `tauri dev`.
- Desktop starts at 1280 × 720 logical pixels, centered, resizable, and windowed.
  `preventOverflow` fits the initial window to the monitor work area. No saved
  display preferences or fullscreen startup are implemented. This is an initial
  landscape size, not a desktop aspect-ratio lock during manual resizing.
- `gen/apple/project.yml` is the regeneration source for the generated Xcode
  project and plist. Preserve native changes in both the source and generated
  files. Status-bar hiding remains enabled. iPad requests full-screen operation
  for route orientation locking; system-controlled windowing on newer iPadOS
  still requires physical-device testing.

## macOS window chrome

The macOS window uses Tauri's `Overlay` title-bar style and `hiddenTitle` while
keeping `decorations: true`. AppKit owns the rounded frame and traffic-light
controls; the page artwork extends behind the title bar. Windows/Linux keep
their native chrome because those configuration fields are macOS-specific.
`trafficLightPosition: { x: 20, y: 22 }` adds left clearance and moves the
native buttons down to center them in the 40px strip. Tao’s vertical inset
positions the button container rather than the button center. The drag strip
begins at 88px to leave the buttons clear.

The macOS-only `window_chrome` host plugin injects a flag before the document
loads. The platform adapter reads that flag and the app composition enables the
shared `WindowDragRegion`, without guessing the OS from the user agent. The
transparent 2.5rem strip leaves the traffic-light area clear, exposes the native
drag region, and reserves space through the shared safe-area inset so page
controls are not placed underneath it. Its capability grants start-dragging only
to the macOS main window; double-click zoom uses the existing default permission.

Restart the Tauri host to pick up title-bar configuration. Check native rounded
corners, close/minimize/zoom, dragging and double-click zoom, then visit Login,
Hall and a match to confirm artwork continuity and unobstructed controls. These
interactions require a macOS runtime check; source tests alone do not validate
AppKit hit testing.

## iOS route orientation

Both phone and tablet plists declare portrait and the two landscape directions.
That is the set available to the app; the active controller narrows it per route.
Login (`/login`, including its trailing-slash form) permits portrait and both
landscape directions. All other routes request both landscape directions.
Returning to Login unlocks rotation without forcing a portrait transition.

`useNativeOrientation` observes committed router state and foreground visibility.
It serializes requests, skips superseded navigation, and cleans up subscriptions
on unmount. The adapter uses the supported Tauri `invoke` API; browser builds
have no native orientation side effects. The Rust command is a no-op on desktop
and Android; Android retains its existing static landscape policy.

On iOS, `orientation.rs` dispatches through Tauri's `with_webview` API to the UI
thread. `ios/orientation.mm` changes Tao's controller orientation mask and uses
iOS's supported orientation invalidation / scene geometry APIs. The custom
controller setter belongs to Tao, not Apple's private APIs. It is checked at
runtime; Tauri is pinned to 2.12.7 and Cargo.lock pins Tao to 0.37.3. Recheck this
bridge when upgrading the host. Synchronous host errors reach the caller; scene
geometry refusals are reported to the native console. A successful IPC response
means the policy was submitted, not that the OS completed rotation.

No document reload, match reset, or audio playback is triggered by this hook.
Web/PWA orientation enforcement is still a separate pending part of #140.

## Verification

The focused hook tests cover direct links, navigation away from and back to Login,
foregrounding, cleanup, StrictMode, request races, native errors, and browser
isolation. Router tests cover existing screens. Run:

```sh
pnpm exec vp test run src/infrastructure/ui/hooks/useNativeOrientation.test.tsx src/routes/Router.test.tsx
pnpm build
cargo check --manifest-path src-tauri/Cargo.toml --locked --offline
IPHONEOS_DEPLOYMENT_TARGET=17.0 cargo check --manifest-path src-tauri/Cargo.toml --locked --offline --target aarch64-apple-ios
```

These checks verify source and configuration, not device rotation or release
readiness. On an actual iPhone and iPad, test portrait Login, leaving Login while
holding portrait, both landscape directions, a direct match URL, returning to
Login, keyboard/safe areas, background/resume, and iPad windowing. Confirm match
state/audio continuity and inspect the native console for rejected geometry
requests. Desktop sizing needs Windows scaling and Linux work-area verification.
