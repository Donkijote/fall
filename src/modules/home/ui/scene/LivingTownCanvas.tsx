import { useEffect, useMemo, useRef } from "react";
import { Color, Shape, Vector2 } from "three";
import type { ShaderMaterial } from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { getMountainScale, mountainFrame, mountainLayers } from "./mountainModel";
import type { MountainPoint } from "./mountainModel";
import { Tavern } from "./Tavern";
import { getTavernPlacement } from "./tavernModel";

type SceneProps = {
  compact: boolean;
  visible: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const mountainVertex = `
  varying float vHeight;
  void main() {
    vHeight = (450.0 - position.y) / 900.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const mountainFragment = `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  varying float vHeight;
  void main() {
    gl_FragColor = vec4(mix(uTop, uBottom, clamp(vHeight, 0.0, 1.0)), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

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
    float lowerVeil = exp(-pow((vUv.y - 0.25 - folds) / 0.05, 2.0));
    float fade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(0.0, 0.2, 1.0 - vUv.x);
    gl_FragColor = vec4(0.70, 0.44, 0.42, (veil * 0.12 + lowerVeil * 0.07) * fade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function MountainPolygon({
  points,
  top,
  bottom,
  opacity = 1,
}: {
  points: MountainPoint[];
  top: string;
  bottom: string;
  opacity?: number;
}) {
  const shape = useMemo(
    () =>
      new Shape(
        points.map(
          ([horizontal, vertical]) =>
            new Vector2(horizontal - mountainFrame.width / 2, mountainFrame.height / 2 - vertical),
        ),
      ),
    [points],
  );
  const uniforms = useMemo(
    () => ({ uTop: { value: new Color(top) }, uBottom: { value: new Color(bottom) } }),
    [top, bottom],
  );

  return (
    <mesh>
      <shapeGeometry args={[shape]} />
      {opacity === 1 ? (
        <shaderMaterial
          vertexShader={mountainVertex}
          fragmentShader={mountainFragment}
          uniforms={uniforms}
          transparent
          depthTest
          depthWrite={false}
        />
      ) : (
        <meshBasicMaterial color={top} transparent opacity={opacity} depthTest depthWrite={false} />
      )}
    </mesh>
  );
}

function LivingTownWorld({ onReady, onFailure }: Pick<SceneProps, "onReady" | "onFailure">) {
  const { gl, viewport } = useThree();
  const mist = useRef<ShaderMaterial>(null);
  const ready = useRef(false);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const scale = getMountainScale(viewport.width, viewport.height);
  const tavern = getTavernPlacement(viewport.width, viewport.height);

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
    <>
      <ambientLight color="#c7b9ce" intensity={1.1} />
      <directionalLight color="#ffd5a0" position={[-4, 7, 8]} intensity={2.1} />
      <group scale={scale}>
        {mountainLayers.map((layer, index) => (
          <group key={layer.id} position-z={index}>
            <MountainPolygon points={layer.ridge} top={layer.top} bottom={layer.bottom} />
            {layer.facets.map((facet, facetIndex) => (
              <group key={facetIndex} position-z={0.01 + facetIndex * 0.001}>
                <MountainPolygon
                  points={facet.points}
                  top={facet.color}
                  bottom={facet.color}
                  opacity={facet.opacity}
                />
              </group>
            ))}
          </group>
        ))}
      </group>
      <group scale={scale}>
        <group
          position={[tavern.horizontal - 800, 450 - tavern.vertical, 380]}
          scale={tavern.scale}
        >
          <Tavern />
        </group>
      </group>
      <mesh position-z={0.5}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          ref={mist}
          uniforms={uniforms}
          vertexShader={mistVertex}
          fragmentShader={mistFragment}
          transparent
          depthTest
          depthWrite={false}
        />
      </mesh>
    </>
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
        antialias: !compact,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: true,
      }}
      onCreated={({ gl }) => {
        gl.debug.onShaderError = onFailure;
      }}
      flat
      fallback={null}
    >
      <LivingTownWorld onReady={onReady} onFailure={onFailure} />
    </Canvas>
  );
}
