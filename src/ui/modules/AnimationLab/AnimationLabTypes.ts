import type {
  AnimationDefinition,
  AnimationPlaybackSettings,
} from "@application/animations/AnimationRegistry";

export interface PanelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutState {
  list: PanelRect;
  preview: PanelRect;
  controls: PanelRect;
}

export interface PersistedLabState {
  playback?: Partial<AnimationPlaybackSettings>;
  params?: Record<string, number>;
  fixedStepMode?: boolean;
}

export type PersistedStore = Record<string, PersistedLabState>;

export interface AnimationListPanelProps {
  animationDefinitions: ReadonlyArray<AnimationDefinition>;
  selectedAnimationId: string;
  layout: LayoutState;
  onSelect: (animationId: string) => void;
}

export interface AnimationControlsPanelProps {
  layout: LayoutState;
  selectedDefinition: AnimationDefinition;
  playback: AnimationPlaybackSettings;
  fixedStepMode: boolean;
  isPlaying: boolean;
  animationParams: Record<string, number>;
  onPlaybackChange: (next: Partial<AnimationPlaybackSettings>) => void;
  onFixedStepToggle: () => void;
  onParameterAdjust: (key: string, delta: number) => void;
  onPlayPause: () => void;
  onReplay: () => void;
  onDefaults: () => void;
  onBackHome: () => void;
}
