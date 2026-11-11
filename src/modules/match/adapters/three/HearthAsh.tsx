import { useEffect, useRef } from "react";
import { DoubleSide, MeshBasicMaterial, TetrahedronGeometry } from "three";
import {
  AxisAngleGenerator,
  BatchedRenderer,
  ColorOverLife,
  ConstantValue,
  Gradient,
  IntervalValue,
  ParticleSystem,
  RandomQuatGenerator,
  RectangleEmitter,
  RenderMode,
  Rotation3DOverLife,
  Vector3,
} from "three.quarks";
import type { EmissionState, Particle } from "three.quarks";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

class HearthEmitter extends RectangleEmitter {
  initialize(particle: Particle, state: EmissionState) {
    super.initialize(particle, state);
    const rise = particle.startSpeed;
    particle.velocity.set(-rise * (0.25 + Math.random() * 0.65), rise, 0);
  }
}

function AshFlakes() {
  const scene = useThree((state) => state.scene);
  const batch = useRef<BatchedRenderer>(null);

  useEffect(() => {
    const renderer = new BatchedRenderer();
    const geometry = new TetrahedronGeometry(1).scale(1.35, 0.75, 0.24);
    const material = new MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      toneMapped: false,
    });
    const ash = new ParticleSystem({
      material,
      renderMode: RenderMode.Mesh,
      instancingGeometry: geometry,
      shape: new HearthEmitter({ width: 28, height: 14, thickness: 2 }),
      startLife: new IntervalValue(1.2, 2.2),
      startSpeed: new IntervalValue(12, 26),
      startSize: new IntervalValue(0.65, 1.7),
      startRotation: new RandomQuatGenerator(),
      emissionOverTime: new ConstantValue(4),
      behaviors: [
        new Rotation3DOverLife(
          new AxisAngleGenerator(new Vector3(0.6, 0.3, 0.74), new IntervalValue(-1.4, 1.4)),
        ),
        new ColorOverLife(
          new Gradient(
            [
              [new Vector3(1, 0.67, 0.3), 0],
              [new Vector3(0.8, 0.67, 0.55), 0.28],
              [new Vector3(0.51, 0.46, 0.42), 1],
            ],
            [
              [0.15, 0],
              [0.9, 0.2],
              [0.62, 0.62],
              [0, 1],
            ],
          ),
        ),
      ],
    });

    ash.emitter.position.set(40, -24, 0);
    scene.add(renderer, ash.emitter);
    renderer.addSystem(ash);
    batch.current = renderer;

    return () => {
      batch.current = null;
      ash.dispose();
      scene.remove(renderer, ash.emitter);
      for (const entry of renderer.batches) {
        entry.dispose();
        for (const batchMaterial of [entry.material].flat()) batchMaterial.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  useFrame((_, delta) => batch.current?.update(Math.min(delta, 0.05)));
  return null;
}

export function HearthAsh() {
  if (typeof WebGL2RenderingContext === "undefined") return null;

  return (
    <div className="absolute right-[-12px] bottom-[-14px] h-[84px] w-28">
      <Canvas orthographic camera={{ position: [0, 0, 100] }} dpr={[1, 2]} fallback={null}>
        <AshFlakes />
      </Canvas>
    </div>
  );
}
