import { ShaderMaterial } from "three";
import type { Group } from "three";

export function animateMaterials(layers: Group, time: number, dpr: number) {
  layers.traverse((object) => {
    if (!("material" in object) || !(object.material instanceof ShaderMaterial)) return;
    object.material.uniforms.uTime.value = time;
    object.material.uniforms.uDpr.value = dpr;
  });
}
