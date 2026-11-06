import { useEffect, useRef } from "react";
import { AdditiveBlending, MeshBasicMaterial } from "three";
import type { Group, PointLight } from "three";
import {
  BatchedRenderer,
  Bezier,
  ColorOverLife,
  ConstantValue,
  Gradient,
  IntervalValue,
  ParticleSystem,
  PiecewiseBezier,
  RectangleEmitter,
  RenderMode,
  SizeOverLife,
  Vector3,
} from "three.quarks";
import type { EmissionState, Particle } from "three.quarks";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import emberTexture from "../../assets/ember.svg";
import { FlameEnvelope } from "./FlameEnvelope";
import { createSmokeSprites, smokeSpriteCount } from "./flameSprites";

class RisingEmitter extends RectangleEmitter {
  initialize(particle: Particle, state: EmissionState) {
    super.initialize(particle, state);
    particle.position.z = Math.random() * 0.2 - 0.1;
    particle.velocity.set(
      (Math.random() - 0.5) * particle.startSpeed * 0.53,
      particle.startSpeed,
      (Math.random() - 0.5) * 0.17,
    );
  }
}

export function FlameCardEffects() {
  const emberMap = useTexture(emberTexture);
  const scene = useThree((state) => state.scene);
  const anchor = useRef<Group>(null);
  const renderer = useRef<BatchedRenderer | null>(null);
  const light = useRef<PointLight>(null);

  useEffect(() => {
    const parent = anchor.current;
    if (!parent) return;
    const batch = new BatchedRenderer();
    const smokeMap = createSmokeSprites();
    const smokeMaterial = new MeshBasicMaterial({
      map: smokeMap,
      transparent: true,
      depthWrite: false,
    });
    const emberMaterial = new MeshBasicMaterial({
      map: emberMap,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const sparks = new ParticleSystem({
      material: emberMaterial,
      renderMode: RenderMode.BillBoard,
      renderOrder: 3,
      shape: new RisingEmitter({ width: 2.0, height: 2.8, thickness: 0.04 }),
      startLife: new IntervalValue(0.48, 1.26),
      startSpeed: new IntervalValue(0.64, 1.68),
      startSize: new IntervalValue(0.023, 0.092),
      emissionOverTime: new ConstantValue(38),
      behaviors: [
        new ColorOverLife(
          new Gradient(
            [
              [new Vector3(1.4, 0.55, 0.07), 0],
              [new Vector3(0.93, 0.19, 0.012), 0.52],
              [new Vector3(0.24, 0.025, 0.002), 1],
            ],
            [
              [0, 0],
              [0.81, 0.14],
              [0.44, 0.52],
              [0, 1],
            ],
          ),
        ),
      ],
      worldSpace: false,
    });

    const smoke = new ParticleSystem({
      material: smokeMaterial,
      renderMode: RenderMode.BillBoard,
      renderOrder: 1,
      uTileCount: smokeSpriteCount,
      startTileIndex: new IntervalValue(0, smokeSpriteCount),
      shape: new RisingEmitter({ width: 1.76, height: 0.08, thickness: 0.1 }),
      startLife: new IntervalValue(1.3, 2.1),
      startSpeed: new IntervalValue(0.31, 0.66),
      startSize: new IntervalValue(0.73, 1.12),
      startRotation: new IntervalValue(0, Math.PI * 2),
      emissionOverTime: new ConstantValue(33),
      behaviors: [
        new ColorOverLife(
          new Gradient(
            [
              [new Vector3(1, 0.97, 0.91), 0],
              [new Vector3(0.72, 0.8, 0.98), 1],
            ],
            [
              [0, 0],
              [0.58, 0.16],
              [0.46, 0.44],
              [0, 1],
            ],
          ),
        ),
        new SizeOverLife(new PiecewiseBezier([[new Bezier(0.76, 1.03, 1.6, 2.05), 0]])),
      ],
      worldSpace: false,
    });
    smoke.emitter.position.set(-0.49, 1.53, -0.24);

    const systems = [smoke, sparks];
    scene.add(batch);
    for (const system of systems) {
      parent.add(system.emitter);
      batch.addSystem(system);
    }
    renderer.current = batch;

    return () => {
      renderer.current = null;
      for (const system of systems) system.dispose();
      scene.remove(batch);
      for (const entry of batch.batches) {
        entry.dispose();
        for (const material of [entry.material].flat()) material.dispose();
      }
      smokeMap.dispose();
      emberMaterial.dispose();
      smokeMaterial.dispose();
    };
  }, [scene, emberMap]);

  useFrame(({ clock }, delta) => {
    renderer.current?.update(Math.min(delta, 0.05));
    if (light.current) light.current.intensity = 3.6 + Math.sin(clock.elapsedTime * 11) * 0.68;
  });

  return (
    <group ref={anchor}>
      <FlameEnvelope />
      <FlameEnvelope cross />
      <pointLight
        ref={light}
        position={[0, -0.4, 0.45]}
        color="#ff6530"
        intensity={0}
        distance={2.4}
      />
    </group>
  );
}
