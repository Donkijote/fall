# Cross-platform distribution investigation (#126)

Date: 2026-11-18. Status: research complete; Tauri-first experiment agreed;
packaging validation delegated to [#140](https://github.com/Donkijote/fall/issues/140).
Owner: [issue #126](https://github.com/Donkijote/fall/issues/126).
Coordinates with [authoritative backend #129](https://github.com/Donkijote/fall/issues/129)
and the existing [preview lifecycle #130](https://github.com/Donkijote/fall/issues/130).

The original #126 deliverable was a documentation-only investigation and setup
plan. The #140 configuration work below now adds the native host; the historical
research sections retain their original baseline. No native performance budgets
have been measured in this configuration pass. The owner agreed to close #126 as the research phase and
transfer the reproducible packaging spike to #140 without claiming it passed.
No artwork was generated or adopted, so
there are no mockups, background masters, or prompt manifests for this feature.

## Packaging configuration review (#140, 2026-11-20)

The owner reports successful initial testing on macOS, iOS, Windows and Android.
Those results have not yet been captured as reproducible device/performance
measurements. The branch contains a Tauri 2 host; this pass aligns configuration
without claiming the entire packaging spike or store release is validated.

Decisions and implementation:

- Tauri owns the development server through `beforeDevCommand`; keep port 3000
  and stop a separately launched web server before `pnpm desktop` / `pnpm ios`.
- Desktop opens at 1280 × 720 logical pixels, centered, resizable and windowed,
  with work-area overflow prevention. Future display preferences remain deferred.
- Set iOS/iPadOS 17.0 and macOS 14.0 minimums. Align the generated Apple project,
  XcodeGen source, plist and Podfile; Xcode resolves release deployment to 17.0.
- Preserve the iOS hidden status bar. Declare portrait plus both landscape
  directions consistently in the phone/tablet plist and XcodeGen source, then
  restrict the active native controller to landscape outside Login. Login
  permits portrait and both landscape directions. Reapply on foreground without
  remounting screens. iPad requests full-screen operation for orientation locking;
  newer iPadOS windowing remains a device check.
- Keep version `0.2.0`; Tauri reads it from `package.json`. Cargo and Apple
  marketing versions agree. Apple build number starts at `1` and must increase
  for subsequent uploads. No tag, commit, push or deployment was created.
- Replace Rust author/repository/license placeholders with Donkijote, this
  repository, and the existing proprietary LICENSE. Add the Tauri frontend API
  for the native command and regenerate its shipped third-party notice.

Implementation ownership and the complete verification checklist are in
[`src-tauri/README.md`](../../../src-tauri/README.md). Browser and Android
orientation behavior are unchanged in this pass; web/PWA enforcement remains
pending. The native bridge uses Tauri's UI-thread webview callback and Tao's
controller setter, checked at runtime. Tauri is pinned to 2.12.7 and Cargo.lock
pins Tao to 0.37.3; upgrades must recheck this bridge.

Source verification on the local Apple Silicon Mac: Node 26.12.1, pnpm 12.15.0,
Rust/Cargo 1.100.0, Xcode 27.2, iOS SDK 27.2. Focused orientation/router tests
passed (21 tests); production web build and shipped-notice check passed; macOS
and arm64 iOS `cargo check --locked --offline` passed; the macOS host linked
successfully with `MACOSX_DEPLOYMENT_TARGET=14.0 cargo build --locked --offline`; the Objective-C++ bridge
passed iOS 17 syntax checking; plist lint and Xcode release deployment setting
inspection passed. The build retains the existing large-chunk warnings and three
notice entries without root notice files. No new exception was added.

Physical rotation, keyboard/safe areas, suspend/resume/audio, installed standalone
packages, performance measurements, Windows DPI sizing, Linux work areas,
production signing, CSP policy and release distribution remain unverified in
this pass. The broad acceptance checkboxes in #140 remain incomplete. These are
pending checks, not a finding that the owner's existing packages failed.

## macOS title-bar follow-up (#140)

After the configuration alignment commit, the owner requested that the macOS
header blend into the screen artwork, keeping native rounded corners, traffic
lights and window dragging while hiding the title. Use Tauri's overlay title bar
with native decorations retained; reserve a transparent 2.5rem drag strip above
page controls using the existing safe-area system. A macOS-only native flag
enables the strip before the first React layout. Browser/iOS/Windows/Linux do
not receive that strip. The owner confirmed the blended header appearance and
requested more traffic-light padding, using Chrome on macOS as the closer
reference. After an inspector screenshot showed the buttons above center and too close
to the left edge, increase the native inset to `{ x: 20, y: 22 }`. Reserve a 40px strip
with an 88px button exclusion. The revised spacing and native drag hit testing
need a restart and runtime check; implementation details are in the native host
README.

## iOS landscape safe-area follow-up (#140)

The owner reported a displaced Hall header and edge-hugging profile, resource,
and footer actions after entering landscape. Keep the merged #137 landscape
layout and its gutters authoritative. The physical iPhone investigation found
that the Tauri window itself could retain portrait safe insets after native
rotation; reading only CSS `env()` or the main native window was insufficient.

The iOS host now publishes a UIKit safe rectangle converted to web-view
coordinates. For the observed phone mismatch (landscape scene/window geometry
with portrait top inset and no side insets), a transparent, non-interactive,
non-key reference window in the same scene supplies fresh system insets. Layout
callbacks update them and document reloads republish them. Browser `env()` remains
the fallback. Hall layout and full-bleed artwork are preserved; the legacy bottom
navigation also consumes the shared insets.

On 2026-11-20 the physical iPhone's 874 × 402 viewport reported native landscape
insets top/left/bottom/right 0/62/20/62. Inspection of the running Hall confirmed
header padding top 4px and sides 68px, plus footer sides 68px and bottom 22px.
The owner confirmed the current appearance.
An iOS 27.0 simulator harness also reproduced stale native portrait insets and
verified both landscapes, document replacement, portrait return, and an
already-inset web view. Physical visual/touch sign-off across both directions,
Login keyboard behavior and lifecycle checks remain pending. Native host
documentation owns the implementation and verification details.

## Proposed decision

Test **Tauri 2 across all five native platforms**, preserving the current web
build and React UI. Choose it only after the spike below passes. Reusing one
shell family is a reasonable first experiment for a small team; it does not
mean one binary, one rendering engine, or identical platform behavior.

Keep **Capacitor for iOS/Android plus Tauri for desktop** as the fallback if
mobile lifecycle, auth, or plugin integration is materially easier there.
Capacitor uses system WebViews too: changing wrappers alone is not a solution
to a WebKit rendering problem. If Linux WebKitGTK or other desktop graphics
fail the budgets after bounded tuning, compare **Electron on desktop** with
the same scene. Consider a native UI/game-engine rewrite only if measured
requirements still fail; portable game rules alone do not make that rewrite cheap.

The decision priorities are correct lifecycle/reconnect, usable input and
accessibility, acceptable capture performance, then delivery and maintenance
cost. Download size is a secondary criterion. Store acceptance is a separate
release gate from technical packaging.

## Alternatives and tradeoffs

| Strategy                            | Reuse and reach                                                                                         | Rendering and operational tradeoff                                                                                                               | Decision                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Web / installable PWA               | Existing DOM, artwork, rules and deployment; browser delivery on all five OS families                   | Browser installation varies; no native installer/store/signing path by itself; background execution and OS integrations vary                     | Retain as baseline and fastest distribution channel |
| Tauri 2 desktop + mobile            | Same frontend and rules; Rust host plus generated mobile projects                                       | System WebViews; Rust and platform SDK maintenance; avoid bundling an entire browser                                                             | First spike candidate, conditional on results       |
| Capacitor mobile + Tauri desktop    | Same frontend and rules; no Ionic UI rewrite required                                                   | Two shell/plugin ecosystems; Swift/Gradle mobile projects plus Rust desktop host                                                                 | Mobile integration fallback                         |
| Capacitor mobile + Electron desktop | Same frontend and rules                                                                                 | Desktop Chromium consistency; bundled runtime, greater expected download/memory cost and frequent runtime security updates; two shell ecosystems | Desktop rendering comparator                        |
| Native UI / game-engine rewrite     | Reuse framework-independent rules only where language/runtime permits; assets need adapted presentation | Rebuild DOM controls, GSAP sequencing, accessibility and scene integration; potentially better native rendering, unproven benefit                | Defer until measurements justify cost               |

[Tauri's WebView reference](https://v2.tauri.app/reference/webview-versions/)
identifies WebView2 on Windows, Android WebView, and WebKit on Apple/Linux.
[Capacitor's supported targets](https://capacitorjs.com/docs/getting-started/environment-setup)
are iOS, Android and web; desktop requires another wrapper.
[Electron packaging](https://www.electronjs.org/docs/latest/tutorial/application-distribution)
uses a bundled runtime and recommends Forge.
[Tauri size guidance](https://v2.tauri.app/concept/size/) supports the runtime
size distinction, but gives no Fall-specific size guarantee. All comparative
performance and maintenance judgments above are hypotheses to test.

[PWA installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
depends on browser support and manifest configuration. Fall already links
`public/site.webmanifest` with standalone display, icons and an unrestricted
orientation. No service-worker registration was found in the inspected source.
Installation and offline behavior have not been tested. Offline shell caching
would need versioning and eviction; it must never imply offline authority over
multiplayer outcomes or progression.

## Repository evidence

Inspected baseline: `f4fe920e5ffec75da243ef67bdb5e00699167bb0` on `develop`.

- [`package.json`](../../../package.json): React/TypeScript, Vite Plus,
  GSAP, R3F/Three.js/Quarks and Howler already form the presentation stack.
- [`Router.tsx`](../../../src/routes/Router.tsx) uses browser history and lazy
  modules. `/dev/animations` and `/dev/components` exist only in development.
  A release spike must exercise `/game/tavern-7f3a`, not depend on those routes.
  Packaged reloads and external deep links need explicit validation.
- [`match`](../../../src/modules/match/README.md) runs local simulated matches;
  refreshing starts over. It shares 3D capture playback/audio with the playground
  and has reduced-motion/WebGL fallbacks. These are code paths, not proof that
  every WebView renders or resumes correctly.
- [`useMotionAudio`](../../../src/infrastructure/ui/hooks/useMotionAudio.ts)
  preloads and unlocks in pointer/keyboard gestures; the Howler adapters resume
  suspended contexts. Native interruption and background recovery remain untested.
- [`login`](../../../src/modules/login/README.md) is presentation only. There
  is no implemented authenticated native login or reconnect protocol to validate.
- [`vite.config.ts`](../../../vite.config.ts) uses port 3000 and emits `dist`.
  [`wrangler.jsonc`](../../../wrangler.jsonc) serves that folder with SPA fallback.
  The [preview workflow](../../../.github/workflows/deploy-cloudflare.yml) is
  label-opted-in and probes `/login`; preserve that contract.

Local observations on 2026-11-18: macOS 27.2.1, Xcode 27.2, Node 26.12.1,
pnpm 12.15.0. `rustc`, `cargo`, and `adb` were not on PATH. This does not establish
whether unselected SDK installations or physical test devices are available.

`pnpm build` passed TypeScript, production bundling and shipped-notice checking.
The build warned about chunks over 500 kB; it reported 33 shipped package entries,
including three without a root notice file. No new notice exception was introduced.
The fresh output contained 162 files totaling **16,956,158 bytes** uncompressed:
7,032,161 PNG, 5,246,642 WebP, 2,197,858 JS, 2,042,400 SVG, 219,586 CSS,
169,010 MP3 and 48,501 other bytes. This includes copied public files and build
metadata; it is neither initial transferred payload nor a native installer size.
Reproduce the byte count after `pnpm build` with:

```sh
python3 - <<'PY'
from pathlib import Path
files = [p for p in Path('dist').rglob('*') if p.is_file()]
print(len(files), sum(p.stat().st_size for p in files))
PY
```

## Planned structure and integration boundaries

Add these only during the packaging milestone, after selecting exact tool versions:

```text
src-tauri/                         # Tauri host, Cargo.lock, capabilities, config, icons
  gen/apple/                       # generated Xcode project, deliberate native edits
  gen/android/                     # generated Gradle project, deliberate native edits
src/infrastructure/adapters/platform/ # lifecycle, links, secure session integration
docs/design/platform-distribution/ # this decision and eventual measured evidence
.github/workflows/native-build.yml # unsigned native build/test matrix first
.github/workflows/native-release.yml # separately protected signing/publishing
```

Use Tauri's conventional root `src-tauri` to keep CLI discovery simple. Commit
native project configuration and lockfiles; exclude SDK caches, build outputs,
keystores, profiles and credentials. If Capacitor wins mobile, use root
`capacitor.config.ts`, `ios/` and `android/` instead of Tauri's mobile projects;
do not maintain both mobile shells in production without a demonstrated need.

Proposed Tauri build settings are `frontendDist: "../dist"`,
`beforeBuildCommand: "pnpm build"`, and development URL `http://localhost:3000`.
Omit the automatic dev-server hook when attaching to the already-running app.
Use strict port selection and an explicit LAN host/HMR configuration for real
mobile devices; localhost on a phone does not refer to the Mac. Keep development
HTTP allowances out of release configuration. Follow the
[Vite integration guide](https://v2.tauri.app/start/frontend/vite/).

Package local release assets, not a privileged remote Cloudflare page. Verify
root-absolute public URLs, lazy chunks, fonts, MP3 decoding, image loading and
history-route fallback against each shell's origin/protocol. Preserve web history
URLs. Introduce a native routing adapter or shell fallback only if the spike
demonstrates it is needed; do not globally switch to hash routes speculatively.

Keep `src/domain` and module application code framework/platform independent.
Platform SDK calls belong in infrastructure or the owning feature's adapters;
UI composition connects them. Introduce ports only for real dependencies such
as session storage, app-state events or external auth. No speculative empty
platform module and no wrapper imports in game rules. Controller mappings
should submit the same application intents as keyboard/touch.

Treat backend URL, public OAuth client ID and environment name as public build
configuration. Never put signing keys, OAuth client secrets or backend admin
credentials in `VITE_*`, JS, bundled Rust resources or native config. Restrict
Tauri capabilities and IPC to required operations; use a tested CSP allowing
only the assets, shaders and API/WebSocket origins actually needed. Deny
arbitrary navigation and external-command execution. If Electron is selected,
follow its [security checklist](https://www.electronjs.org/docs/latest/tutorial/security):
sandboxed renderer, context isolation, no renderer Node integration, narrow
validated IPC and explicit URL handling.

Coordinate with #129 before choosing auth or backend providers. Plan system-browser
OAuth authorization-code + PKCE, state validation, exact registered return URIs,
verified universal/app links where supported, and OS-protected refresh-token
storage (Keychain/Keystore/appropriate desktop vault). The browser implementation
needs its own reviewed session mechanism. Keep long-lived tokens out of ordinary
localStorage and logs. Test cold and warm callbacks, cancellation, logout and
expired/revoked sessions. Validate link host/path/parameters before routing;
invite links never grant membership without a server check. See
[Tauri deep links](https://v2.tauri.app/plugin/deep-linking/).

On suspend: stop decorative rendering/audio and pending presentation timers;
do not pause server turns. On resume: recover transport, reauthenticate if needed,
request an authoritative revisioned snapshot, settle obsolete animation, and
re-enable input only after reconciliation. Retry intents with idempotency keys;
never replay stale captures as game commands. A terminated process must recover
through the same path. #129 owns hidden hands, deck order, legal moves, match
results and reward ledger. Offline clients may display local practice and cached
presentation, but cannot award trusted XP/coins or resolve online matches.

## Representative packaging spike (planned, not executed)

First pair: **macOS desktop and iOS**, matching the owner's development equipment.
Confirm Mac architecture, physical iOS device/model and SDK availability during
setup. Next test Windows on the owner's computer after installing its toolchain,
then Linux in the owner's VirtualBox VM, and lastly Android using an emulator
on the Mac. Record VirtualBox graphics acceleration and Android emulator image,
architecture and acceleration. VM/emulator results do not establish physical
GPU, thermal or audio-interruption behavior; retain those release checks as
pending. This order and its implementation are tracked in #140.

1. Pin Tauri CLI/API/Rust dependencies and Rust toolchain; record SDK, NDK,
   JDK, Xcode and WebView versions. Use the repository Node/pnpm pins. Install
   host dependencies from [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).
   Use Android SDK/NDK plus Rust Android targets, and Xcode plus Rust iOS
   targets for Apple. Do not install or upgrade tools as part of this docs PR.
2. Add the minimal host/configuration described above. Register a temporary,
   explicit app identifier distinct from production. Add no broad native APIs.
3. Run the existing app on port 3000 for interactive work. Validate a production
   build separately, disconnected from the dev server. Development success
   alone does not validate packaged asset paths or release optimizations.
4. Reuse Hall/Tavern artwork, an ActionButton GSAP interaction, the live match
   canvas, Quarks capture effects and Howler cues. Add a deterministic,
   spike-only fixture using existing capture data/timelines, covering plain Fall,
   ice shatter, heat transfer, flame impact and cascade pickups. Keep fixture
   exposure out of production releases. Do not duplicate capture rules or
   assume random bot play will reproduce every effect.
5. Complete the common scenarios and record measurements below for both targets.
   Compare identical assets/effect settings with the browser on the same device.
   If Tauri mobile integration fails, run the same fixture in Capacitor; if the
   problem is GPU/WebKit, investigate rendering/fallbacks before changing shells.

Illustrative commands **for the future spike**; they require generated config
and installed SDKs and have not been executed here. Select and pin exact
dependency patch versions in its lockfiles before taking measurements:

```sh
pnpm add -D @tauri-apps/cli@2
pnpm add @tauri-apps/api@2
pnpm exec tauri init
# Apply the reviewed configuration above before running the shell.
pnpm exec tauri dev
pnpm exec tauri build
pnpm exec tauri android init
pnpm exec tauri android dev
pnpm exec tauri android build --apk --target aarch64
# On macOS, for the subsequent iOS integration check:
pnpm exec tauri ios init
pnpm exec tauri ios dev
```

Fallback experiment: install pinned matching Capacitor core/CLI/iOS/Android
packages, initialize with `webDir: "dist"`, then `pnpm exec cap add android`,
`pnpm exec cap add ios`, `pnpm build`, `pnpm exec cap sync` and
`pnpm exec cap open android` / `ios`. Build/run using Android Studio/Xcode.
[Capacitor installation](https://capacitorjs.com/docs/getting-started) documents
the existing-web-project path. Its
[App plugin](https://capacitorjs.com/docs/apis/app) exposes lifecycle/link events;
compare callback behavior and cleanup, not just whether a window opens.

### Scenarios and proposed acceptance budgets

These budgets are proposals, not observed performance or approved minimum hardware.
Agree the device/OS floor before using them to accept a release.

- Run 30 cold launches and 30 warm launches of a release build. Record median/p95
  time from OS launch to usable Hall and first usable match; provisional p95
  budgets: 3 seconds desktop / 5 seconds mobile to Hall on local assets.
  Record device, OS, build SHA, shell/WebView version and profiling method.
- Record frame-time p50/p95 and frames over 33.3 ms during 30 repetitions of each
  capture after warmup; target p95 at most 33.3 ms on the agreed low-tier device,
  with a 60 fps target on reference hardware. Measure decode/texture-upload stalls,
  CPU/process-tree memory, peak GPU memory where available, and a 20-minute thermal
  soak. Inspect native profiler traces; average fps alone is insufficient.
- Measure compressed installer/download and installed size per architecture,
  resident memory after load and repeated navigation, clean/cached CI build time,
  and first-launch offline/slow-network behavior. No comparative limits yet:
  establish baseline before selecting budgets or promising smaller bundles.
- Verify audio unlock, mute/volume, rapid effect overlap, device lock, interruption,
  Bluetooth/headphone changes, background/foreground and repeated replay without
  duplicate cues. Check audio/impact alignment by recorded playback.
- Test both themes, reduced motion, WebGL unavailable/context loss, font scaling,
  keyboard-only input and focus return, VoiceOver/TalkBack and desktop screen
  readers. Decorative canvas stays hidden; the DOM exposes playable game state.
- Test touch target reach, pointer cancel, Android Back, Escape, resize, zoom,
  safe-area insets, keyboard appearance, portrait/landscape and notch/home-indicator
  clearance. Do not impose landscape until the current layout is measured.
- Prototype controller navigation only if required for release: focus, selection,
  confirm/cancel, reconnect and remapping; mark unsupported mappings explicitly.
- Test deep-link cold/warm start and packaged route refresh, app termination,
  30-second and 5-minute suspension, airplane mode/network switching, and server
  timeout. Until #129 exists, record reconnect/auth scenarios as blocked; simulated
  local resume cannot pass authoritative reconnect acceptance.

### Evidence register

| Target  | Current evidence                       | Required next evidence                                                                      |
| ------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| iOS     | Documentation inference only           | Simulator integration plus physical iPhone/iPad release-build capture/audio/lifecycle tests |
| Android | Documentation inference only           | Physical low/mid-tier Android release APK, WebView version and profiler traces              |
| Windows | Documentation inference only           | Installed signed-candidate build on Windows 11, WebView2 and GPU/input checks               |
| Linux   | Documentation inference only           | AppImage/deb on selected distro floor and newer distro, WebKitGTK/GPU traces                |
| macOS   | Host/tool inventory and web build only | Packaged Apple Silicon run; Intel run if Intel distribution is selected                     |

Record exact commands, fixture seed/config, artifacts/checksums and raw timings
alongside the final decision in this folder. Mark failures and inferred targets
explicitly. A passing web build is not a passing native spike.

## Five-platform development and release matrix

Commands below assume the planned Tauri project and SDK setup. Desktop dev uses
`pnpm exec tauri dev` on each target host; Android/iOS use their `dev` subcommands.
Use native hosted runners initially; cross-compilation does not replace on-OS tests.

| Target  | Development / CI host and build                                                                                                             | Test path                                                                                                    | Signing and distribution path                                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS     | macOS runner with Xcode, iOS SDK, Rust targets; `pnpm exec tauri ios build --export-method app-store-connect`                               | Simulator integration, physical-device and TestFlight test of release candidate                              | Apple team, bundle ID, entitlements, distribution identity/provisioning; upload IPA through App Store Connect, TestFlight then App Store                                |
| Android | Linux runner with JDK, Android SDK/NDK, Rust targets; `pnpm exec tauri android build --aab --target aarch64` (add ABIs only when supported) | Emulator integration plus installed release APK on physical devices; Play internal track                     | Secure upload keystore, Play App Signing; signed AAB to Play Console; signed APK for explicitly supported direct distribution                                           |
| Windows | Windows runner, MSVC C++ build tools, Rust, WebView2; `pnpm exec tauri build --bundles nsis,msi`                                            | Clean Windows install/uninstall/upgrade, keyboard/controller and WebView2 bootstrap                          | Sign/timestamp executable and installer using approved publisher identity; direct NSIS/MSI release first, Microsoft Store packaging/listing as separate work            |
| Linux   | Ubuntu runner with WebKitGTK 4.1/GTK and native build dependencies; `pnpm exec tauri build --bundles appimage,deb`                          | Agreed oldest supported distro plus current distro; X11/Wayland, integrated/discrete GPUs and install/update | Signed checksums/update metadata and release artifacts; AppImage/deb direct downloads first; Flathub/Snap/repository channels require their own packaging review        |
| macOS   | macOS runner, Xcode CLT, Rust; `pnpm exec tauri build --bundles app,dmg`; separate arm64/x64 builds or reviewed universal target            | Apple Silicon plus Intel if claimed, clean-machine Gatekeeper, resume and upgrade                            | Developer ID signing, hardened runtime/required entitlements, notarization and stapling; DMG direct download first; Mac App Store is separate sandbox/provisioning work |

Source paths: [iOS store export](https://v2.tauri.app/distribute/app-store/),
[Android AAB/APK](https://v2.tauri.app/distribute/google-play/),
[Windows installer](https://v2.tauri.app/distribute/windows-installer/),
[Windows signing](https://v2.tauri.app/distribute/sign/windows/),
[AppImage](https://v2.tauri.app/distribute/appimage/),
[Debian](https://v2.tauri.app/distribute/debian/) and
[macOS signing/notarization](https://v2.tauri.app/distribute/sign/macos/).
For Linux, build on the agreed compatibility floor rather than assuming a newer
runner's glibc/WebKitGTK requirements work on older machines.
For AppImage audio, evaluate `bundle.linux.appimage.bundleMediaFramework` and
the required GStreamer codec plugins on the clean test machine. The AppImage
guide calls out media bundling and codec licensing; MP3 success on the build
host is insufficient. Audit those native third-party notices separately from
the existing JavaScript bundle inventory.

### Updates, CI, cost and store gates

Keep the existing Cloudflare preview/build/release jobs unchanged. Add unsigned
native build/test jobs independently; use explicit runner/SDK versions and cache
keys for lockfiles, architecture and toolchain. Promote a single tested commit
to protected signing jobs with scoped secrets; untrusted PR code never receives
release credentials. Preserve third-party notices and review artwork permission
records before each binary distribution. Fall remains proprietary; shell/runtime
licenses do not relicense project-owned code or art.

Initially update direct desktop installations by signed replacement installers;
defer an in-app updater until recovery and key management are tested.
[Tauri's updater](https://v2.tauri.app/plugin/updater/) provides signed update
artifacts; updater signing keys are separate from OS-signing identities.
Use store-managed mobile updates. Do not make unrestricted remotely replaced
JavaScript or downloaded executable code part of the initial mobile strategy;
[Capacitor update guidance](https://capacitorjs.com/docs/guides/deploying-updates)
does not remove store-policy obligations. Electron would need its own
[update pipeline](https://www.electronjs.org/docs/latest/tutorial/updates).

Keep the previous signed desktop installer and a recovery procedure, stop a
bad rollout, and publish a corrected higher version when required. Do not assume
stores support instant binary downgrade. Use backward-compatible backend/event
schemas and supported-client version windows so older mobile binaries can reconnect.
Cloudflare rollback restores a prior web artifact independently; it cannot undo
server migrations or installed native clients. Verify restore/upgrade paths before
turning on automatic updates.

Costs checked on 2026-11-18: [Apple membership](https://developer.apple.com/programs/enroll/)
lists USD 99/year (regional pricing varies), and
[Play registration](https://support.google.com/googleplay/android-developer/answer/6112435)
lists USD 25 once. Budget separately for Mac/iPhone/Android hardware, CI macOS
minutes/storage, Windows signing, device coverage and ongoing SDK/runtime updates.
No runner-minute, signing-service or store-commission quote is established here;
obtain current prices after channel, identity and monetization decisions.
No paid service is required to decide between the candidates.

Current [Play target requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
specify API 36 for new standard Android apps/updates from August 31, 2026.
Do not confuse minimum supported device SDK with store target SDK.
Capacitor 8's environment page currently specifies Node 22+, Xcode 26+ and
Android Studio 2025.2.1+; pin a supported combination at implementation time.
[Apple submission requirements](https://developer.apple.com/news/upcoming-requirements/)
currently list Xcode 26+ with the iOS/iPadOS 26 SDK since April 28, 2026, and
iOS/iPadOS deployment targets of 13+ since September 9, 2026. These are store
floors, not a promise that Fall or its chosen shell supports that device floor.
Recheck the requirements and [submission guidance](https://developer.apple.com/app-store/submitting/)
before the release candidate; upload eligibility has not been established by
an actual submission in this investigation.

[Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/)
include minimum functionality (4.2), account/login and digital-purchase policies.
A functional game may be viable, but a wrapper alone guarantees no acceptance.
Before release review privacy manifests/required-reason APIs, data disclosures,
account deletion, age ratings, encryption/export declarations, support/privacy
URLs, third-party login requirements and any purchase/coin model. Review Play
Data Safety, developer verification/testing eligibility and account-specific
production-access requirements in Play Console. Monetization and target regions
remain undecided; do not assume external checkout or real-money gameplay is allowed.

## Ordered implementation plan and remaining decisions

[#140](https://github.com/Donkijote/fall/issues/140) owns the packaging experiment,
environment setup and validation below. Production release work can be split
into additional linked tasks as implementation establishes its requirements.

1. **Confirm release scope and toolchain.** Choose minimum OS/hardware, phone/tablet
   orientation, desktop architectures/distros, controller requirement, initial
   distribution channels, app identifiers and account ownership. Inventory test
   devices, Apple/Play access, signing availability and CI budget. Exit: recorded
   support matrix and pinned SDK/Rust/shell versions.
2. **Package and measure the representative spike.** Add only the minimal shell,
   production-like deterministic fixture and measurement hooks. Execute macOS +
   iOS first. Exit: reproducible commands/artifacts and measured
   budgets or named failures; replace this provisional decision with evidence.
3. **Resolve rendering/input gaps and complete desktop coverage.** Tune asset decode,
   DPR/particle budgets, safe areas and focus; compare Capacitor/Electron only for
   demonstrated gaps. Execute Windows after setup, Linux in VirtualBox, then
   Android in the Mac emulator, plus claimed Apple architectures.
   Exit: available five-platform environments measured, VM/emulator limitations
   and physical-device gaps explicit, chosen fallbacks documented, web regression checked.
4. **Integrate lifecycle/auth/backend adapters with #129.** Implement real session,
   link, transport and revision-reconciliation boundaries. Exit: two clients survive
   suspend/kill/reconnect without state/reward duplication or hidden-state leaks.
   This phase depends on #129; packaging phases do not require selecting its provider.
5. **Add unsigned native CI, then protected releases.** Add reproducible platform
   builds, smoke tests, notice inventory, checksums and symbol/crash artifact policy;
   subsequently configure signing, notarization, store tracks and staged updates.
   Exit: install/upgrade/recovery verified from trusted CI-produced artifacts.
6. **Complete release prerequisites and beta sign-off.** Review permissions/privacy,
   artwork evidence, accessibility, store metadata and operational support. Run
   TestFlight/Play internal testing and direct desktop betas. Exit: signed
   five-platform verification matrix and explicit rollout/rollback ownership.

Still unresolved: measured native performance and sizes, supported hardware/OS
floor, controller scope, exact shell/plugin versions, secure-storage provider,
auth/backend contracts, distribution accounts, signing budget, monetization and
store acceptance. These block a final production decision, not this plan's review.

## Acceptance-criteria reconciliation

The issue's wording is retained here and in the draft PR:

- [x] A justified recommendation and alternatives are documented, including blockers and unresolved questions.
- [ ] A reproducible packaging spike validates the main technical risks with setup commands and measured results.
- [x] Each requested platform has a concrete development, build, test, signing, and distribution path.
- [x] Migration/setup work and release prerequisites are scoped into an ordered implementation plan.

Checked items denote documented proposals, not native execution or release
readiness. The spike criterion remains unchecked because its execution was
transferred to #140 by the owner; it is not a missing research decision. Review
decision: close #126 as the documentation investigation, retain the current UI
and web pipeline, and test Tauri first through #140 using the agreed device order.
No final production provider selection or store readiness is implied.
