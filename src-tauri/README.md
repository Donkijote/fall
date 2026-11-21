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
Web/PWA orientation enforcement remains a separate follow-up outside the narrowed
Apple-only #140; Android orientation and validation belong to #149.

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

## iOS safe areas

`initializeNativeSafeArea` in the platform adapter starts the `observe_safe_area`
command once per document. On iOS it attaches a passive, non-interactive
`FallSafeAreaObserver` to the WKWebView. UIKit layout and safe-area callbacks
publish the current safe rectangle in web-view coordinates to
`--native-safe-area-{top,right,bottom,left}`. Reloads reuse the observer and
republish the values. The observer follows the web view's lifetime, with a weak
reference back to it; it does not install timers or intercept touches.

The physical iPhone exposed a native-host mismatch: after the route requested
landscape, both the Tauri window and WKWebView could retain portrait insets
(top/left/bottom/right 62/0/34/0), despite landscape scene geometry and an
874 × 402-point window. Reading the main window alone therefore did not fix it.
When a phone has this specific mismatch, the observer creates a transparent,
non-interactive reference window in the same scene to obtain UIKit's current
safe rectangle. It sits below the app, never becomes key, and is owned by the
observer. Its layout callbacks keep the reference current, including return to
portrait Login. No device dimensions are hardcoded in the implementation.

The global `--safe-area-*` properties prefer these native values and fall back
to CSS `env()` in browsers and other hosts. The Hall's existing header, footer,
and stage spacing consume those shared properties; its merged `develop` layout
is unchanged. Artwork stays full bleed. The macOS title-bar inset still combines
with the shared top property. The legacy bottom navigation also consumes the
shared left/right/bottom properties.

Verification on 2026-11-20:

- A temporary WKWebView harness compiled the production `safe_area.mm` for an
  iPhone 18 Pro Max simulator (iOS 27.0). Both landscapes, document replacement,
  return to portrait, and an already-inset web view passed. A second harness
  deliberately kept the host window's safe insets and layout guide in portrait
  while rotating the scene, reproducing the physical failure. The reference
  window still supplied landscape insets 0/62/20/62; portrait returned to
  62/0/34/0, and an already-inset web view received zero extra inset.
- The rebuilt Fall app on the connected physical iPhone (iOS 27.2.1 as reported
  by CoreDevice, viewport 874 × 402 CSS pixels) published top/left/bottom/right
  0/62/20/62. A read-only WKWebView inspection confirmed actual Hall header
  padding top 4px, left/right 68px, and footer padding left/right 68px, bottom
  22px. The owner confirmed the current appearance. The app was detached from
  the debugger and left running.
- The Objective-C++ implementation compiled against the device SDK with the
  iOS 17 deployment target and warnings treated as errors.

These measurements verify native-to-CSS propagation and the Hall's computed
layout. Visual/touch sign-off on both physical landscape directions, Login
keyboard behavior, and background/resume remain part of the broader #140
interaction checks; simulator rotation does not replace those checks.

## macOS validation evidence (#140)

The 2026-11-21 macOS pass built a standalone arm64 app and unsigned headless DMG,
checked packaged route reloads and offline resources, and measured the live
renderer with an opt-in capture fixture. The 30-repetition samples passed the
proposed frame-scheduling threshold. The initial soak was interrupted by screen
lock at 18m27s. A later owner-assisted foreground run completed 20m00.8s with
384 measured captures, nominal thermal state, and host+WebContent RSS sampling
(337.9MiB peak, 325.5MiB final). It used the 100Hz external display at DPR 1;
GPU memory remains unmeasured. The owner subsequently verified native controls,
focus/Escape, themes, readable enlarged text, reduced-motion preference handling,
audible playback/output changes, mute/volume and ordinary minimizing/hiding or
switching away. In-game reduced-motion presentation needs a separate improvement.
VoiceOver and comprehensive keyboard-only coverage are excluded from this scope
by owner decision. Controlled lifecycle/context-loss and release-signing work
remain separate; see the canonical report for evidence limits.

