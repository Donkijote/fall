import projectLicense from "../../../../LICENSE?raw";
import type { Attribution } from "./attribution";
import cinzelNotice from "./notices/cinzel.txt?raw";
import splineNotice from "./notices/spline-sans.txt?raw";
import softwareNotices from "./software-notices.json";

const ccBy = "https://creativecommons.org/licenses/by/3.0/";
const sourceRoot = "https://github.com/Donkijote/fall/blob/develop/";
const evidencePages: Record<string, string> = {
  hall: "docs/design/home-lobby/prompts.json",
  tavern: "docs/design/tavern-match/prompts.json",
  "clean-table-plaque": "docs/design/tavern-match/prompts.json",
  "matching-card-frame": "docs/design/tavern-match/prompts.json",
  archive: "docs/design/how-to-play/prompts.json",
  sings: "docs/design/sings-reference/prompts.json",
  controls: "src/components/README.md",
  credits: "docs/design/credits-licenses/prompts.json",
  login: "docs/design/login/prompts.json",
  cards: "src/assets/cards",
  geometry: "src/assets/lobby/card-hall/icons/README.md",
  effects: "src/assets/effects",
  "public-icons": "public",
};
const iconGroups = [
  {
    creator: "Lorc",
    icons: [
      "visored-helm",
      "scroll-unfurled",
      "envelope",
      "cog",
      "cut-diamond",
      "scales",
      "wingfoot",
      "padlock",
      "jeweled-chalice",
      "crossed-swords",
      "wooden-door",
      "cross-mark",
      "trophy",
      "hunting-horn",
    ],
  },
  {
    creator: "Delapouite",
    icons: [
      "two-coins",
      "three-friends",
      "wood-club",
      "plain-arrow",
      "sparkles",
      "stairs",
      "round-table",
      "wooden-chair",
    ],
  },
  { creator: "Faithtoken", icons: ["card-pick", "card-draw"] },
  { creator: "Sbed", icons: ["electric"] },
  { creator: "Skoll", icons: ["rank-1", "open-palm"] },
];

export const iconAttributions: Attribution[] = iconGroups.map(({ creator, icons }) => ({
  id: `game-icons-${creator.toLowerCase()}`,
  name: icons.map((icon) => icon.replaceAll("-", " ")).join(" · "),
  creator,
  files: icons.map((icon) =>
    icon === "wingfoot" ? "src/assets/branding/wingfoot.svg" : `src/assets/**/${icon}.svg`,
  ),
  source: `https://game-icons.net/1x1/${creator.toLowerCase()}/${icons[0]}.html`,
  license: "Creative Commons Attribution 3.0 Unported (CC BY 3.0)",
  licenseUrl: ccBy,
  notice: `Icons made by ${creator} for Game-icons.net. Licensed under CC BY 3.0.`,
  modifications:
    "Source silhouettes are retained. Fall applies its own colors and gradients through masks.",
  provenance: "third-party",
  evidence: "src/assets/{icons,login/icons,lobby/card-hall/icons,lobby/tavern-match}/README.md",
}));

export const fontAttributions: Attribution[] = [
  {
    id: "cinzel",
    name: "Cinzel",
    creator: "Natanael Gama · The Cinzel Project Authors",
    files: ["src/assets/fonts/Cinzel-Variable.ttf"],
    source: "https://github.com/NDISCOVER/Cinzel",
    license: "SIL Open Font License 1.1",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/cinzel/OFL.txt",
    notice: cinzelNotice,
    modifications:
      "Self-hosted official Google Fonts variable TTF; Fall does not modify the font sources.",
    provenance: "third-party",
    evidence:
      "Official google/fonts Cinzel METADATA.pb and OFL.txt verified 2026-11-17. Pinned binary and unchanged OFL notice verified 2026-11-21; src/assets/fonts/sources.json and README.md.",
  },
  {
    id: "spline-sans",
    name: "Spline Sans",
    creator: "Eben Sorkin · Mirko Velimirović · The Spline Sans Project Authors",
    files: ["src/assets/fonts/SplineSans-Variable.ttf"],
    source: "https://github.com/SorkinType/SplineSans",
    license: "SIL Open Font License 1.1",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/splinesans/OFL.txt",
    notice: splineNotice,
    modifications:
      "Self-hosted official Google Fonts variable TTF; Fall does not modify the font sources.",
    provenance: "third-party",
    evidence:
      "Official google/fonts Spline Sans METADATA.pb and OFL.txt verified 2026-11-17. Pinned binary and unchanged OFL notice verified 2026-11-21; src/assets/fonts/sources.json and README.md.",
  },
];

