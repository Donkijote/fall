import type { Experiment, Study } from "./lab";

type Lesson = {
  experiment: Experiment;
  label: string;
  libraries: string;
  description: string;
  toggle?: {
    state: "fire" | "deckFanned" | "cardFrozen" | "cardHot" | "cardFlaming";
    activeLabel: string;
  };
};

const cardLessons: Lesson[] = [
  {
    experiment: "flip",
    label: "Flip card",
    libraries: "GSAP · Zustand",
    description:
      "Reverse a timeline to turn the card. Zustand lets the button and the 3D card trigger the same action.",
  },
  {
    experiment: "shake",
    label: "Shake card",
    libraries: "GSAP",
    description:
      "Play a short impact timeline on a separate group, so you can shake the card mid-flip.",
  },
  {
    experiment: "ignite",
    label: "Ignite",
    libraries: "three.quarks",
    toggle: { state: "fire", activeLabel: "Extinguish" },
    description:
      "Emit rising embers with Quarks. Change the emission rate in Live tuning and watch the density change.",
  },
  {
    experiment: "freeze",
    label: "Freeze card",
    libraries: "Three.js · GLSL",
    toggle: { state: "cardFrozen", activeLabel: "Thaw card" },
    description:
      "Watch ice spread from the edges and form crystal cracks. Flip the card to inspect both faces.",
  },
  {
    experiment: "heat-card",
    label: "Heat card",
    libraries: "Three.js · GLSL",
    toggle: { state: "cardHot", activeLabel: "Cool card" },
    description: "Heat the card until its edges glow. Reset the scene to let the heat fade.",
  },
  {
    experiment: "flame-card",
    label: "Flame card",
    libraries: "three.quarks · GLSL",
    toggle: { state: "cardFlaming", activeLabel: "Extinguish flame card" },
    description:
      "Watch curling flames wrap the card while smoke and embers rise from the scorched edges.",
  },
  {
    experiment: "drop-card",
    label: "Drop card",
    libraries: "GSAP · Three.js",
    description:
      "Drop a card onto a face-up card. Watch the corner hit first, then the card slap down and settle.",
  },
  {
    experiment: "shatter-card",
    label: "Shatter frozen card",
    libraries: "GSAP · Three.js",
    description: "Drop a frozen card onto another card and watch the ice scatter when they hit.",
  },
  {
    experiment: "drop-hot-card",
    label: "Drop hot card",
    libraries: "GSAP · Three.js",
    description:
      "Drop a hot card and watch heat spread around the impact point on the card underneath. Both cool down after impact.",
  },
  {
    experiment: "drop-flame-card",
    label: "Drop flame card",
    libraries: "GSAP · Three.js",
    description:
      "Slam a burning card into the table. A fire wave shakes the felt, throws sparks, and scorches both cards.",
  },
  {
    experiment: "drop",
    label: "Drop chip",
    libraries: "Rapier",
    description: "Release a poker chip and watch gravity and restitution determine its motion.",
  },
  {
    experiment: "sound",
    label: "Play sound",
    libraries: "Howler",
    description: "Play a short local cue to try the audio path.",
  },
];

const deckLessons: Lesson[] = [
  {
    experiment: "fan",
    label: "Fan deck",
    libraries: "GSAP · Zustand",
    description: "Spread the cards into an arc, then reset the scene to close the stack.",
    toggle: { state: "deckFanned", activeLabel: "Close fan" },
  },
  {
    experiment: "riffle",
    label: "Riffle deck",
    libraries: "GSAP",
    description:
      "Lift the packet and release the cards from bottom to top. Try it with the stack closed and the fan open.",
  },
];

const tableLessons: Lesson[] = [
  {
    experiment: "deal",
    label: "Deal cards",
    libraries: "GSAP · Zustand",
    description: "Deal three rounds to the right, far, and left players, then the dealer.",
  },
  {
    experiment: "deal-center",
    label: "Deal center cards",
    libraries: "GSAP · Zustand",
    description: "Deal four cards into a 2×2 grid and turn them face up as they travel.",
  },
  {
    experiment: "play-card",
    label: "Play a card",
    libraries: "GSAP · Zustand",
    description: "The player on the right plays their top card face up beside the center grid.",
  },
  {
    experiment: "fall-capture",
    label: "Fall capture",
    libraries: "GSAP · Three.js",
    description:
      "The far player sets down a card. The right player drops its match from their hand and collects the pair face down.",
  },
  {
    experiment: "capture-card",
    label: "Capture card",
    libraries: "GSAP · Three.js",
    description:
      "Play a card onto one already on the table, pick up the pair, and place them face down on the player's captured-card stack to their right.",
  },
  {
    experiment: "reset-table",
    label: "Reset table",
    libraries: "GSAP",
    description: "Bring every card back to the deck, even if the deal is still running.",
  },
];

export const lessonsByStudy = { card: cardLessons, deck: deckLessons, table: tableLessons };

export const studies: { value: Study; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "deck", label: "Deck stack" },
  { value: "table", label: "Table" },
];
