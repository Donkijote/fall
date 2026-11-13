import { useRef } from "react";
import type { RefObject } from "react";
import type { ShaderMaterial } from "three";

import { useFrame } from "@react-three/fiber";

const vertexShader = `
  varying vec2 waveUv;
  void main() {
    waveUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float progress;
  varying vec2 waveUv;
  void main() {
    vec2 p = (waveUv - 0.5) * 2.0;
    float radius = length(p);
    float front = mix(0.17, 0.86, 1.0 - (1.0 - progress) * (1.0 - progress));
    float ripple = sin(p.x * 25.0 + p.y * 17.0 + progress * 12.0) * 0.012;
    float band = 1.0 - smoothstep(0.012, 0.092, abs(radius - front + ripple));
    float wake = smoothstep(front - 0.18, front - 0.05, radius) * (1.0 - smoothstep(front - 0.03, front, radius));
    float fade = smoothstep(0.0, 0.08, progress) * (1.0 - smoothstep(0.23, 1.0, progress));
    vec3 color = mix(vec3(0.82, 0.23, 0.045), vec3(1.0, 0.70, 0.29), band);
    gl_FragColor = vec4(color, (band * 0.37 + wake * 0.09) * fade);
    #include <colorspace_fragment>
  }
`;

export function HeatImpactWave({ motion }: { motion: RefObject<{ value: number }> }) {
  const material = useRef<ShaderMaterial>(null);

  useFrame(() => {
    if (material.current) material.current.uniforms.progress.value = motion.current.value;
  });

  return (
    <mesh renderOrder={2}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ progress: { value: 0 } }}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
