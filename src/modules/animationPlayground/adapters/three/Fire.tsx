import { useEffect, useRef } from "react";
import { AdditiveBlending, MeshBasicMaterial } from "three";
import {
  BatchedRenderer,
  ColorOverLife,
  ConeEmitter,
  ConstantValue,
  Gradient,
  IntervalValue,
  ParticleSystem,
  RenderMode,
  Vector3,
} from "three.quarks";

import emberTexture from "@/assets/effects/ember.svg";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export function Fire({ rate }: { rate: number }) {
  const scene = useThree((state) => state.scene);
  const texture = useTexture(emberTexture);
  const batch = useRef<BatchedRenderer | null>(null);
  const system = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    const renderer = new BatchedRenderer();
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    });
    // Quarks owns the emission, particle lifetime and batched billboard rendering.
    const flame = new ParticleSystem({
      material,
      renderMode: RenderMode.BillBoard,
      shape: new ConeEmitter({ radius: 0.68, angle: 0.27 }),
      startLife: new IntervalValue(0.32, 0.83),
      startSpeed: new IntervalValue(1.25, 3),
      startSize: new IntervalValue(0.075, 0.37),
      emissionOverTime: new ConstantValue(100),
      behaviors: [
        new ColorOverLife(
          new Gradient(
            [
              [new Vector3(1.5, 0.5, 0.07), 0],
              [new Vector3(0.95, 0.13, 0.015), 0.45],
              [new Vector3(0.35, 0.025, 0.008), 1],
            ],
            [
              [0.22, 0],
              [0.76, 0.16],
              [0.38, 0.55],
              [0, 1],
            ],
          ),
        ),
      ],
      worldSpace: true,
    });
    flame.emitter.position.set(0, -1.27, 0.46);
    flame.emitter.rotation.x = -Math.PI / 2;
    scene.add(renderer, flame.emitter);
    renderer.addSystem(flame);
    batch.current = renderer;
    system.current = flame;

    return () => {
      batch.current = null;
      system.current = null;
      flame.dispose();
      scene.remove(renderer);
      for (const entry of renderer.batches) {
        entry.dispose();
        for (const batchMaterial of [entry.material].flat()) batchMaterial.dispose();
      }
      material.dispose();
    };
  }, [scene, texture]);

  useEffect(() => {
    if (system.current) system.current.emissionOverTime = new ConstantValue(rate);
  }, [rate, scene, texture]);

  useFrame((_, delta) => batch.current?.update(Math.min(delta, 0.05)));

  return null;
}
