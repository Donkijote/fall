import type { RefObject } from "react";
import type { Mesh, MeshBasicMaterial } from "three";

import shadowTexture from "@/assets/effects/ember.svg";

import { useTexture } from "@react-three/drei";

import type { FallPose } from "../motion/tableCapture";

export type FallShadowMesh = Mesh<never, MeshBasicMaterial>;

export function updateFallShadow(
  mesh: FallShadowMesh | null,
  pose: FallPose,
  z: number,
  scale = 1,
) {
  if (!mesh) return;
  mesh.visible = Boolean(pose.shadow);
  if (!pose.shadow) return;
  mesh.position.set(pose.position[0], pose.position[1] - pose.shadow.lift * 0.35, z);
  mesh.scale.setScalar((1 + pose.shadow.lift * 0.44) * scale);
  mesh.material.opacity = pose.shadow.opacity;
}

export function FallShadow({ mesh }: { mesh: RefObject<FallShadowMesh | null> }) {
  const texture = useTexture(shadowTexture);
  return (
    <mesh ref={mesh} visible={false} renderOrder={1}>
      <planeGeometry args={[1.1, 1.34]} />
      <meshBasicMaterial map={texture} color="#000" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
