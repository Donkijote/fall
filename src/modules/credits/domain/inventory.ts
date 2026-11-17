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
  login: "docs/design/login/prompts.json",
  "legacy-formats": "src/assets/lobby",
  cards: "src/assets/cards",
  sounds: "src/assets/cards",
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

export const artworkAttributions: Attribution[] = [
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
      "docs/design/login/prompts.json records supplied artwork; upstream ownership not established",
    provenance: "unresolved",
  },
  {
    id: "legacy-formats",
    name: "Earlier game-format illustrations",
    files: [
      "src/assets/lobby/1vs1.webp",
      "src/assets/lobby/1vs2.webp",
      "src/assets/lobby/2vs2.webp",
    ],
    evidence: "Existing runtime asset directory; no adjacent provenance record",
    provenance: "unresolved",
  },
  {
    id: "cards",
    name: "Spanish deck faces and card back",
    files: ["src/assets/cards/**/*.svg"],
    evidence: "Imported SVGs and git history; upstream source and license need confirmation",
    provenance: "unresolved",
  },
  {
    id: "sounds",
    name: "Card and ember sounds",
    files: [
      "src/assets/cards/play-card.mp3",
      "src/assets/cards/deal-card.mp3",
      "src/assets/audio/ember.wav",
    ],
    evidence: "Existing audio adapters and animation effects; source and license need confirmation",
    provenance: "unresolved",
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
    evidence: "Project effects; original source and permissions awaiting confirmation",
    provenance: "unresolved",
  },
  {
    id: "public-icons",
    name: "App icons and favicon exports",
    files: ["public/*.{png,svg,ico}"],
    evidence: "Public app icon variants; mapping each export to its source remains to be confirmed",
    provenance: "unresolved",
  },
].map((entry) => ({
  ...entry,
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
})) as Attribution[];

export const creditsInventory = {
  project: {
    name: "Fall",
    creator: "Donkijote",
    source: "https://github.com/Donkijote/fall",
    license: "MIT License",
    notice: projectLicense,
  },
  artwork: artworkAttributions,
  icons: iconAttributions,
  fonts: fontAttributions,
  software: softwareNotices,
};
