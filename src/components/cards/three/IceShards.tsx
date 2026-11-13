import { useRef, useState } from "react";
import type { RefObject } from "react";
import { MathUtils, Object3D } from "three";
import type { InstancedMesh } from "three";

import { useFrame } from "@react-three/fiber";

const shards = Array.from({ length: 32 }, (_, index) => {
  const angle = index * 2.399963;
  const radius = Math.sqrt((index + 0.5) / 32);
  return {
    dx: Math.cos(angle),
    dy: Math.sin(angle),
    radius,
    speed: 0.45 + (index % 7) * 0.12,
    height: 0.16 + (index % 9) * 0.06,
    size: 0.52 + (index % 6) * 0.16,
    delay: (index % 4) * 0.026,
  };
});

export function IceShards({ progress }: { progress: RefObject<{ value: number }> }) {
  const mesh = useRef<InstancedMesh>(null);
  const [dummy] = useState(() => new Object3D());

  useFrame(() => {
    const batch = mesh.current;
    if (!batch) return;
    const burst = progress.current.value;
    batch.visible = burst > 0 && burst < 1;
    if (!batch.visible) return;

    shards.forEach((shard, index) => {
      const time = MathUtils.clamp((burst - shard.delay) / 0.87, 0, 1);
      const spread = shard.radius + shard.speed * (1 - (1 - time) ** 2);
      const height = MathUtils.lerp(0.116, 0.049, time) + 4 * shard.height * time * (1 - time);
      const size = burst > shard.delay ? shard.size * (1 - MathUtils.smoothstep(time, 0.68, 1)) : 0;

      dummy.position.set(0.22 + shard.dx * spread * 0.82, 0.1 + shard.dy * spread * 1.11, height);
      dummy.rotation.set(index + time * 6, index * 1.7 + time * 9, index * 2.4 + time * 5);
      dummy.scale.set(size, size * 0.48, size * 0.78);
      dummy.updateMatrix();
      batch.setMatrixAt(index, dummy.matrix);
    });
    batch.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, shards.length]}
      visible={false}
      frustumCulled={false}
    >
      <tetrahedronGeometry args={[0.115, 0]} />
      <meshStandardMaterial
        color="#bcecff"
        emissive="#2e6480"
        emissiveIntensity={0.22}
        roughness={0.32}
      />
    </instancedMesh>
  );
}
