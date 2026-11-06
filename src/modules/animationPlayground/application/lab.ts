export const deckCardCount = 40;

export type Study = "card" | "deck" | "table";

export type CardDropEffect = "plain" | "ice" | "heat" | "flame";

export type Experiment =
  | "flip"
  | "shake"
  | "ignite"
  | "freeze"
  | "heat-card"
  | "flame-card"
  | "drop-card"
  | "shatter-card"
  | "drop-hot-card"
  | "drop-flame-card"
  | "drop"
  | "sound"
  | "fan"
  | "riffle"
  | "deal"
  | "deal-center"
  | "play-card"
  | "fall-capture"
  | "capture-card"
  | "cascade-capture"
  | "reset-table";

export type LabState = Readonly<{
  faceUp: boolean;
  impact: number;
  fire: boolean;
  drops: number;
  cardFalls: number;
  cardFrozen: boolean;
  cardHot: boolean;
  cardFlaming: boolean;
  cardDropEffect: CardDropEffect;
  deckFanned: boolean;
  riffles: number;
  tableDeals: number;
  centerDeals: number;
  tablePlays: number;
  tableCaptures: number;
  captureIntensity: CardDropEffect;
  activeCaptureIntensity: CardDropEffect;
  activeCaptureMode: "fall" | "card" | "cascade";
}>;

export const initialLabState: LabState = {
  faceUp: true,
  impact: 0,
  fire: false,
  drops: 0,
  cardFalls: 0,
  cardFrozen: false,
  cardHot: false,
  cardFlaming: false,
  cardDropEffect: "plain",
  deckFanned: false,
  riffles: 0,
  tableDeals: 0,
  centerDeals: 0,
  tablePlays: 0,
  tableCaptures: 0,
  captureIntensity: "plain",
  activeCaptureIntensity: "plain",
  activeCaptureMode: "fall",
};

type LabReader = {
  getState: () => LabState;
  subscribe: (listener: (state: LabState, previous: LabState) => void) => () => void;
};

export type LabStatePort = LabReader & {
  update: (transition: (state: LabState) => LabState) => void;
};

export type AudioPort = { play: () => void; playDealCard: () => void };

export type Lab = LabReader & {
  run: (experiment: Experiment) => void;
  playDealCard: () => void;
  setCaptureIntensity: (effect: CardDropEffect) => void;
};

export function createLab(state: LabStatePort, audio: AudioPort): Lab {
  return {
    getState: state.getState,
    subscribe: state.subscribe,
    playDealCard: audio.playDealCard,
    setCaptureIntensity(effect) {
      state.update((current) => ({ ...current, captureIntensity: effect }));
    },
    run(experiment) {
      switch (experiment) {
        case "flip":
          state.update((current) => ({ ...current, faceUp: !current.faceUp, cardFalls: 0 }));
          break;
        case "shake":
          state.update((current) => ({ ...current, impact: current.impact + 1, cardFalls: 0 }));
          break;
        case "ignite":
          state.update((current) => ({
            ...current,
            fire: !current.fire,
            cardFalls: 0,
            cardFlaming: false,
          }));
          break;
        case "freeze":
          state.update((current) => ({
            ...current,
            cardFrozen: !current.cardFrozen,
            cardHot: false,
            cardFlaming: false,
            cardFalls: 0,
          }));
          break;
        case "heat-card":
          state.update((current) => ({
            ...current,
            cardHot: !current.cardHot,
            cardFrozen: false,
            cardFlaming: false,
            cardFalls: 0,
          }));
          break;
        case "flame-card":
          state.update((current) => ({
            ...current,
            cardFlaming: !current.cardFlaming,
            cardHot: false,
            cardFrozen: false,
            fire: false,
            cardFalls: 0,
          }));
          break;
        case "drop-card":
        case "shatter-card":
        case "drop-hot-card":
        case "drop-flame-card":
          state.update((current) => ({
            ...current,
            cardFalls: current.cardFalls + 1,
            cardFrozen: false,
            cardHot: false,
            cardFlaming: false,
            cardDropEffect:
              experiment === "shatter-card"
                ? "ice"
                : experiment === "drop-hot-card"
                  ? "heat"
                  : experiment === "drop-flame-card"
                    ? "flame"
                    : "plain",
          }));
          break;
        case "drop":
          state.update((current) => ({ ...current, drops: current.drops + 1, cardFalls: 0 }));
          break;
        case "fan":
          state.update((current) => ({ ...current, deckFanned: !current.deckFanned }));
          break;
        case "riffle":
          state.update((current) => ({ ...current, riffles: current.riffles + 1 }));
          break;
        case "deal":
          state.update((current) => ({
            ...current,
            tableDeals: current.tableDeals + 1,
            tablePlays: 0,
            tableCaptures: 0,
          }));
          break;
        case "deal-center":
          state.update((current) => ({ ...current, centerDeals: current.centerDeals + 1 }));
          break;
        case "play-card":
          state.update((current) =>
            current.tableDeals > 0 && !current.tableCaptures
              ? { ...current, tablePlays: current.tablePlays + 1 }
              : current,
          );
          break;
        case "fall-capture":
          state.update((current) =>
            current.tableDeals > 0 && !current.tablePlays
              ? {
                  ...current,
                  tableCaptures: current.tableCaptures + 1,
                  activeCaptureIntensity: current.captureIntensity,
                  activeCaptureMode: "fall",
                }
              : current,
          );
          break;
        case "capture-card":
        case "cascade-capture":
          state.update((current) =>
            current.tableDeals > 0 && current.centerDeals > 0 && !current.tablePlays
              ? {
                  ...current,
                  tableCaptures: current.tableCaptures + 1,
                  activeCaptureIntensity: "plain",
                  activeCaptureMode: experiment === "cascade-capture" ? "cascade" : "card",
                }
              : current,
          );
          break;
        case "reset-table":
          state.update((current) => ({
            ...current,
            tableDeals: 0,
            centerDeals: 0,
            tablePlays: 0,
            tableCaptures: 0,
          }));
          break;
        case "sound":
          audio.play();
          break;
      }
    },
  };
}
