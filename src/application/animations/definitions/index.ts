import type { AnimationDefinition } from "@application/animations/AnimationTypes";
import { dealerAnimationDefinition } from "@application/animations/definitions/DealerAnimation";
import { dealerToTableAnimationDefinition } from "@application/animations/definitions/DealerToTableAnimation";
import { orbitWobbleAnimationDefinition } from "@application/animations/definitions/OrbitWobbleAnimation";
import { pulseScaleAnimationDefinition } from "@application/animations/definitions/PulseScaleAnimation";
import { slideFadeAnimationDefinition } from "@application/animations/definitions/SlideFadeAnimation";

export const animationDefinitions: ReadonlyArray<AnimationDefinition> = [
  dealerAnimationDefinition,
  dealerToTableAnimationDefinition,
  pulseScaleAnimationDefinition,
  slideFadeAnimationDefinition,
  orbitWobbleAnimationDefinition,
];
