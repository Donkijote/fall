# Login

The lazy-loaded `/login` route renders `LoginScreen` as a presentation preview.
Email and password fields are editable, and the form suppresses submission.
Provider, recovery, and account creation actions are placeholders.
**Take your seat** navigates to the Hall through React Router.

`LoginScreen.tsx` composes the shared `FramedCard`, `ActionButton`, and
`TextInput` with the existing theme. Compact landscape places the form and
providers side by side. Portrait stacks them and allows scrolling for short
viewports and the on-screen keyboard. The design references explain how the
Hall materials carry over into the form. [Login mockups](../../../docs/design/login/README.md)

## Atmosphere

`LoginAtmosphere.tsx` displays the 512 × 512 mountain painting with a static
vignette and progressively loads `scene/AtmosphereCanvas.tsx` when WebGL 2 and
motion preferences allow. Reduced motion, data saving, and WebGL failures
retain the static backdrop. The decorative layers are hidden from assistive
technology and let pointer events pass through to the form.

The scene composites the distant landscape, far fog, distant embers, valley
fog, foreground trees, and near embers in that order. The foreground mask and
painting share a cover crop and coordinate system. Retune both if the painting
changes. The scene pauses while the document is hidden. Compact devices use a
lower pixel ratio and particle budget.

Fog and embers advance using elapsed frame time. Pointer motion adds parallax.
`animateMaterials.ts` updates the attached shader uniforms because React Three
Fiber copies scalar uniform wrappers during prop application.

The supplied original is stored locally for both render paths.
[Runtime painting](../../assets/login/mountain-castle.png) ·
[Supplied image](https://lh3.googleusercontent.com/aida-public/AB6AXuAKaXX2NpZGOiKY03IIoZqBkCIr-iky3MJZoj-Bqoibja80wp6Fx4Sng0afqhOmHsEF93HbNicBjJsO2Sigdvfqg6x9cvgKWfdOiD9JzmXjRVjiMwUbb00yJDZBmM5SetfGBZiml7YCyTInQCEhbVf_HeUQxNwtQmexsUnn8FZNNfeLgECiE4PEm2i7Hs-iOQnrRS-x3gZBZ-DDVzaD5U31EOT-t6ynn8Tzmh2-o94pFpr16mMPz2pzv_AVIDpHQdX_zXem8Eeid8k) ·
[Foreground mask](../../assets/login/foreground-mask.svg) ·
[Icon credits](../../assets/login/icons/README.md)

## Interface motion

GSAP animates the intro and card entrance, the brass rim highlight, and the
WebGL reveal after its first frame. `LoginScreen.css` defines the static rim
gradient and mask. GSAP drives the angle and opacity. The scoped timelines
revert when the screen unmounts or reduced motion is enabled.

## Verification

The screen, atmosphere, shader uniform, and router tests cover form behavior,
navigation, preference changes, fallback behavior, and renderer cleanup.
After changing the scene or layout, use the existing app to check both themes,
short portrait and landscape viewports, reduced motion, and mask alignment.
The unit tests exercise scene behavior without rendering WebGL pixels.

The module entry point exports `loginGallery` for the development-only
Component gallery. Its preview fixtures live under `ui/components/previews`.
