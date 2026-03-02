export const animationEasingOptions = [
  "linear",
  "easeInOutSine",
  "easeOutCubic",
] as const;

export type AnimationEasing = (typeof animationEasingOptions)[number];

export interface AnimationPlaybackSettings {
  durationMs: number;
  delayMs: number;
  loop: boolean;
  easing: AnimationEasing;
}

export interface AnimationParameterDefinition {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface AnimationSampleInput {
  linearProgress: number;
  easedProgress: number;
  cycle: number;
  params: Readonly<Record<string, number>>;
}

export interface AnimationTransformSample {
  x: number;
  y: number;
  scale: number;
  alpha: number;
  rotation: number;
}

export interface AnimationDefinition {
  id: string;
  displayName: string;
  description: string;
  parameters: ReadonlyArray<AnimationParameterDefinition>;
  sample: (input: AnimationSampleInput) => AnimationTransformSample;
}