The offline check found a remote-font dependency; Cinzel and Spline Sans are now
bundled with the existing OFL notices. A fresh-store HTTP/HTTPS-blocked resource
check of the rebuilt app loaded both families and Hall artwork without errors.
See the [measured report](../docs/design/platform-distribution/README.md#macos-validation-pass-140-2026-11-21)
for results, measurement limits, retesting instructions and remaining manual
checks. Machine-specific scripts and raw JSON reports are local only, excluded
from Git; they are not required to build the app.
Never distribute an app built with `VITE_PACKAGING_SPIKE=1`.

## Physical iOS packaging validation (#140)

On 2026-11-21, an optimized developer-signed standalone build passed the capture
fixture on a physical iPhone 17 Pro/iOS 27.2.1: 20m01s, 383 measured captures,
17ms frame-interval median/p95 and no measured intervals above 33.3ms. The initial
ice warmup separately had a 121ms interval. Three reports were UIKit
foreground-inactive during audio checks, while WebKit remained visible and
drawing; the detailed report preserves that condition. Thermal state was nominal.
Thirty launches/reloads, local route reloads and a fresh-store HTTP/HTTPS-blocked
resource check passed. Launch timing starts at the diagnostic native constructor,
not the OS launch request. Host RSS excludes WebContent/GPU memory.

The owner verified Login keyboard/orientation/safe areas and audible synchronized
speaker playback after disabling iPhone Silent Mode. In the restored normal app,
the owner also verified touch/local match, menus/settings, mute/volume, a roughly
30-second background return and lock/unlock: state, animations and audio stayed
correct, without freezing or duplicate playback. The normal
non-instrumented app was rebuilt and restored afterward. The optional
`manual=1` fixture parameter starts after a touch for mobile audio unlock. Native
probe code, scripts, raw JSON and temporary linker settings remain local only.
See the [iOS report and retesting protocol](../docs/design/platform-distribution/README.md#ios-validation-pass-140-2026-11-21)
for exact measurement scope, remaining gaps and local harness reconstruction.

## Apple-only validation follow-up (#140)

Windows/Linux/Android execution moved to #147/#148/#149; reduced-motion
presentation to #150. On macOS, owner-assisted unavailable-WebGL, targeted
card-renderer context interruption, approximately three-minute hide/return and
30-second sleep/wake checks passed for continued play. The interrupted deal
settled without its normal animation; later animations/audio recovered. This is
graceful degradation, not seamless replay. Thirty first-actionable-match launches
and an isolated SIGKILL/relaunch check are recorded with their limits in the
canonical report. Local simulation restarts after process loss; backend match
restoration remains blocked by #129. Raw harnesses/results remain local.

The longer physical iOS pass found an audio lifecycle bug: WebKit remained
interrupted while Howler waited in suspending. The shared audio adapter now
explicitly resumes interrupted as well as suspended contexts; audio hooks retry
on foreground/gestures and stop sounds while hidden. The owner verified recovery
on the correctly installed standalone candidate after backgrounding, lock/unlock,
earphones/speakers and a brief system audio interruption. Incoming-call-specific
and extended timed suspension coverage remain release follow-ups. See the
canonical report for initial failures, telemetry and retest duration limits.

The final corrected iPhone timing harness completed 30 paced launches (unique
report names and expected-PID validation): opening control n=13 median/p95
1,534/1,574ms; opponent deal to playable hand n=17 5,286/5,340ms, measured from
the native constructor. An isolated SIGKILL/relaunch preserved existing
preferences and reached an actionable match; local simulation restarts. The
normal probe-free app was restored and owner-tested with reduced motion and
sound. The earlier rapid-launch failure and stale-report retry remain separately
documented. Live current-source Cloudflare preview validation remains pending until the
opted-in deployment and deep-link probe pass; local builds/tests/notices and deployment dry-run passed.
