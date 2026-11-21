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

## Current validation ownership (2026-11-21)

The owner narrowed #140 to macOS and iOS, completing remaining macOS checks
before proceeding to iOS. Windows validation belongs to
[#147](https://github.com/Donkijote/fall/issues/147), Linux VirtualBox to
[#148](https://github.com/Donkijote/fall/issues/148), and Android to
[#149](https://github.com/Donkijote/fall/issues/149). The five-platform matrix
below remains useful context; those platform executions no longer block #140.
In-game reduced-motion presentation improvement belongs to
[#150](https://github.com/Donkijote/fall/issues/150).

The Apple spike decides whether to continue development on the measured reference
devices. Actual older/floor hardware, iPad/windowing, additional architectures,
clean-machine signing/notarization/store distribution and comprehensive
interruption coverage remain explicit production follow-ups. VoiceOver and
comprehensive keyboard-only usability are excluded by owner decision, not marked
as passed. External OS deep links and controllers are unsupported by this spike;
packaged local routes are tested separately. Broader web/PWA orientation
enforcement remains a follow-up; Android orientation is owned by #149.

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

## Remaining Apple checks (2026-11-21)

After the scope split, the production web build and shipped-notice check passed
again, along with 42 focused native-orientation/router/motion-deadline/fallback
and audio lifecycle tests. `pnpm exec wrangler deploy --dry-run --outdir
/tmp/fall-macos-validation/final-cloudflare-dry-run` passed against that output.
This is packaging validation, not a new deployed Cloudflare preview probe; the
latest local source has not been pushed. Normal output excludes the opt-in
fixture. Native calls remain in platform adapters; domain/application rules did
not acquire Tauri dependencies. Proprietary metadata and third-party notices
remain intact.

### Additional macOS checks

A local document-start probe disabled all WebGL context creation in the optimized
standalone Mac app. The owner dealt and tried card plays and reported no frozen
deal, missing cards or stuck turn. This verifies graceful non-3D fallback on the
reference Mac, not visual equivalence with the rendered effects.

A separate probe used `WEBGL_lose_context` on the live card-flight canvas, then
requested restoration after one second. Native reports recorded loss/restoration
and an enabled local hand afterward, with no reported runtime error. The owner
observed sound but cards appearing directly in their dealt positions, rather than
a preserved deal animation. This is degraded recovery evidence; seamless visual
recovery is not marked passed. The owner confirmed that later plays/captures, turns and audio behaved normally.
A context interruption may settle the current deal without its normal animation;
it did not permanently disable subsequent animations. The owner then hid the
same app for approximately three minutes (not the requested five), returned and
played, then put the Mac to sleep for approximately 30 seconds and played again.
Both returns retained match continuity, animation and audio without freezing or
missing/duplicated playback. These durations are owner estimates; native power
logs corroborated software sleep with intervening dark wakes. This is not a
five-minute timed suspension pass or a guarantee across every interruption.
An
earlier injection hit the decorative atmosphere canvas and is not counted as
card-renderer recovery. Diagnostic scripts/results stay local under the existing
exclusions; no production global test API was added.

## macOS validation pass (#140, 2026-11-21)

**Continue developing with Tauri on macOS.** The standalone arm64 build, packaged
routes, offline assets and representative live renderer passed the checks below.
This is a positive development decision on one reference Mac. Owner-reported
interaction checks and scope decisions are recorded below; remaining native
resilience and release checks are separate.
iOS validation was initially deferred; the later physical-device pass is recorded below.

The reference host was an Apple M4 Pro MacBook Pro with 24GB RAM, macOS 27.2.1,
WebKit 22625.2.8.11.9 and Xcode 27.2. The native deployment floor is macOS 14;
macOS 14 runtime and Intel hardware were not tested. The completed soak used a
3440×1440 external display at 100Hz, a 1280×720 CSS-pixel viewport and DPR 1.
Earlier Retina samples used different display conditions. Results are specific
to these environments and must be measured again on other machines.

- The optimized standalone `.app` loaded without a development server. Login,
  Rules, Credits and the local-match path loaded and survived document reloads
  without reported errors. These are route/asset checks, not registered external
  deep links or a complete match playthrough.
- Thirty launches of the final bundled-font app reached the Hall shell, fonts
  and images in 412ms median / 422ms p95; thirty same-process document reloads
  measured 62ms median / 79ms p95. OS caches were retained. These markers do not
  measure completed onboarding, first playable match, or warm app reactivation.
- The 20m00.8s foreground soak completed 384 post-warmup captures through the
  existing GSAP/Three.js/Quarks renderer, with no reported runtime errors or
  visibility interruptions. All thermal reports were nominal. Every effect’s
  first 30 post-warmup repetitions measured 10ms median / 11ms p95, maxima
  13–14ms, and no intervals above 33.3ms. Across the entire soak there was one
  37ms cascade interval; the initial ice warmup separately had an 87ms interval.
  Real WebGL draws, expected audio cue sequences and a running audio context
  were observed; these do not prove GPU execution time or audible alignment.
- Approximate one-second sampling saved 1,133 paired native-host/WebContent RSS
  observations: median 321.7MiB, p95 337.6MiB, peak 337.9MiB, final 325.5MiB.
  Shared GPU/network services and peak GPU memory are excluded. This is a local
  baseline, not a memory budget or proof that the app has no leaks.
- A fresh WebKit store with HTTP/HTTPS blocked loaded both font families and
  Hall artwork without errors. The initial test exposed the remote Google
  Fonts dependency; Cinzel and Spline Sans are now bundled with pinned sources
  and their existing OFL notices.
- The app was about 21.56MiB installed; its unsigned headless DMG was 14.61MiB.
  The normal DMG build’s Finder styling timed out (`-1712`); the generated
  `bundle_dmg.sh --skip-jenkins` workaround produced an integrity-checked image.
  Ad-hoc signing does not satisfy Gatekeeper distribution requirements.
- Focused audio/motion/local-match tests (61), credits tests (7), the production
  build/notice check and Cloudflare deploy dry-run passed. Normal production
  output excludes the diagnostic route and fixture.

An earlier soak was interrupted by screen lock at 18m27s. Later hidden-window
attempts could not start rendering. Those attempts were retained locally as
interruptions rather than counted as passes. The fixture now waits for initial
visibility before starting its clock and aborts if the document becomes hidden.
The successful run kept the test window visible and the Mac unlocked throughout.

### Owner verification and scope decisions (2026-11-21)

The owner manually verified the following on macOS. These are owner-reported
results, separate from the automated rendering measurements:

- Existing keyboard navigation, visible focus, Escape dismissing dialogs,
  window dragging/resizing, traffic lights and themes work.
- Enlarged text is readable. The reduced-motion preference is respected and
  the UI/HUD behavior is acceptable. The in-game reduced-motion presentation
  needs design/animation improvement in a separate follow-up; respecting the
  preference does not mean its current game presentation is approved.
- Audio was audible and played appropriately during the rendering run. Switching
  speaker/output devices, disconnecting a device, mute and volume work.
- Minimizing/hiding and switching away work, and the owner reports lifecycle
  behavior is otherwise okay. Specific controlled sleep/wake, forced process
  termination and timed background trials were not separately documented.

VoiceOver support/testing and comprehensive keyboard-only usability are not
planned for this packaging scope by the owner's decision. Existing keyboard
behavior is retained; these exclusions are scope decisions, not passing
accessibility tests or a claim of full accessibility compliance. Do not spend
implementation time expanding those areas for #140.

Actual WebGL context-loss recovery, GPU memory and low-tier hardware remain
unverified. Source inspection identified visibility handling in motion/audio as
an area for future controlled lifecycle testing; the owner reports no observed
issue in ordinary background use. Authoritative reconnect, auth and session
continuity remain blocked by #129. Signing/notarization, a tested CSP and
clean-machine distribution remain release work. This macOS sign-off does not
substitute for the deferred iOS/device checks.

Additional optimized normal-package measurements used 30 fresh processes with
OS/WebKit caches retained. Time from process request to the first actionable
match state was recorded separately for the randomized dealer paths: 12 runs
reached an enabled opening-deal control (median 1,613.5ms; p95/max 1,645ms), while
18 runs reached a playable three-card hand after the simulated opponent's lobby
and deal (median 5,371ms; p95/max 5,789ms). All documents were visible by the first polling observation within
69ms of document navigation and had no reported runtime errors. This visibility
observation is not a paint timestamp. These are separate
small samples, not 30 repetitions of each path; the measurement excludes human
input delay and does not measure onboarding. The earlier Hall p95 remains below
the proposed three-second desktop Hall budget. There is no approved match-entry
budget; the simulated lobby/deal intentionally contributes to the longer path.

A controlled SIGKILL of the isolated test host followed by relaunch reached an
actionable match again. Existing preferences and user-presence markers matched
before/after; no synthetic storage was written. The local match is in-memory and
restarts after process loss by design; this does not verify authoritative match
restoration. The freshly rebuilt normal macOS `.app` passed its production
build/notice checks. Shared GPU/network memory remains excluded from the earlier
RSS figures; full-GPU attribution and older hardware remain release coverage.

The first-use ice stall remains a named performance limitation: the existing
warmup compiles the base card/shadow path, while ice introduces additional effect
materials. That source review suggests a targeted ice/effect prewarm experiment,
but does not establish the cause of the measured stall. Profile shader compilation,
texture upload and effect allocation separately before changing prewarm behavior;
do not hide the stall inside the steady-state frame-budget result. The original
post-warmup samples pass the proposed scheduling budget, while the initial ice
frame exceeds it. No speculative renderer change was made for this spike.

### Additional physical iOS checks

The same physical iPhone received an optimized diagnostic upgrade with existing
development signing; app data was preserved. With all WebGL context creation
blocked, the owner confirmed cards, touch/turns and audio remained usable, with
cards appearing in their final positions and the usual audio sequence continuing.
This is the intended non-3D fallback, not an animation pass.

Targeted one-second context loss on the live card canvas recorded loss at
16,335ms, restoration at 17,343ms and an enabled three-card local hand at 21,089ms
from document navigation. The time before injection included owner input and is
not startup timing. The owner saw the interrupted table deal settle directly,
then normal animated hand dealing and subsequent plays, with correct continued
gameplay. There were no reported runtime errors. Seamless replay of the interrupted
deal is not claimed.

The longer background check exposed an audio failure: after approximately three
minutes backgrounded, local play and visuals continued but all sound was lost.
Connecting Bluetooth headphones, changing volume, disconnecting and returning to
speakers did not restore it; silence began before the output change. This was a reproduced iOS lifecycle defect. Earlier 30-second
background/lock checks did not expose it; the fix and verified standalone retests
below supersede this failure without removing it from the evidence history.

A second normal-renderer diagnostic run reproduced silence after about 60
seconds backgrounded. Telemetry showed WebKit `ctx.state = interrupted`, a
non-advancing audio clock, Howler `state = suspending`, and a later play request
setting `_resumeAfterSuspend` without recovering. Mute and master gain were not
responsible. The source now resumes both suspended and interrupted contexts,
retries from foreground and real gestures, and stops active sounds while hidden.
It uses the public AudioContext resume operation rather than replacing the
shared context or replaying game actions. Fifty-nine focused audio/hook/motion/
orientation/router tests, changed-source lint and the updated macOS package
build passed. The candidate iOS build also compiled/exported. An initial retest was inconclusive because a resumed iOS dev session replaced
the diagnostic installation. After the owner stopped that native dev session,
the preserved standalone candidate was reinstalled and its native telemetry
verified. The owner confirmed audible recovery after the 60-second background
case (native visibility reports measured 74.0 seconds), then after another
approximately three-minute background, lock/unlock, earphones, speaker return
and a brief Siri/system audio interruption. No duplicated playback or remaining
audio failure was reported. The longer manual duration is an owner estimate;
other recorded hidden intervals were 48.9 and 118.3 seconds, not a controlled
five-minute suspension trial. Recovery telemetry showed both context and Howler
running again and an advancing audio clock. A phone-call-specific scenario was
not separately identified. Keep extended suspension and broader interruption/
device coverage as release follow-ups. These measurements preceded publication of the validation follow-up.

A fresh all-process Activity Monitor recording succeeded with the physical device
connected. An additional 20-second recording during the real match yielded 21
host/WebContent observations. WebContent RSS peaked at **333.1MiB** (median
315.9MiB), while its separately reported physical footprint peaked at
**542.1MiB** (median 519.7MiB). Host RSS peaked at **67.9MiB**. These are different
OS memory metrics: do not add footprint to RSS or treat this short recording as a
20-minute memory soak, a leak-free guarantee, or total app/GPU memory. GPU/network
service processes were visible, but their responsibility field was launchd and
reliable per-app GPU allocation attribution was not established. Earlier failed
profiler attempts remain historical evidence; renderer RSS is no longer wholly
unmeasured. Set a memory budget and validate older hardware before release.

A later all-process Time Profiler recording captured the shared five-effect
workload and **5,966 WebContent CPU samples**. The renderer PID was present in
the trace; this overcomes the earlier attach-by-PID limitation. Most exported
frames remain raw/JIT addresses, so no precise stall attribution is claimed.
The cached diagnostic run completed one warmup plus one measured repetition of
every effect with running audio contexts, no reported runtime errors, and warmup
maximum intervals 22/23/17/18/18ms (plain/ice/heat/flame/cascade). This profiled,
small, cached run is not a replacement frame-budget sample and does not negate
the original 121ms first-use ice stall. Next profiling step: obtain matching OS
symbols and correlate first-effect shader/texture/allocation work in a controlled
cold/warm comparison before changing prewarming.

Startup-harness failures are retained separately: the first six actionable-match
launches succeeded, then CoreDevice could not determine the next launched PID.
No contemporaneous Fall crash or jetsam report was present. A retry was rejected
because native report filenames reused earlier rows. The corrected local runner
uses a unique run token, verifies the report PID against the launch result and
waits two seconds between relaunches. Do not mix rejected/stale rows into timing
statistics or silently count a CoreDevice launch failure as a pass.

An earlier debugger-inspection session also produced a diagnostic-host crash:
a cyclic inspection payload reached the local recorder's JSON serializer and
exhausted its stack. This was a harness defect; current audio telemetry contains
only primitive snapshots. The recorder is absent from the normal package. Keep
that raw crash report local alongside the failed inspection history.

The accepted, corrected startup run completed **30 paced fresh processes** with
no reported runtime errors. Native-constructor-to-first-actionable-state timing
was kept separate for randomized dealer paths: 13 runs reached an enabled
opening-deal control (median/p95 **1,534/1,574ms**); 17 reached a playable local
hand after the opponent's lobby/deal (median/p95 **5,286/5,340ms**). Launches were
spaced by two seconds; that delay is outside the measured clock. These are not
30 repetitions of each path, full OS-launch/dyld timing, or human-input-response
measurements. Caches were retained; no match-entry budget is approved.

An isolated SIGKILL followed by fresh launch reached an actionable match again,
with existing preferences and user-presence markers unchanged. In-memory local
matches restart; authoritative restoration remains blocked by #129. The normal
optimized developer-signed package was then installed/launched, with the native
probe absent from its binary and the opt-in fixture absent from normal frontend
output. No app data was erased. The owner confirmed the normal app honors reduced motion: audible playback
continues while cards settle directly without animation. UI/HUD preference behavior
and a short local match remained usable; visual polish remains #150. Normal
animations require restoring Motion to System.

### Scoped Apple decision and release follow-ups

Continue development with **Tauri 2 on the measured macOS and iPhone reference
devices**. The sustained renderer, packaged/offline routes, scoped input/layout,
audio and lifecycle evidence support this decision. The longer iOS audio failure
was reproduced and corrected in the shared Web Audio adapter; it did not require
a different native shell. No Capacitor/Electron fallback experiment is justified
by the observed results. This is a development decision, not a universal device,
minimum-OS or public-store release sign-off.

Before production distribution:

- Profile the original first-use ice stall with matching symbols and controlled
  cold/warm conditions; compare effect prewarming without hiding the startup cost.
  Establish first-playable-match and memory budgets on lower hardware. Attribute
  GPU allocations separately from host/WebContent RSS and physical footprint.
- Cover actual macOS 14/iOS 17 and older hardware, iPad/windowing and any additional
  claimed Mac architecture. Run controlled five-minute/extended suspension,
  incoming-call-specific and additional audio-route interruption cases; investigate
  the retained CoreDevice rapid-relaunch failure without assuming an app crash.
- Configure protected Apple release CI/signing, macOS Developer ID/hardened runtime,
  notarization/stapling and clean-machine Gatekeeper/install/upgrade checks. Finish
  iOS store provisioning/TestFlight/App Store requirements and increment upload
  build numbers. Paid enrollment and public release are outside this spike.
- Replace the current null CSP with a tested production policy and review native
  capabilities/entitlements. Coordinate PKCE/secure session storage and authoritative
  reconnect/revisions/rewards with #129; local simulation is not backend evidence.
- Run the current source through the opted-in Cloudflare preview/deep-link probe
  after publishing the branch with the `autodeploy` label. Local web/native builds, focused tests, notice
  checks and deployment dry-run passed; the live current-source preview must pass its deep-link probe before
  completing that acceptance check. Preserve browser/PWA orientation enforcement as a separate
  follow-up. Windows/Linux/Android execution and reduced-motion polish remain
  #147/#148/#149 and #150 respectively.

### Repeat fault and lifecycle checks

Use an isolated copy of the normal optimized `.app` and the same local native
probe described below. In a document-start diagnostic script, override canvas
`getContext` to return `null` for WebGL to test unavailable graphics. Separately,
observe the canvas inside `[data-card-flights]`, obtain `WEBGL_lose_context`,
request loss during a live deal, and request restoration after one second.
Record native `webglcontextlost`/`webglcontextrestored` events, subsequent enabled
local cards, later visible animations and actual audible output. Do not count a
loss on the atmosphere canvas as a live-card test or aggregate draw calls as proof
that a particular canvas recovered. Do not replay moves/cues through a test-only
game API. The owner supplies actual clicks when native UI automation is unavailable.

For first-actionable-match timing, launch the normal package at the existing
local-match route and observe the first visible enabled opening-deal button or
local playable hand after the simulated opponent's deal. Report these separate
paths and exclude human waiting time; this is not completed onboarding or a human
input-response measurement. Retain process-request and document timestamps,
visibility, errors and cache conditions. To test forced termination, kill only
the isolated test host with SIGKILL and relaunch; compare existing preferences
without writing synthetic data. Local simulation is in-memory and starts a new
match after process loss; authoritative restoration remains blocked by #129.

Manually hide/return and sleep/wake during a normal match, recording the actual
or estimated durations, state and audio/animation behavior. Never count background
or sleep time as active-rendering soak time. Restore a non-instrumented normal
app after diagnostics; keep all scripts and raw reports local.

### Repeat the macOS measurements

The reusable fixture is versioned; machine-specific diagnostic scripts, JSON,
logs, traces and generated apps are local only. On this checkout, optional tools
live in `scripts/tauri-validation/`, and the dated JSON report remains under
`docs/design/platform-distribution/`; both are excluded through `.git/info/exclude`.
They are not included in a fresh clone. Preserve useful raw evidence outside the
checkout in a durable local directory; `/tmp` is temporary. Never commit device
serials, hardware UUIDs or raw profiler metadata.

On another machine, use the following protocol to recreate the local harness or
use equivalent native profiling tools:

1. Record the source revision and local changes, build/tool versions, hardware,
   OS/WebKit, display refresh rate, viewport and DPR. Build a normal optimized
   app with `pnpm exec tauri build --bundles app` and preserve a separate copy.
2. Build a diagnostic copy with `VITE_PACKAGING_SPIKE=1 pnpm exec tauri build
   --bundles app`. Open `/packaging-spike?runs=30&soak=1200` in that app, then
   restore the normal generated app before measuring. Never distribute the
   diagnostic build. Do not start another development server.
3. For the local probe, compile an Objective-C++ dylib linked with AppKit/WebKit.
   Intercept `WKWebView` initialization to install a document-start `WKUserScript`
   and a script message handler. Set the initial history path before React
   starts, count actual WebGL draw calls, collect JS errors and listen for
   `fall:packaging` events. The fixture reports `started`, per-capture frame
   intervals/cues/duration, warmup status, `complete`, or interruption/error.
   Write JSONL with native timestamps, process IDs, window occlusion and thermal
   state. This injection is diagnostic-only and does not test hardened signing.
4. Launch the copied app executable with `DYLD_INSERT_LIBRARIES` pointing to
   that local probe. Sample native-host and attributed WebContent RSS/CPU about
   once per second and save partial evidence on failure. WebContent attribution
   in the local harness uses WebKit diagnostic SPI; recheck it after OS upgrades
   or use a native profiler. Keep the window unoccluded and the Mac unlocked.
   Use a scoped `caffeinate -di` assertion to prevent idle sleep during the run.
5. Exclude one warmup per case; summarize the first 30 repetitions of plain Fall,
   ice, heat, flame and cascade, then retain all later captures for the soak.
   Report median/p95/max intervals, counts above 33.3ms, errors, visibility,
   thermal state, RSS scope and outliers. Do not count hidden/locked time as
   active rendering or infer audible output from scheduled cue calls.
6. For startup, run 30 fresh processes and 30 same-process reloads, recording
   readiness only after the Hall header, fonts, decoded images and a frame.
   Distinguish retained OS caches from true cold launches. For offline assets,
   use a nonpersistent WebKit store with an HTTP/HTTPS-blocking content rule;
   leave system networking alone. A timer-only resource check is not a visible
   startup measurement.

With the optional local tools present, the foreground soak command is:

```sh
xcrun clang++ -dynamiclib -fobjc-arc -framework AppKit -framework WebKit \
  scripts/tauri-validation/macos-probe.mm -o /tmp/fall-probe.dylib
caffeinate -di python3 scripts/tauri-validation/run-macos.py \
  /path/to/diagnostic.app /path/to/local-results \
  --probe /tmp/fall-probe.dylib --mode fixture --count 30 --soak 1200 \
  --startup-timeout 240
```

The runner’s local README covers launch/reload/offline modes and summarization.
For a new machine, retain a separate report with that environment’s results;
update this decision only when the new evidence changes it.

## iOS validation pass (#140, 2026-11-21)

**Continue developing with Tauri on iOS on the tested reference device.** The
optimized standalone build, representative renderer, packaged assets and
owner-verified orientation/audio behavior passed. This is not App Store readiness
or validation of every device capable of running the iOS 17 minimum.

The physical device was an iPhone 17 Pro (iPhone18,1), iOS 27.2.1 (24B156),
WebKit 8625.2.8.10.7, connected by cable to the Mac. Xcode/SDK 27.2 built an arm64
release configuration, exported with existing development signing using
`pnpm exec tauri ios build --ci --export-method debugging`. The 874×402 landscape
viewport had DPR 3; the live capture canvas was capped at DPR 2 (1748×804 pixels).
The screen advertises up to 120Hz; measured capture scheduling was approximately
60Hz. Low Power Mode was off. Measurements use `f5a6357` plus the local optional
tap-to-start fixture change; native probe code and reports remain local only.

- The 20m01.0s workload completed **383 post-warmup captures**, all with real
  WebGL draws, expected cue sequences, running audio contexts and no reported
  runtime errors. All 391 native thermal reports were nominal. Across 66,427
  post-warmup frame intervals, median/p95 were **17/17ms**, maximum **30ms**,
  and none exceeded 33.3ms. Every effect passed its first 30 repetitions at
  17ms p95. The initial ice warmup separately contained a **121ms** interval;
  first-use rendering deserves further profiling/tuning.
- All capture reports had a visible document. UIKit reported 380 captures as
  foreground-active and three as foreground-inactive during the audio checks;
  two of those were in the first 30-per-effect sample. No background capture
  reports or document-visibility interruptions occurred. Treat this as a
  continuous rendering run with brief system-interaction conditions, not proof
  that no system overlay appeared throughout the test.
- Thirty fresh processes reached the Hall shell/fonts/images in **220ms median /
  228ms p95 from the native probe constructor**, or 105/109ms from document
  navigation. Thirty same-process document reloads measured **61.5/68ms**.
  The constructor marker excludes OS launch/dispatch and earlier dyld work;
  USB command/file-copy time is not counted. OS caches were retained. These are
  not true cold launches, full OS-to-input latency, completed onboarding or
  first-playable-match measurements.
- Login, Rules, Credits and the local-match route loaded and survived document
  reloads without reported errors. A nonpersistent WebKit store with HTTP/HTTPS
  blocked loaded the Hall, both bundled font families and artwork without
  errors (132ms document readiness). These are packaged path/resource tests,
  not registered OS deep links or authoritative reconnect tests.
- The 391 event-driven native-host RSS samples peaked at **67.0MiB**. This
  excludes WebContent, GPU and networking processes and is not total app
  footprint. Activity Monitor recordings timed out waiting for the device;
  Time Profiler/VM Tracker could not select the reported WebContent PID.
  Renderer/GPU memory and full native-renderer profiling remain unmeasured.
- The normal exported app bundle was **17,084,073 bytes** and the developer-signed
  IPA **14,219,024 bytes**. These are exported artifact sizes, not the device’s
  filesystem allocation or an App Store-thinned download size.
- The diagnostic probe was linked through temporary Xcode linker settings.
  Those settings were restored, and the normal package was rebuilt, installed
  and launched after measurements. Its native binary excludes the probe; normal
  production output excludes the capture fixture. Read-only inspection of the
  restored app confirmed `tauri://localhost`, loaded fonts and CSS safe insets
  top/left/bottom/right **0/62/20/62**, despite stale native-window portrait insets.

Owner-reported physical-device checks:

- Portrait Login with the keyboard open, leaving Login into landscape, both
  landscape directions, returning to Login and safe-area/control placement work.
- Speaker audio is audible and aligned with the effects. Initial silence was
  traced to iPhone Silent Mode; the owner confirmed correct output after
  disabling it. Do not count that device setting as a Tauri audio failure.
- In the restored normal standalone app, the owner completed a short local
  match, touch controls, menus/settings including mute/volume, approximately
  30 seconds in the background, and lock/unlock followed by return. Match state,
  animations and audio remained correct, without freezing or duplicated playback.
  This is owner-reported manual evidence, separate from the scripted soak.

Actual WebGL context loss, reduced-motion presentation on this phone, long
background/process-termination resilience, output-device changes, GPU/renderer
memory, older/iOS 17 hardware, iPad windowing and production signing/store
validation remain separate. VoiceOver and comprehensive keyboard-only coverage
remain excluded from this packaging scope by owner decision. In-game
reduced-motion design improvement is a separate follow-up. Backend-dependent
auth/session/reconnect acceptance remains blocked by #129.

### Repeat the iOS measurements

The shared fixture supports `?runs=30&soak=1200&manual=1`. The optional manual
flag waits for a real pointer release before beginning, so iOS audio can unlock
from touch; the workload clock still waits for visibility and aborts on document
visibility loss. Record the actual audio output and Silent Mode state, rather
than treating a running Web Audio context as proof of audible playback.

Keep optional local tools under `scripts/tauri-validation/ios/` and per-device
JSON reports excluded through `.git/info/exclude`; these are not in a fresh clone.
Use unique native report names for each run/launch and verify each row's PID
against the launch result before accepting readiness. The local recorder appends
to existing files; reused names can return stale rows. Validate/clone diagnostic
payloads through JSON serialization in JavaScript before posting to WKWebView so
cyclic inspection objects never reach the native JSON writer.

Raw evidence for this pass is under `/tmp/fall-ios-validation` and should be
preserved to a durable local location if needed. Do not commit UDIDs, serials,
provisioning profiles or unfiltered profiler data. Other machines/devices require
fresh measurements; the figures above are a dated reference only.

Use the macOS probe protocol above with a UIKit recorder: embed the document-start
JS in an Objective-C++ object compiled for `arm64-apple-ios17.0`, install the
WKWebView script/message handler, and record thermal state, app/scene visibility,
WebContent attribution and explicitly scoped host RSS. A constructor uptime marker
can measure native-initialization-to-readiness; label its missing OS/dyld portion.
For a local diagnostic build, temporarily add the object to Xcode `OTHER_LDFLAGS`,
build with `VITE_PACKAGING_SPIKE=1`, preserve the exported package, then restore
the project settings and build the normal app. Use `try/finally` restoration and
verify the normal binary does not contain the probe. Do not commit the linker
setting or ship the instrumented package.

Install/launch the copied diagnostic package with `xcrun devicectl`, supplying
`FALL_VALIDATION_CONFIG` and a unique report filename through launch environment
variables. The probe writes JSONL into the app’s temporary directory; copy it
using the app-data-container file service. Run captures on the physical device
with an initial touch and keep it visible/unlocked. Run launch/reload/offline and
route checks separately, retain failed/partial results, and restore the normal
package afterward. Restore by installing the normal app over the diagnostic
build; do not uninstall or clear the owner’s app data. See the optional local
runner README for concrete commands on this checkout.

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

## Representative packaging spike protocol

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

The following is the original planning sequence, not the recorded macOS run.
Use the checked-in dependency pins and the reproduction commands in the macOS
validation section above for the actual experiment:

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

| Target  | Current evidence                                                                                                                                                                                  | Required next evidence                                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS   | Measured Apple Silicon standalone app/DMG, routes, startup and capture soak; owner-verified controls, readable text, preference handling, audio/output changes and ordinary background use        | Context loss, controlled lifecycle, GPU/low-tier Mac, macOS 14/Intel runtime and signed distribution. VoiceOver/full keyboard-only coverage excluded from this scope by owner |
| iOS     | Measured physical iPhone 17 Pro standalone package, startup/routes/offline assets and capture soak; owner-verified orientation, touch/match/settings, audio, 30-second background and lock return | Context loss, renderer/GPU memory, longer suspension/forced termination, older hardware/iOS 17, iPad/windowing, output-device changes and production signing                  |
| Windows | Owner-reported initial run; toolchain, WebView2, hardware and timings not captured                                                                                                                | Reproducible Windows setup, installed build, DPI/GPU/input checks and exact environment                                                                                       |
| Linux   | Untested; no VM evidence collected                                                                                                                                                                | Owner's VirtualBox guest: OS, guest additions, graphics acceleration, WebKitGTK and traces; VM results must remain distinct from physical GPU validation                      |
| Android | Owner-reported initial run; physical/emulator environment and timings not captured                                                                                                                | Reproducible SDK/NDK/emulator image and acceleration evidence; physical Android GPU, thermal and audio checks remain untested                                                 |

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
