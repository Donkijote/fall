import { useRef } from "react";
import type { RefObject } from "react";
import { DoubleSide } from "three";
import type { ShaderMaterial } from "three";

import { useFrame } from "@react-three/fiber";

const vertexShader = `
  uniform float crossPlane;
  varying vec2 flameUv;
  varying float facing;
  void main() {
    flameUv = uv;
    float towardCamera = normalize(mat3(modelViewMatrix) * vec3(0.0, 0.0, 1.0)).z;
    facing = abs(towardCamera);
    // Keep the main sheet just above the visible paper face through a flip.
    vec3 surface = position;
    surface.z += sign(towardCamera) * 0.053 * (1.0 - crossPlane);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(surface, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float crossPlane;
  uniform float crestOnly;
  uniform float opacity;
  uniform float ignition;
  varying vec2 flameUv;
  varying float facing;

  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    mat2 turn = mat2(0.82, 0.57, -0.57, 0.82);
    float value = 0.52 * noise(p);
    p = turn * p * 2.03 + 7.1;
    value += 0.27 * noise(p);
    p = turn * p * 2.08 - 4.2;
    value += 0.14 * noise(p);
    return value + 0.07 * noise(turn * p * 2.1);
  }

  void main() {
    vec2 p = (flameUv - 0.5) * vec2(4.25, 5.25) + vec2(0.0, 0.52);
    float above = max(0.0, p.y - 1.27);
    vec2 stream = vec2(p.x * 2.8, p.y * 2.0 - time * 2.55);
    vec2 largeCurl = vec2(fbm(stream * 0.74), fbm(stream * 0.71 + 15.9)) - 0.5;
    vec2 flow = stream + largeCurl * vec2(2.8, 2.25);
    vec2 smallCurl = vec2(fbm(flow * 1.07 + 3.3), fbm(flow * 0.97 - 6.7)) - 0.5;
    flow += smallCurl * 1.48;
    float eddies = fbm(flow * vec2(1.27, 1.02));
    float detail = fbm(flow * 2.18 + 9.4);

    // A broad crest splits into tall, uneven tongues as the flow pulls it upwards.
    float wind = sin(time * 1.58);
    float lean = above * (0.42 * wind + 0.17 * sin(time * 2.1 - above * 2.3))
      + largeCurl.x * above * 1.03;
    float crestX = p.x - lean;
    float crestWidth = 1.23 - above * 0.26 + largeCurl.y * 0.25;
    float crest = 0.96 - above * 0.64 - pow(abs(crestX) / max(0.45, crestWidth), 2.6) * 0.72;
    crest += (eddies - 0.50) * (0.78 + above * 0.62);
    crest *= smoothstep(0.93, 1.35, p.y);

    // Grow the fire from a narrow root. Its own density fades at the outer
    // edge, so no separate width mask slices through the lower flames.
    float side = sign(p.x);
    float sideFlow = fbm(vec2(p.y * 2.55 - time * 2.25, side * 7.1));
    float sideWave = (sideFlow - 0.47) * 0.40 + 0.085 * sin(p.y * 5.1 - time * 4.3 + side);
    float climb = smoothstep(-1.37, 1.35, p.y);
    float joinCrest = smoothstep(0.64, 1.35, p.y);
    float sideCenter = side * (mix(0.84, 1.10, climb) + sideWave * climb)
      + wind * 0.12 * climb;
    float sideReach = mix(0.12, 0.37 + sideFlow * 0.14, climb);
    float rootedSide = (0.62 + (eddies - 0.48) * mix(0.30, 0.77, climb))
      * (1.0 - smoothstep(sideReach * 0.16, sideReach, abs(p.x - sideCenter)))
      * smoothstep(-1.44, -1.11, p.y);

    float upperFlare = smoothstep(-0.93, 1.27, p.y);
    float upperCenter = side * (1.025 + sideWave + upperFlare * 0.10) + wind * 0.12;
    float upperReach = 0.19 + sideFlow * 0.32 + upperFlare * 0.13 + 0.06 * sin(p.y * 4.2 - time * 3.1);
    float upperSide = 0.59 - abs(p.x - upperCenter) / upperReach * 0.62 + (eddies - 0.48) * 0.83;
    float sides = mix(rootedSide, upperSide, joinCrest) * (1.0 - smoothstep(1.36, 2.01, p.y));

    // Corner curls and smaller tongues rise directly from the bottom edge.
    float curlHeight = clamp((p.y + 1.49) / 0.52, 0.0, 1.0);
    float cornerX = side * (0.72 + curlHeight * 0.18 + 0.065 * sin(curlHeight * 5.9 - time * 3.7 + side))
      + wind * (0.045 + curlHeight * 0.10);
    float cornerWidth = 0.20 - curlHeight * 0.07;
    float base = (0.69 - abs(p.x - cornerX) / cornerWidth * 0.69 + (eddies - 0.5) * 0.61)
      * smoothstep(-1.44, -1.33, p.y) * (1.0 - smoothstep(-1.13, -0.87, p.y));

    float bottomLift = p.y + 1.44;
    float bottomFlow = fbm(vec2(p.x * 6.5 - wind * 0.35, -time * 2.35));
    float bottomTip = 0.085 + bottomFlow * 0.22;
    float bottomCenter = (0.28 + bottomFlow * 0.40 + (eddies - 0.5) * 0.23)
      * smoothstep(-0.045, 0.075, bottomLift)
      * (1.0 - smoothstep(bottomTip * 0.15, bottomTip, bottomLift))
      * (1.0 - smoothstep(0.52, 0.84, abs(p.x)));

    float field = max(crest, max(max(sides, base), bottomCenter) * mix(1.0, 0.32, crossPlane) * (1.0 - crestOnly));
    float sideSilhouette = smoothstep(0.10, 0.49, field);
    float crestSilhouette = smoothstep(0.17, 0.43, field);
    float silhouette = mix(sideSilhouette, crestSilhouette, smoothstep(0.94, 1.55, p.y));
    float filaments = pow(1.0 - abs(sin(flow.x * 2.85 + eddies * 5.7 + detail * 1.7)), 4.7);
    float folds = smoothstep(0.34, 0.71, eddies) * 0.22 + filaments * 0.32;
    float heat = clamp(field * 0.61 + folds - above * 0.065, 0.0, 1.0);

    vec3 color = mix(vec3(0.33, 0.017, 0.003), vec3(0.97, 0.10, 0.006), smoothstep(0.16, 0.52, heat));
    color = mix(color, vec3(1.0, 0.46, 0.037), smoothstep(0.38, 0.71, heat));
    color = mix(color, vec3(1.0, 0.88, 0.44), smoothstep(0.62, 0.96, heat));

    float veil = smoothstep(0.035, 0.36, field) * 0.23;
    float fade = smoothstep(0.0, 0.24, time) * (1.0 - smoothstep(2.57, 3.07, p.y));
    float angleFade = mix(1.0, smoothstep(0.47, 0.91, facing) * 0.76, crossPlane);
    // The inward flame reach varies with the flow, leaving the artwork clear.
    vec2 edge = abs(p) - vec2(0.854, 1.264);
    float cardDistance = length(max(edge, 0.0)) + min(max(edge.x, edge.y), 0.0) - 0.176;
    float inwardReach = mix(0.044, 0.23, smoothstep(0.25, 0.75, eddies)) + detail * 0.027;
    float paperMask = smoothstep(-inwardReach, -0.014, cardDistance);
    float bottomPaper = smoothstep(0.05, 0.30, bottomCenter);
    paperMask = max(paperMask, bottomPaper);
    float surfaceMask = mix(paperMask, 1.0, max(crossPlane, crestOnly));
    float bottomSoftness = mix(0.73, 1.0, smoothstep(-1.42, -1.13, p.y));
    float front = mix(-1.61, 3.17, ignition);
    float ignited = 1.0 - smoothstep(front - 0.16, front + 0.13, p.y + (eddies - 0.5) * 0.20);
    float alpha = max(veil, silhouette * (0.38 + folds * 0.91)) * fade * angleFade * surfaceMask * bottomSoftness
      * opacity * ignited;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export function FlameEnvelope({
  cross = false,
  crestOnly = false,
  opacity,
  ignition,
}: {
  cross?: boolean;
  crestOnly?: boolean;
  opacity?: RefObject<{ value: number }>;
  ignition?: RefObject<{ value: number }>;
}) {
  const material = useRef<ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    uniforms.time.value += Math.min(delta, 0.05);
    uniforms.opacity.value = opacity?.current.value ?? 1;
    uniforms.ignition.value = ignition?.current.value ?? 1;
  });

  return (
    <mesh
      position={[0, 0.52, 0]}
      rotation={[0, cross ? Math.PI / 2 : 0, 0]}
      scale={[cross ? 0.42 : 1, 1, 1]}
      raycast={() => {}}
      renderOrder={2}
    >
      <planeGeometry args={[4.25, 5.25]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          crossPlane: { value: cross ? 1 : 0 },
          crestOnly: { value: crestOnly ? 1 : 0 },
          opacity: { value: 1 },
          ignition: { value: 1 },
        }}
        transparent
        depthWrite={false}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
