import { useEffect, useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

type SceneProps = {
  compact: boolean;
  visible: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const mistVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const mistFragment = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float drift = uTime * 0.018;
    float folds = sin(vUv.x * 13.0 + drift) * 0.018
      + sin(vUv.x * 27.0 - drift * 0.7) * 0.008;
    float veil = exp(-pow((vUv.y - 0.42 + folds) / 0.065, 2.0));
    float fade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(0.0, 0.2, 1.0 - vUv.x);
    gl_FragColor = vec4(0.56, 0.38, 0.36, veil * 0.07 * fade);
    #include <colorspace_fragment>
  }
`;

function TownMist({ onReady, onFailure }: Pick<SceneProps, "onReady" | "onFailure">) {
  const { gl, viewport } = useThree();
  const mist = useRef<ShaderMaterial>(null);
  const ready = useRef(false);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", handleContextLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLoss);
  }, [gl, onFailure]);

  useFrame((_, delta) => {
    if (mist.current) mist.current.uniforms.uTime.value += Math.min(delta, 0.05);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={mist}
        uniforms={uniforms}
        vertexShader={mistVertex}
        fragmentShader={mistFragment}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function LivingTownCanvas({ compact, visible, onReady, onFailure }: SceneProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 30 }}
      dpr={compact ? 1 : [1, 1.5]}
      frameloop={visible ? "always" : "never"}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: true,
      }}
      onCreated={({ gl }) => {
        gl.debug.onShaderError = onFailure;
      }}
      flat
      fallback={null}
    >
      <TownMist onReady={onReady} onFailure={onFailure} />
    </Canvas>
  );
}
