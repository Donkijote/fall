import gsap from "gsap";
import { useRef } from "react";
import { MathUtils } from "three";
import type { Group, MeshBasicMaterial, PointLight } from "three";

import { useGSAP } from "@gsap/react";
import { PerspectiveCamera, RoundedBox, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import shadowTexture from "../../../assets/ember.svg";
import type { CardDropEffect } from "../../application/lab";
import { CardMesh } from "./Card";
import type { HeatUniforms } from "./cardHeat";
import {
  cardImpactProfiles,
  cardLandingPose,
  flameCooldownDuration,
  sampleCardImpact,
} from "./cardImpactMotion";
import { FlameEnvelope } from "./FlameEnvelope";
import { FlameImpact } from "./FlameImpact";
import { HeatImpactWave } from "./HeatImpactWave";
import { IceShards } from "./IceShards";
import { useMotionSettings } from "./MotionSettings";

const baseHeight = 0.066;
const restingHeight = 0.099;

export function CardDrop({ attempt, effect }: { attempt: number; effect: CardDropEffect }) {
  const motionSettings = useMotionSettings();
  const shatter = effect === "ice";
  const transfersHeat = effect === "heat";
  const flameImpact = effect === "flame";
  const heavy = transfersHeat || flameImpact;
  const motion = useRef({ seconds: -1 });
  const flameOpacity = useRef({ value: 1 });
  const table = useRef<Group>(null);
  const heatWave = useRef({ value: 0 });
  const blast = useRef({ blast: 0, burn: 0 });
  const base = useRef<Group>(null);
  const falling = useRef<Group>(null);
  const frost = useRef({ value: shatter ? 1 : 0 });
  const fallingHeat = useRef({
    strength: { value: heavy ? 1 : 0 },
    time: { value: 0 },
    scorch: { value: flameImpact ? 0.85 : 0 },
  });
  const baseHeat = useRef<HeatUniforms>({
    strength: { value: 0 },
    time: { value: 0 },
    impact: { value: [0.08, 0.15, 0.56] },
    scorch: { value: 0 },
  });
  const heatLight = useRef<PointLight>(null);
  const shards = useRef({ value: 0 });
  const shadow = useRef<MeshBasicMaterial>(null);
  const texture = useTexture(shadowTexture);
  const scale = useThree(({ size }) => Math.min(1, (size.width / Math.max(1, size.height)) * 1.12));

  const profile = cardImpactProfiles[effect];

  useFrame(({ clock }) => {
    const sample = sampleCardImpact(effect, motion.current.seconds);
    const pose = cardLandingPose(effect, sample);
    fallingHeat.current.time.value = clock.elapsedTime;
    fallingHeat.current.strength.value = sample.topHeat;
    fallingHeat.current.scorch.value = sample.topScorch;
    baseHeat.current.time.value = clock.elapsedTime;
    baseHeat.current.strength.value = sample.bottomHeat;
    if (baseHeat.current.impact) baseHeat.current.impact.value[2] = flameImpact ? 0 : 0.56;
    if (baseHeat.current.scorch) baseHeat.current.scorch.value = sample.bottomScorch;
    frost.current.value = sample.frost;
    shards.current.value = sample.shards;
    heatWave.current.value = sample.heatWave;
    blast.current.blast = sample.blast;
    blast.current.burn = sample.burn;
    flameOpacity.current.value = sample.fireLife;
    if (heatLight.current) heatLight.current.intensity = sample.light;

    const card = falling.current;
    const lower = base.current;
    if (card && lower) {
      const contactZ = MathUtils.lerp(profile.height, 0.209, sample.fall);
      card.position.set(pose.x, pose.y, MathUtils.lerp(contactZ, restingHeight, sample.slap));
      card.rotation.set(pose.pitch, pose.roll, pose.yaw);
      lower.position.set(pose.lowerX, pose.lowerY, baseHeight);
      lower.rotation.z = pose.lowerYaw;
    }
    if (shadow.current)
      shadow.current.opacity = MathUtils.lerp(0.12, 0.38, sample.fallTime) - 0.1 * sample.slap;
    if (table.current) {
      const shake = pose.tableShake;
      table.current.position.set(shake, -0.55 + shake * 0.6, -shake * 0.38);
      table.current.rotation.set(-Math.PI / 2, 0, shake * 0.37);
    }
  });

  useGSAP(
    () => {
      const leadIn = 0.15 + profile.fall;
      motion.current.seconds = -leadIn;
      const end = flameImpact ? 0.4 + flameCooldownDuration : 2.05;
      gsap
        .to(motion.current, { seconds: end, duration: leadIn + end, ease: "none" })
        .timeScale(motionSettings.speed);
    },
    { dependencies: [attempt, effect], revertOnUpdate: true },
  );

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={43}
        position={flameImpact ? [0, 5.35, 7.0] : [0, 4.6, 5.9]}
        rotation={[-(flameImpact ? Math.atan2(5.35, 7.0) : Math.atan2(4.6, 5.9)), 0, 0]}
      />
      <group ref={table} position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
        <RoundedBox args={[5.1, 4.1, 0.18]} position={[0, 0, -0.09]} radius={0.08}>
          <meshStandardMaterial color="#66402c" roughness={0.62} />
        </RoundedBox>
        <RoundedBox args={[4.9, 3.9, 0.075]} position={[0, 0, -0.0025]} radius={0.03}>
          <meshStandardMaterial color="#164a38" roughness={1} />
        </RoundedBox>
        <mesh position={[0.2, 0.02, 0.037]} scale={[1.1, 1.34, 1]}>
          <planeGeometry args={[2.4, 2.4]} />
          <meshBasicMaterial
            ref={shadow}
            map={texture}
            color="#000000"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
        <group ref={base} position={[-0.03, -0.06, baseHeight]} rotation={[0, 0, 0.09]}>
          <group scale={[0.83, 0.83, 0.35]}>
            <CardMesh heat={baseHeat} />
          </group>
        </group>
        <group ref={falling} position={[0.41, 0.19, 1.7]} rotation={[0.2, -0.17, 0.04]}>
          <group scale={[0.83, 0.83, 0.35]}>
            <CardMesh frost={frost} heat={fallingHeat} />
          </group>
          {flameImpact && (
            <group position={[0, 1.14, -0.48]} rotation={[Math.PI / 2, 0, 0]} scale={0.44}>
              <FlameEnvelope crestOnly opacity={flameOpacity} />
            </group>
          )}
        </group>
        <pointLight
          ref={heatLight}
          position={flameImpact ? [0.15, 0.08, 0.72] : [-0.88, -0.93, 0.22]}
          color="#ff803a"
          intensity={0}
          distance={flameImpact ? 5.4 : 0.88}
        />
        {transfersHeat && (
          <group position={[0.13, 0.05, 0.041]} scale={1.2}>
            <HeatImpactWave motion={heatWave} />
          </group>
        )}
        {flameImpact && <FlameImpact motion={blast} />}
        {shatter && <IceShards progress={shards} />}
      </group>
    </>
  );
}
