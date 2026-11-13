import { useMemo } from "react";

import type { CardDropEffect, CardPoint } from "../motion/cardFlights";
import { sampleCardImpact } from "../motion/cardImpactMotion";
import { captureDuration, captureElement, impactAt } from "../motion/tableCapture";
import type { HeatUniforms } from "./cardHeat";
import { FlameEnvelope } from "./FlameEnvelope";
import { FlameImpact } from "./FlameImpact";
import { HeatImpactWave } from "./HeatImpactWave";
import { IceShards } from "./IceShards";

export function useFallImpactEffects(effect: CardDropEffect) {
  return useMemo(() => {
    const frost = { current: { value: 0 } };
    const playedHeat = {
      current: {
        strength: { value: 0 },
        time: { value: 0 },
        scorch: { value: 0 },
        ignition: { value: 0 },
      } satisfies HeatUniforms,
    };
    const targetHeat = {
      current: {
        strength: { value: 0 },
        time: { value: 0 },
        scorch: { value: 0 },
        impact: { value: [0.16, 0.19, effect === "flame" ? 0 : 0.54] },
      } satisfies HeatUniforms,
    };
    const heatWave = { current: { value: 0 } };
    const shards = { current: { value: 0 } };
    const blast = { current: { blast: 0, burn: 0 } };
    const flameOpacity = { current: { value: 0 } };
    const flameIgnition = { current: { value: 0 } };

    return {
      effect,
      frost,
      playedHeat,
      targetHeat,
      heatWave,
      shards,
      blast,
      flameOpacity,
      flameIgnition,
      sample(progress: number, aftermath: number, time: number) {
        const duration = captureDuration(effect);
        const impact = sampleCardImpact(
          effect,
          (progress - impactAt) * duration + aftermath,
          (1 - impactAt) * duration,
        );
        const prime = captureElement(progress, effect);
        frost.current.value = prime * impact.frost;
        playedHeat.current.time.value = time;
        targetHeat.current.time.value = time;
        playedHeat.current.strength.value = prime * impact.topHeat;
        targetHeat.current.strength.value = impact.bottomHeat;
        playedHeat.current.scorch.value = prime * impact.topScorch;
        targetHeat.current.scorch.value = impact.bottomScorch;
        playedHeat.current.ignition.value = effect === "flame" ? prime : 1;
        flameIgnition.current.value = prime;
        flameOpacity.current.value = impact.fireLife;
        shards.current.value = impact.shards;
        heatWave.current.value = impact.heatWave;
        blast.current.blast = impact.blast;
        blast.current.burn = impact.burn;
        return impact;
      },
    };
  }, [effect]);
}

type Effects = ReturnType<typeof useFallImpactEffects>;

export function FallImpactEffects({
  effects,
  at,
  scale,
}: {
  effects: Effects;
  at: CardPoint;
  scale: number;
}) {
  return (
    <group position={[at.x, at.y, at.z + 0.01]} scale={scale}>
      {effects.effect === "ice" && (
        <group position={[-0.11, -0.05, 0]} scale={0.49}>
          <IceShards progress={effects.shards} />
        </group>
      )}
      {effects.effect === "heat" && (
        <group position={[0.07, 0, 0]} scale={0.88}>
          <HeatImpactWave motion={effects.heatWave} />
        </group>
      )}
      {effects.effect === "flame" && (
        <group position={[-0.1, -0.055, 0]} scale={0.69}>
          <FlameImpact motion={effects.blast} overhead />
        </group>
      )}
    </group>
  );
}

export function FallFlameTrail({ effects }: { effects: Effects }) {
  return <FlameEnvelope opacity={effects.flameOpacity} ignition={effects.flameIgnition} />;
}
