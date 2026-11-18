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
    files: ["src/index.css (Google Fonts import)"],
    source: "https://github.com/NDISCOVER/Cinzel",
    license: "SIL Open Font License 1.1",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/cinzel/OFL.txt",
    notice: cinzelNotice,
    modifications: "Used through Google Fonts; Fall does not modify the font sources.",
    provenance: "third-party",
    evidence: "Official google/fonts Cinzel METADATA.pb and OFL.txt, retrieved 2026-11-17.",
  },
  {
    id: "spline-sans",
    name: "Spline Sans",
    creator: "Eben Sorkin · Mirko Velimirović · The Spline Sans Project Authors",
    files: ["src/index.css (Google Fonts import)"],
    source: "https://github.com/SorkinType/SplineSans",
    license: "SIL Open Font License 1.1",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/splinesans/OFL.txt",
    notice: splineNotice,
    modifications: "Used through Google Fonts; Fall does not modify the font sources.",
    provenance: "third-party",
    evidence: "Official google/fonts Spline Sans METADATA.pb and OFL.txt, retrieved 2026-11-17.",
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
    modifications: "Prepared as standalone landscape, tablet and phone backgrounds.",
  },
  {
    id: "hall",
    name: "Card Hall paintings and Traveller portrait",
    files: ["src/assets/lobby/card-hall/*.webp"],
    evidence: "docs/design/home-lobby/prompts.json; src/assets/lobby/card-hall/README.md",
    provenance: "generated",
  },
  {
    id: "tavern",
    name: "Tavern paintings, table and match props",
    files: ["src/assets/lobby/tavern/*", "src/assets/lobby/tavern-match/*.{webp,png}"],
    evidence:
      "docs/design/tavern/prompts.json; docs/design/tavern-match/prompts.json (includes supplied references)",
    provenance: "generated",
  },
  {
    id: "archive",
    name: "Rulebook archive",
    files: ["src/assets/rulebook/*"],
    evidence: "docs/design/how-to-play/prompts.json; src/assets/rulebook/README.md",
    provenance: "generated",
  },
  {
    id: "sings",
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
