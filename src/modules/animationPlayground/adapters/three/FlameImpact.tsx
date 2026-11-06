import { useRef } from "react";
import type { RefObject } from "react";
import { AdditiveBlending } from "three";
import type { ShaderMaterial } from "three";

import { useFrame } from "@react-three/fiber";

type ImpactMotion = { blast: number; burn: number };

const feltVertex = `
  varying vec2 impactUv;
  void main() {
    impactUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fireNoise = `
  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), f.x), f.y);
  }

  float roughness(vec2 p) {
    return noise(p) * 0.56 + noise(p * 2.1 + 7.2) * 0.29 + noise(p * 4.4 - 3.1) * 0.15;
  }
`;

const feltFragment = `
  uniform float blast;
  uniform float burn;
  uniform float time;
  uniform float overhead;
  varying vec2 impactUv;
  ${fireNoise}
  void main() {
    vec2 p = (impactUv - 0.5) * vec2(4.84, 3.84) - vec2(0.15, 0.08);
    float grain = roughness(p * 13.0);
    float breakup = roughness(p * 5.0 + time * 0.9);
    float radius = length(p * vec2(mix(0.86, 1.0, overhead), 1.0)) + (grain - 0.5) * 0.18;
    float wave = 1.0 - smoothstep(0.018, 0.29, abs(radius - blast * mix(3.15, 2.06, overhead)));
    wave *= smoothstep(0.0, 0.045, blast) * (1.0 - smoothstep(0.60, 1.0, blast));
    wave *= mix(0.23, 1.0, smoothstep(0.18, 0.75, breakup));
    wave *= 1.0 - overhead;
    float charEdge = 1.0 - smoothstep(mix(2.00, 1.19, overhead), mix(2.78, 1.76, overhead), radius);
    float spread = min(blast * 1.28, 1.0);
    float scorchShape = charEdge * smoothstep(radius * 0.26, radius * 0.26 + 0.25, spread);
    float scorched = scorchShape * burn;
    float coals = smoothstep(0.68, 0.94, grain + breakup * 0.15) * scorched;
    vec3 color = mix(vec3(0.026, 0.010, 0.005), vec3(0.94, 0.15, 0.018), max(wave, coals * 0.51));
    color = mix(color, vec3(1.0, 0.74, 0.25), wave * wave * 0.74);
    float alpha = clamp(wave * 0.91 + scorched * (0.70 + grain * 0.20), 0.0, 0.94);
    // Small scattered patches stay close to the blast center in the overhead view.
    vec2 swirl = p + vec2(grain - 0.5, breakup - 0.5) * 0.24;
    float pockets = roughness(swirl * 5.9 + vec2(time * 1.4, -time * 0.8));
    float surfaceFlame = smoothstep(0.56, 0.85, pockets) * scorched * overhead * 0.48;
    color = mix(color, vec3(1.0, 0.38, 0.06), surfaceFlame);
    alpha = max(alpha, surfaceFlame);
    vec2 margin = min(impactUv, 1.0 - impactUv);
    float softEdge = mix(smoothstep(0.0, 0.17, min(margin.x, margin.y)), 1.0, overhead);
    gl_FragColor = vec4(color, alpha * softEdge);
    #include <colorspace_fragment>
  }
`;

const pocketFragment = `
  uniform float burn;
  uniform float time;
  uniform float seed;
  varying vec2 impactUv;
  ${fireNoise}
  void main() {
    float y = impactUv.y;
    float x = (impactUv.x - 0.5) * 2.0;
    vec2 flow = vec2(x * 2.4 + seed, y * 4.1 - time * 3.7);
    float curl = roughness(flow * 0.73);
    float grain = roughness(flow + vec2(curl * 1.9, 0.0));
    float center = (curl - 0.5) * y * 0.82;
    float width = mix(0.79, 0.18, y);
    float fire = 0.78 - abs(x - center) / width * 0.76 - y * 0.55 + (grain - 0.46) * 0.70;
    float alpha = smoothstep(0.05, 0.59, fire) * smoothstep(0.0, 0.12, y)
      * (1.0 - smoothstep(0.67, 0.98, y)) * smoothstep(0.15 + seed * 0.04, 0.69, burn);
    float hot = smoothstep(0.28, 0.86, fire) * (1.0 - y * 0.36);
    vec3 color = mix(vec3(0.60, 0.06, 0.008), vec3(1.0, 0.43, 0.03), hot);
    color = mix(color, vec3(1.0, 0.88, 0.44), hot * hot);
    gl_FragColor = vec4(color, alpha * 0.82);
    #include <colorspace_fragment>
  }
