# Capture sound audition exports

These are edited user-supplied sounds for the animation playground phase of #125.
Full originals remain in the supplied chat attachments; `edits.json` records their
SHA-256 fingerprints, source URLs, authors, exact source intervals and edits.
Credits & Licenses reads the corresponding entries in the credits inventory.

| Export                 | Source interval | Purpose                                             |
| ---------------------- | --------------- | --------------------------------------------------- |
| frozen-card-effect.mp3 | 1.400–1.950 s   | Short continuous texture while frost forms          |
| break-frozen-card.mp3  | 5.735–6.400 s   | One isolated crack and debris tail at contact       |
| simple-capture.mp3     | 0.395–0.715 s   | Whip crack attack and short decay at pickup contact |
| capture-flight.mp3     | 0.080–0.395 s   | Movement as the card leaves the hand                |
| heat-transfer.mp3      | 0.700–2.400 s   | Fire burst during the precontact lift               |
| flame-rise.mp3         | 6.100–7.500 s   | Wind from hand release until landing                |
| flame-impact.mp3       | 2.500–4.900 s   | Earth contact and rumble                            |

Selection used decoded waveform RMS, transient timing, silence separation and peak
measurements. This is an initial edit for human audition, not a claim of subjective
listening approval. The shatter original decodes above full scale; attenuation is
applied before encoding. All exports have fades and decoded peaks below 0.70.
The adapter adds per-cue gain under the user's master volume. Movement has its
own voice so freezing does not cancel it. At frozen contact, the ice clip plays
at gain 0.85 with the card-hit clip at gain 0.22 (normal card hit: 0.7). Their
conservative combined peak is below 0.52 before master volume, or below 0.61
including an overlapping movement tail. Each new impact stops previous impact
layers; the flame aftermath continues through following cascade pickups.
Reset/replay stops every voice. Only the flame wind loops when slower animation playback outlasts its excerpt;
contact, reset and replay stop it. Full-length originals are never stacked.

Re-export from the original attachment with FFmpeg: `atrim=start=START:end=END`,
`asetpts=PTS-STARTPTS`, `volume=GAIN`, then the fades from `edits.json` (fade-out
start is duration minus fade-out length). Use mono 44.1 kHz, libmp3lame 128 kbit/s,
and strip metadata. Do not trim again from these compressed exports.

The specific Pixabay source links were supplied on 2026-11-18. The shatter and
whip pages identify Lesiakower and Universfield and the Pixabay Content License.
Irhouen and the Content License were verified on the Russian-language page for
the same freeze item 619090; that verification URL is recorded in `edits.json`.
Original download certificates/dates were not supplied. Attribution and this
edit log do not imply that an unavailable verification has been completed.

Heat-transfer export added on 2026-11-18 from user-supplied `fire-card.mp3`.
The source contains two fire bursts separated by silence. The first burst's
0.700–2.400 s section keeps its swell and removes the long tail and second burst;
a 25 ms onset fade and 500 ms tail fade soften the cut. Gain 0.5 leaves decoded
peak headroom (0.503). Playback gain is 0.6 with a quiet card-contact layer at
0.22; their conservative combined peak is below 0.44 before master volume, or
below 0.52 with a movement tail. Fire begins during the elemental lift in Fall and at the start of the isolated
drop study. Its quiet card hit remains at contact and does not stop the fire. The source page identifies Alice_soundz and the Pixabay Content License.
Full source/verification links and the original hash are in `edits.json`.

Flame exports added on 2026-11-18 from user-supplied `blizzard.mp3` and
`earth-shake.mp3`, both credited to DRAGON-STUDIO under the Pixabay Content
License. The wind's 6.100–7.500 s rise uses gain 0.4 and 90/150 ms fades; its
decoded peak is 0.475. Runtime gain is 0.55. Fire uses the heat-transfer export
at gain 0.6 during the hover. The 1.4-second wind starts at hand release,
overlaps the fire and descent, then stops at contact. It loops if needed for
slower playback. The simple Fall movement sound is omitted from Flame impact.

The 2.4-second earth-only impact uses the recording's bass-heavy 2.500–4.900 s
swell at gain 0.42, with a 30 Hz high-pass, 12 ms onset fade and 600 ms tail
fade. It is downmixed to mono before a 0.7 limiter without makeup gain;
decoded peak is 0.693. Playback gain is 0.5. Fire is no longer baked into this
export, and the earth starts directly at contact without a delay or simple
card hit. Its tail continues through following pickups.

The wind and earth exports use mono 44.1 kHz MP3 at 160 kbit/s. Use the exact
earth filter in `edits.json`, including the limiter's latency compensation.
The manifest retains source fingerprints, URLs, verification and download-record
gaps. Human audition remains pending.
