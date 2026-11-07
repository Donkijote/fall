import { Suspense, useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, MathUtils, NoColorSpace, SRGBColorSpace, Vector2 } from "three";
import type { Group, Texture } from "three";

import foregroundMask from "@/assets/login/foreground-mask.svg";
import mountainCastle from "@/assets/login/mountain-castle.png";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { animateMaterials } from "./animateMaterials";
import { createEmberSeeds, getAtmosphereQuality, getCoverScale } from "./atmosphereModel";
import {
  emberFragmentShader,
  emberVertexShader,
  fogFragmentShader,
  landscapeFragmentShader,
  planeVertexShader,
} from "./shaders";

type SceneProps = {
  compact: boolean;
  onReady: () => void;
  onFailure: () => void;
};

function prepareTextures([landscape, matte]: Texture[]) {
  landscape.colorSpace = SRGBColorSpace;
  matte.colorSpace = NoColorSpace;
  landscape.needsUpdate = true;
  matte.needsUpdate = true;
}

function useSceneUniforms() {
  const [landscape, matte] = useTexture([mountainCastle, foregroundMask], prepareTextures);
  return useMemo(
    () => ({
      uLandscape: { value: landscape },
      uMatte: { value: matte },
      uCover: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2() },
      uViewport: { value: new Vector2() },
      uDpr: { value: 1 },
      uTime: { value: 0 },
    }),
    [landscape, matte],
  );
}

type Uniforms = ReturnType<typeof useSceneUniforms>;

function Landscape({ uniforms, foreground = false }: { uniforms: Uniforms; foreground?: boolean }) {
  const viewport = useThree((state) => state.viewport);
  const materialUniforms = useMemo(
    () => ({ ...uniforms, uForeground: { value: foreground ? 1 : 0 } }),
    [uniforms, foreground],
  );
  return (
    <mesh
      position={[0, 0, foreground ? 0 : -4]}
      scale={[viewport.width, viewport.height, 1]}
      renderOrder={foreground ? 4 : 0}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={materialUniforms}
        vertexShader={planeVertexShader}
        fragmentShader={landscapeFragmentShader}
        transparent={foreground}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Fog({ uniforms, layer }: { uniforms: Uniforms; layer: number }) {
  const viewport = useThree((state) => state.viewport);
  const materialUniforms = useMemo(
    () => ({ ...uniforms, uLayer: { value: layer } }),
    [uniforms, layer],
  );
  return (
    <mesh
      position={[0, 0, -3 + layer * 2]}
      scale={[viewport.width, viewport.height, 1]}
      renderOrder={1 + layer * 2}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={materialUniforms}
        vertexShader={planeVertexShader}
        fragmentShader={fogFragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Embers({ uniforms, count, near }: { uniforms: Uniforms; count: number; near: boolean }) {
  const seeds = useMemo(() => createEmberSeeds(count), [count]);
  const materialUniforms = useMemo(
    () => ({ ...uniforms, uNear: { value: near ? 1 : 0 } }),
    [uniforms, near],
  );
  return (
    <points frustumCulled={false} renderOrder={near ? 5 : 2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={materialUniforms}
        vertexShader={emberVertexShader}
        fragmentShader={emberFragmentShader}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </points>
  );
}

function Scene({ compact, onReady, onFailure }: SceneProps) {
  const uniforms = useSceneUniforms();
  const layers = useRef<Group>(null);
  const pointer = useRef(new Vector2());
  const elapsed = useRef(0);
  const gl = useThree((state) => state.gl);
  const quality = getAtmosphereQuality(compact);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    const contextLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const previousShaderError = gl.debug.onShaderError;
    gl.debug.onShaderError = onFailure;
    gl.domElement.setAttribute("aria-hidden", "true");
    gl.domElement.tabIndex = -1;
    gl.domElement.addEventListener("webglcontextlost", contextLost);
    return () => {
      gl.domElement.removeEventListener("webglcontextlost", contextLost);
      gl.debug.onShaderError = previousShaderError;
    };
  }, [gl, onFailure]);

  useEffect(() => {
    if (compact) return;
    const move = (event: PointerEvent) => {
      pointer.current.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        -(event.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const reset = () => pointer.current.set(0, 0);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [compact]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    elapsed.current += step;
    const cover = getCoverScale(state.size.width / state.size.height);
    uniforms.uCover.value.set(...cover);
    uniforms.uViewport.value.set(state.viewport.width, state.viewport.height);
    if (layers.current) animateMaterials(layers.current, elapsed.current, state.gl.getPixelRatio());
    uniforms.uPointer.value.x = MathUtils.damp(
      uniforms.uPointer.value.x,
      pointer.current.x,
      2,
      step,
    );
    uniforms.uPointer.value.y = MathUtils.damp(
      uniforms.uPointer.value.y,
      pointer.current.y,
      2,
      step,
    );
  });

  return (
    <group ref={layers}>
      <Landscape uniforms={uniforms} />
      <Fog uniforms={uniforms} layer={0} />
      <Embers uniforms={uniforms} count={quality.distantEmbers} near={false} />
      <Fog uniforms={uniforms} layer={1} />
      <Landscape uniforms={uniforms} foreground />
      <Embers uniforms={uniforms} count={quality.nearEmbers} near />
    </group>
  );
}

export default function AtmosphereCanvas({
  compact,
  visible,
  onReady,
  onFailure,
}: SceneProps & { visible: boolean }) {
  const quality = getAtmosphereQuality(compact);
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 30 }}
      dpr={quality.dpr}
      frameloop={visible ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.debug.onShaderError = onFailure;
      }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: true,
      }}
      flat
      fallback={null}
    >
      <Suspense fallback={null}>
        <Scene compact={compact} onReady={onReady} onFailure={onFailure} />
      </Suspense>
    </Canvas>
  );
}