`;

const pockets = [
  { x: -1.48, y: 0.86, width: 1.02, height: 0.68 },
  { x: 1.4, y: 0.61, width: 1.15, height: 0.74 },
  { x: -1.64, y: -0.75, width: 0.8, height: 0.55 },
  { x: 0.55, y: -1.17, width: 1.08, height: 0.53 },
  { x: 0.08, y: 1.32, width: 0.85, height: 0.64 },
];

const sparkCount = 112;
const sparks = new Float32Array(sparkCount * 3);
for (let index = 0; index < sparkCount; index++) {
  sparks.set(
    [index * 2.399963, ((index * 31) % 103) / 103, ((index * 47 + 5) % 109) / 109],
    index * 3,
  );
}

const sparkVertex = `
  uniform float blast;
  uniform float burn;
  uniform float time;
  uniform float dpr;
  varying float alpha;
  varying float heat;
  void main() {
    float angle = position.x;
    float random = position.y;
    float phase = position.z;
    vec2 direction = vec2(cos(angle), sin(angle));
    bool debris = random > 0.36;
    float age = debris ? clamp((blast - phase * 0.09) / 0.91, 0.0, 1.0)
      : fract(time * (0.48 + phase * 0.46) + phase);
    float distance = debris ? age * mix(1.1, 3.15, phase) : (0.3 + phase * 1.8 + age * 0.22);
    float height = debris ? 0.10 + 4.0 * age * (1.0 - age) * mix(0.19, 1.28, random)
      : 0.06 + age * mix(0.34, 0.78, phase);
    vec3 p = vec3(direction * distance + vec2(0.15, 0.08), height);
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * view;
    float size = debris ? mix(3.0, 13.0, phase) : mix(4.0, 12.0, phase);
    gl_PointSize = size * dpr * (1.0 - age * 0.43) * 6.3 / max(1.0, -view.z);
    float fade = smoothstep(0.0, 0.065, age) * (1.0 - smoothstep(0.48, 1.0, age));
    alpha = fade * (debris ? 0.96 : burn * 0.44);
    heat = (1.0 - age) * mix(0.64, 1.0, phase);
  }
`;

const sparkFragment = `
  varying float alpha;
  varying float heat;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float core = 1.0 - smoothstep(0.04, 0.48, length(uv * vec2(1.3, 0.91)));
    vec3 color = mix(vec3(1.0, 0.16, 0.014), vec3(1.0, 0.80, 0.30), heat * core);
    gl_FragColor = vec4(color, core * core * alpha);
    #include <colorspace_fragment>
  }
`;

export function FlameImpact({
  motion,
  overhead = false,
}: {
  motion: RefObject<ImpactMotion>;
  overhead?: boolean;
}) {
  const felt = useRef<ShaderMaterial>(null);
  const embers = useRef<ShaderMaterial>(null);
  const fires = useRef<(ShaderMaterial | null)[]>([]);

  useFrame(({ clock, gl }) => {
    for (const material of [felt.current, embers.current]) {
      if (!material) continue;
      material.uniforms.blast.value = motion.current.blast;
      material.uniforms.burn.value = motion.current.burn;
      material.uniforms.time.value = clock.elapsedTime;
    }
    for (const material of fires.current) {
      if (!material) continue;
      material.uniforms.burn.value = motion.current.burn;
      material.uniforms.time.value = clock.elapsedTime;
    }
    if (embers.current) embers.current.uniforms.dpr.value = gl.getPixelRatio();
  });

  return (
    <>
      <mesh position={[0, 0, 0.04]} renderOrder={1}>
        <planeGeometry args={[4.84, 3.84]} />
        <shaderMaterial
          ref={felt}
          vertexShader={feltVertex}
          fragmentShader={feltFragment}
          uniforms={{
            blast: { value: 0 },
            burn: { value: 0 },
            time: { value: 0 },
            overhead: { value: overhead ? 1 : 0 },
          }}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {!overhead &&
        pockets.map(({ x, y, width, height }, index) => (
          <mesh
            key={index}
            position={[x, y, height / 2 + 0.04]}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={3}
          >
            <planeGeometry args={[width, height]} />
            <shaderMaterial
              ref={(material) => {
                fires.current[index] = material;
              }}
              vertexShader={feltVertex}
              fragmentShader={pocketFragment}
              uniforms={{ burn: { value: 0 }, time: { value: 0 }, seed: { value: index * 1.57 } }}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      <points frustumCulled={false} renderOrder={4}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparks, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={embers}
          vertexShader={sparkVertex}
          fragmentShader={sparkFragment}
          uniforms={{
            blast: { value: 0 },
            burn: { value: 0 },
            time: { value: 0 },
            dpr: { value: 1 },
          }}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </>
  );
}