type ArtworkRecord = Pick<Attribution, "id" | "name" | "files" | "evidence" | "provenance"> &
  Partial<Attribution>;

const artworkRecords: ArtworkRecord[] = [
  {
    id: "credits",
    name: "Credits atelier",
    files: ["src/assets/credits/*.webp"],
    provenance: "generated",
    creator: "Generated with OpenAI ImageGen for Fall",
    evidence:
      "Generated 2026-11-18 with built-in ImageGen. The Card Hall and rulebook archive were palette/material references; the atelier landscape and dedicated phone/tablet recompositions were generated as standalone backgrounds. Provider model ID is not exposed by the tool. Prompts and exports: docs/design/credits-licenses/prompts.json.",
    modifications:
      "Landscape export retained for #137; obsolete portrait phone/tablet exports removed 2026-11-20. Original generation evidence: docs/artwork-provenance/retired-portrait-exports.json.",
  },
  {
    id: "hall",
    modifications:
      "Portrait-only runtime backgrounds retired in #137 on 2026-11-20. Historical prompts and edits: docs/artwork-provenance/retired-portrait-exports.json. Retained landscape artwork and permission status are unchanged.",
    name: "Card Hall paintings and Traveller portrait",
    files: ["src/assets/lobby/card-hall/*.webp"],
    evidence: "docs/design/home-lobby/prompts.json; src/assets/lobby/card-hall/README.md",
    provenance: "generated",
  },
  {
    id: "tavern",
    modifications:
      "Portrait-only runtime backgrounds retired in #137 on 2026-11-20. Historical prompts and edits: docs/artwork-provenance/retired-portrait-exports.json. Retained landscape artwork and permission status are unchanged.",
    name: "Tavern paintings, table and match props",
    files: ["src/assets/lobby/tavern/*", "src/assets/lobby/tavern-match/*.{webp,png}"],
    evidence:
      "docs/design/tavern/prompts.json; docs/design/tavern-match/prompts.json (includes supplied references)",
    provenance: "generated",
  },
  {
    id: "clean-table-plaque",
    name: "Clean-table and perfect-table bonus plaque",
    creator: "Generated with OpenAI image_gen for Fall",
    files: ["src/assets/lobby/tavern-match/clean-table-plaque.webp"],
    provenance: "generated",
    licenseStatus: "provider-terms-pending",
    evidence:
      "Generated and approved 2026-11-23 using built-in image_gen; model ID is not exposed. The edit used the shipped brass frame, seat plaque and primary-button artwork as direct style references. Original prompt, final refinement, references, selected master and export: docs/design/tavern-match/prompts.json. The rejected first draft is not shipped. The same approved plaque is reused for perfect-table awards without a new generation. Provider-term review is separate and pending.",
    modifications:
      "Resized the selected standalone 1536 × 1024 master to 768 × 512 WebP at quality 87 with alpha quality 100; preserved the full composition and transparency without cropping, recoloring or painted labels.",
  },
  {
    id: "matching-card-frame",
    name: "Illustrated matching-card bonus frame",
    creator: "Generated with OpenAI image_gen for Fall",
    files: ["src/assets/lobby/tavern-match/matching-card-frame.webp"],
    provenance: "generated",
    licenseStatus: "provider-terms-pending",
    evidence:
      "Generated 2026-11-23 using built-in image_gen; model ID is not exposed. The shipped brass frame was edited into a portrait card overlay with the approved bonus plaque as a direct palette reference. Prompt, input references, standalone master and export settings: docs/design/tavern-match/prompts.json. Provider-term review remains separate and pending.",
    modifications:
      "Resampled the complete 1070 × 1470 RGBA master to 504 × 704 WebP at quality 90 and alpha quality 100, normalizing to the 63:88 card ratio without cropping. The same alpha masks a GSAP light sweep. No glow, cast shadow or painted card face was added.",
  },
  {
    id: "archive",
    modifications:
      "Portrait-only runtime backgrounds retired in #137 on 2026-11-20. Historical prompts and edits: docs/artwork-provenance/retired-portrait-exports.json. Retained landscape artwork and permission status are unchanged.",
    name: "Rulebook archive",
    files: ["src/assets/rulebook/*"],
    evidence: "docs/design/how-to-play/prompts.json; src/assets/rulebook/README.md",
    provenance: "generated",
  },
  {
    id: "sings",
    modifications:
      "Portrait-only runtime backgrounds retired in #137 on 2026-11-20. Historical prompts and edits: docs/artwork-provenance/retired-portrait-exports.json. Retained landscape artwork and permission status are unchanged.",
    name: "Sings sorting table and props",
    files: ["src/assets/sings-reference/*"],
    evidence: "docs/design/sings-reference/prompts.json",
    provenance: "generated",
  },
  {
    id: "controls",
    name: "Interface frames, buttons and dividers",
    files: ["src/assets/ui/**"],
    evidence:
      "docs/design/{action-button,choice-button,text-input,arrow-divider,framed-card,player-identity,settings}/prompts.json",
    provenance: "generated",
  },
  {
    id: "login",
    name: "Login mountain castle",
    files: ["src/assets/login/mountain-castle.png"],
    evidence:
      "User confirmed on 2026-11-17: generated through Google Stitch and taken from its mockup; docs/design/login/prompts.json records the supplied image.",
    provenance: "generated",
    creator: "Generated through Google Stitch for Fall",
    source: "https://stitch.google.com/",
    licenseStatus: "provider-terms-pending",
  },
  {
    id: "cards",
    name: "Spanish deck faces and card back",
    files: ["src/assets/cards/**/*.svg"],
    evidence:
      "User confirmed on 2026-11-17: manually redrawn in Adobe Illustrator from a Shutterstock artwork reference; permission records and the exact listing/artist have not been established. Replacement with independently generated faces and back is planned.",
    provenance: "third-party",
    creator: "SVG adaptation by Donkijote; reference artist not yet identified",
    source: "https://www.shutterstock.com/",
    license: "Permission not established; replacement planned",
    licenseUrl: "https://www.shutterstock.com/terms",
    licenseStatus: "permission-pending",
    notice:
      "This deck adapts third-party reference artwork. An independently created replacement deck is planned; credit does not establish permission to use the current reference artwork.",
    modifications: "Redrawn as SVG in Adobe Illustrator from a Shutterstock reference.",
  },
  {
    id: "deal-card-sound",
    name: "Taking playing card - 2 (deal card)",
    files: ["src/assets/cards/deal-card.mp3"],
    evidence:
      "User supplied Pixabay item 522516 on 2026-11-18 in deal/play order. Creator and Pixabay Content License verified from the item's official page. Original download date and any file edits are not recorded.",
    provenance: "third-party",
    creator: "OxidVideos",
    source:
      "https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-taking-playing-card-2-522516/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Taking playing card - 2 by OxidVideos, obtained from Pixabay.",
    modifications:
      "Used as a card-dealing sound effect. Any edits to the original download are not recorded.",
  },
  {
    id: "play-card-sound",
    name: "Taking playing card 3 (play card)",
    files: ["src/assets/cards/play-card.mp3"],
    evidence:
      "User supplied Pixabay item 522513 on 2026-11-18 in deal/play order. Creator and Pixabay Content License verified from the item's official page. Original download date and any file edits are not recorded.",
    provenance: "third-party",
    creator: "OxidVideos",
    source:
      "https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-taking-playing-card-3-522513/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Taking playing card 3 by OxidVideos, obtained from Pixabay.",
    modifications:
      "Used as a card-playing sound effect. Any edits to the original download are not recorded.",
  },
  {
    id: "freeze-capture-sound",
    name: "Ice and mud",
    files: ["src/assets/audio/captures/frozen-card-effect.mp3"],
    creator: "Irhouen",
    source: "https://pixabay.com/es/sound-effects/naturaleza-ice-and-mud-619090/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Ice and mud by Irhouen, obtained from Pixabay.",
    modifications:
      "Playground audition: excerpt 1.400–1.950 s; linear gain 0.55; 0.035 s fade in and 0.09 s fade out; mono 44.1 kHz MP3 at 128 kbit/s. See edits.json for source fingerprint.",
    provenance: "third-party",
    evidence:
      "User supplied original MP3 and specific Pixabay item URL on 2026-11-18. Source hash, selected interval, attenuation and fades recorded in src/assets/audio/captures/edits.json. Original download record not supplied. Creator and Content License verified on the Russian-language official page for the same Pixabay item 619090 on 2026-11-18; the supplied Spanish page was unavailable. Verification URL recorded in edits.json.",
  },
  {
    id: "shatter-capture-sound",
    name: "Chunks of Ice Shattering | Ice Blocks Breaking",
    files: ["src/assets/audio/captures/break-frozen-card.mp3"],
    creator: "Lesiakower",
    source:
      "https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-chunks-of-ice-shattering-ice-blocks-breaking-466220/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Chunks of Ice Shattering | Ice Blocks Breaking by Lesiakower, obtained from Pixabay.",
    modifications:
      "Playground audition: card-contact layer mixed underneath ice at playback gain 0.22 (normal card contact 0.7); ice excerpt 5.735–6.400 s; linear gain 0.45; 0.002 s fade in and 0.1 s fade out; mono 44.1 kHz MP3 at 128 kbit/s. See edits.json for source fingerprint.",
    provenance: "third-party",
    evidence:
      "User supplied original MP3 and specific Pixabay item URL on 2026-11-18. Source hash, selected interval, attenuation and fades recorded in src/assets/audio/captures/edits.json. Original download record not supplied. Creator and Content License identified on the official item page on 2026-11-18.",
  },
  {
    id: "simple-capture-sound",
    name: "Whip Crack 02",
    files: [
      "src/assets/audio/captures/simple-capture.mp3",
      "src/assets/audio/captures/capture-flight.mp3",
    ],
    creator: "Universfield",
    source:
      "https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-whip-crack-02-244949/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Whip Crack 02 by Universfield, obtained from Pixabay.",
    modifications:
      "Playground audition: movement excerpt 0.080–0.395 s at gain 2.5 with 15/25 ms fades, and contact excerpt 0.395–0.715 s at gain 0.65; 0.002 s fade in and 0.06 s fade out; mono 44.1 kHz MP3 at 128 kbit/s. See edits.json for source fingerprint.",
    provenance: "third-party",
    evidence:
      "User supplied original MP3 and specific Pixabay item URL on 2026-11-18. Source hash, selected interval, attenuation and fades recorded in src/assets/audio/captures/edits.json. Original download record not supplied. Creator and Content License identified on the official item page on 2026-11-18.",
  },
  {
    id: "heat-transfer-sound",
    name: "Fire Sound Effects (heat transfer)",
    files: ["src/assets/audio/captures/heat-transfer.mp3"],
    creator: "Alice_soundz",
    source:
      "https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-fire-sound-effects-224089/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Fire Sound Effects by Alice_soundz, obtained from Pixabay.",
    modifications:
      "Also plays during the Flame impact hover, overlapping flight wind before earth contact. Heat-transfer audition: excerpt 0.700–2.400 s from the first fire burst; linear gain 0.5; 25 ms fade in and 500 ms fade out; mono 44.1 kHz MP3 at 128 kbit/s. Playback gain 0.6 during the precontact lift, with a later card-contact layer at gain 0.22. See edits.json for source fingerprint and export details.",
    provenance: "third-party",
    evidence:
      "User supplied original fire-card.mp3 and specific Pixabay item 224089 URL on 2026-11-18. Creator and Content License verified on the English-language official item page; verification URL recorded in src/assets/audio/captures/edits.json. Original download certificate/date not supplied.",
  },
  {
    id: "flame-buildup-sound",
    name: "Blizzard Wind (flame flight)",
    files: ["src/assets/audio/captures/flame-rise.mp3"],
    creator: "DRAGON-STUDIO",
    source: "https://pixabay.com/es/sound-effects/naturaleza-blizzard-wind-463217/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Blizzard Wind by DRAGON-STUDIO, obtained from Pixabay.",
    modifications:
      "Flame audition: rising wind excerpt 6.100–7.500 s; gain 0.4; 90 ms fade in and 150 ms fade out; mono 44.1 kHz MP3 at 160 kbit/s. Playback gain 0.55 from hand release until contact, overlapping the hover fire; loops for slower playback and stops at contact. See edits.json for source fingerprint.",
    provenance: "third-party",
    evidence:
      "User supplied blizzard.mp3 and Pixabay item 463217 URL on 2026-11-18. Creator and Content License verified on the official item page. Original download certificate/date not supplied.",
  },
  {
    id: "flame-earth-impact-sound",
    name: "Earth Spell Impact (flame impact and rumble)",
    files: ["src/assets/audio/captures/flame-impact.mp3"],
    creator: "DRAGON-STUDIO",
    source: "https://pixabay.com/es/sound-effects/horror-earth-spell-impact-478381/",
    license: "Pixabay Content License",
    licenseUrl: "https://pixabay.com/service/license-summary/",
    licenseStatus: "source-verified",
    notice: "Earth Spell Impact by DRAGON-STUDIO, obtained from Pixabay.",
    modifications:
      "Flame audition: excerpt 2.500–4.900 s, 30 Hz high-pass, gain 0.42, 12 ms fade in and 600 ms fade out. Starts at contact; fire plays separately during the hover. Mono export limited to 0.7 without makeup gain; 44.1 kHz MP3 at 160 kbit/s. Playback gain 0.5. Exact filter and source hash are in edits.json.",
    provenance: "third-party",
    evidence:
      "User supplied earth-shake.mp3 and Pixabay item 478381 URL on 2026-11-18. Creator and Content License verified on the official item page. Original download certificate/date not supplied.",
  },
  {
    id: "geometry",
    name: "Help and Log out icons",
    files: [
      "src/assets/lobby/card-hall/icons/help.svg",
      "src/assets/lobby/card-hall/icons/logout.svg",
    ],
    evidence: "Card Hall icon README documents Help and Log out as project-drawn",
    provenance: "original",
  },
  {
    id: "effects",
    name: "Foreground mask and ember effect",
    files: ["src/assets/login/foreground-mask.svg", "src/assets/effects/ember.svg"],
    evidence:
      "User confirmed the foreground mask and ember SVG were generated on 2026-11-17; generation provider and original records are not yet recorded.",
    provenance: "generated",
    licenseStatus: "provider-terms-pending",
  },
  {
    id: "public-icons",
    name: "App icons and favicon exports",
    files: ["public/*.{png,svg,ico}"],
    evidence:
      "User confirmed the current app icons/favicons were generated on 2026-11-17. Generation provider and mapping of individual exports to the original master remain to be recorded.",
    provenance: "generated",
    licenseStatus: "provider-terms-pending",
  },
];

export const artworkAttributions: Attribution[] = artworkRecords.map((entry) => ({
  creator:
    entry.provenance === "generated"
      ? "Generated artwork prepared for Fall"
      : entry.provenance === "original"
        ? "Fall project"
        : "Source awaiting confirmation",
  source: `${sourceRoot}${evidencePages[entry.id]}`,
  license:
    entry.provenance === "unresolved"
      ? "License awaiting confirmation"
      : "Project provenance record; no third-party license grant asserted",
  notice:
    entry.provenance === "unresolved"
      ? "Attribution details are being verified."
      : "Original and generated artwork provenance is recorded separately from third-party licenses.",
  modifications:
    "Runtime assets may be resized, converted to WebP, masked or tinted. See the source record for individual export details.",
  ...(entry.provenance === "generated" ? { licenseStatus: "provider-terms-pending" as const } : {}),
  ...entry,
}));

export const creditsInventory = {
  project: {
    name: "Fall",
    creator: "Donkijote",
    source: "https://github.com/Donkijote/fall",
    license: "Proprietary · All rights reserved",
    notice: projectLicense,
  },
  artwork: artworkAttributions,
  icons: iconAttributions,
  fonts: fontAttributions,
  software: softwareNotices,
};
