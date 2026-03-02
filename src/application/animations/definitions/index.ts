import type { AnimationDefinition } from "@application/animations/AnimationTypes";
import { orbitWobbleAnimationDefinition } from "@application/animations/definitions/OrbitWobbleAnimation";
import { pulseScaleAnimationDefinition } from "@application/animations/definitions/PulseScaleAnimation";
import { slideFadeAnimationDefinition } from "@application/animations/definitions/SlideFadeAnimation";

export const animationDefinitions: ReadonlyArray<AnimationDefinition> = [
  pulseScaleAnimationDefinition,
  slideFadeAnimationDefinition,
  orbitWobbleAnimationDefinition,
];
