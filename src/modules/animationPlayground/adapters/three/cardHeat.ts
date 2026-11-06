import type { RefObject } from "react";
import type { MeshBasicMaterial } from "three";

export type HeatUniforms = {
  strength: { value: number };
  time: { value: number };
  ignition?: { value: number };
  scorch?: { value: number };
  impact?: { value: [number, number, number] };
};

// The dark striped back makes periodic heat waves especially visible. Use
// irregular, layered noise there while retaining the original front treatment.
const backFlameNoise = `
      float backHeatHash(vec2 p) {
        vec3 q = fract(vec3(p.xyx) * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
      }

      float backHeatNoise(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(backHeatHash(cell), backHeatHash(cell + vec2(1.0, 0.0)), f.x),
          mix(backHeatHash(cell + vec2(0.0, 1.0)), backHeatHash(cell + 1.0), f.x),
          f.y
        );
      }

      float backHeatField(vec2 p) {
        mat2 turn = mat2(0.8, 0.6, -0.6, 0.8);
        vec2 curl = vec2(backHeatNoise(p * 0.43), backHeatNoise(p * 0.43 + 19.7));
        p += (curl - 0.5) * 1.6;
        float value = backHeatNoise(p) * 0.57;
        p = turn * p * 2.13 + 7.9;
        value += backHeatNoise(p) * 0.29;
        return (value + backHeatNoise(turn * p * 2.07 - 3.4) * 0.14) * 2.0 - 1.0;
      }
`;

export function addCardHeat(
  heat: RefObject<HeatUniforms>,
  surface: "front" | "back" = "front",
): MeshBasicMaterial["onBeforeCompile"] {
  return (shader) => {
    shader.uniforms.cardHeat = heat.current.strength;
    shader.uniforms.cardHeatTime = heat.current.time;
    shader.uniforms.cardIgnition = heat.current.ignition ?? { value: 1 };
    shader.uniforms.cardScorch = heat.current.scorch ?? { value: 0 };
    shader.uniforms.cardHeatImpact = heat.current.impact ?? { value: [0, 0, 0] };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `
      #include <common>
      uniform float cardHeat;
      uniform float cardHeatTime;
      uniform vec3 cardHeatImpact;
      uniform float cardScorch;
      uniform float cardIgnition;

      ${surface === "back" ? backFlameNoise : ""}
      float heatNoise(vec2 p) {
        float waves = sin(p.x * 2.6 + sin(p.y * 3.4)) * sin(p.y * 2.1 - p.x * 1.8);
        ${surface === "back" ? "return mix(waves, backHeatField(p), smoothstep(0.0, 0.35, cardScorch));" : "return waves;"}
      }
    `,
      )
      .replace(
        "#include <map_fragment>",
        `
      #include <map_fragment>
      float heatedPaper = 1.0 - smoothstep(-0.10, 0.10, vMapUv.y - mix(-0.11, 1.11, cardIgnition));
      if (cardHeat > 0.001) {
        vec2 uv = vMapUv;
        // Impact x/y are card UV coordinates. A zero radius heats the whole card.
        float localHeat = cardHeat * heatedPaper;
        if (cardHeatImpact.z > 0.0) {
          float spread = smoothstep(0.05, 0.9, cardHeat);
          vec2 origin = mix(cardHeatImpact.xy, vec2(0.5), spread * 0.32);
          vec2 fromImpact = (uv - origin) * vec2(1.0, 1.4);
          float radius = cardHeatImpact.z * mix(0.32, 1.0, spread);
          localHeat *= 1.0 - smoothstep(radius * 0.3, radius, length(fromImpact));
        }
        vec2 edgeDistance = min(uv, 1.0 - uv);
        float edge = min(edgeDistance.x, edgeDistance.y * 1.4);
        float ripple = heatNoise(uv * 9.0 + vec2(0.0, cardHeatTime * 0.7));
        float pulse = 0.91 + 0.09 * sin(cardHeatTime * 6.2 + uv.y * 12.0);
        float rim = (1.0 - smoothstep(0.007, 0.065, edge + 0.009 * ripple)) * localHeat * pulse;
        float band = (1.0 - smoothstep(0.028, 0.22, edge + 0.025 * ripple)) * localHeat;
        float center = 1.0 - smoothstep(0.1, 0.64, length((uv - 0.5) * vec2(1.0, 1.35)));
        ${surface === "back" ? "center *= mix(1.0, 0.25, smoothstep(0.0, 0.35, cardScorch));" : ""}
        if (cardHeatImpact.z > 0.0) band = max(band, localHeat * 0.72);
        vec3 orange = mix(vec3(0.64, 0.022, 0.006), vec3(1.0, 0.32, 0.025), 0.5 + ripple * 0.5);
        diffuseColor.rgb = mix(diffuseColor.rgb, orange, clamp(band * 0.75 + center * localHeat * 0.28, 0.0, 1.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.68, 0.16), rim * 0.91);
      }
      if (cardScorch * heatedPaper > 0.001) {
        float scorchAmount = cardScorch * heatedPaper;
        vec2 uv = vMapUv;
        vec2 edgeDistance = min(uv, 1.0 - uv);
        float edge = min(edgeDistance.x, edgeDistance.y * 1.4);
        float roughness = heatNoise(uv * 17.0) * 0.011 + heatNoise(uv * 62.0) * 0.005;
        float burntWidth = scorchAmount * (0.043 + roughness + heatNoise(uv * 7.5) * 0.014);
        float burned = 1.0 - smoothstep(burntWidth * 0.55, burntWidth, edge);
        float browned = 1.0 - smoothstep(burntWidth * 0.76, burntWidth + 0.038 * scorchAmount, edge);
        float emberLine = (1.0 - smoothstep(0.002, 0.010, abs(edge - burntWidth * 0.72))) * scorchAmount;
        vec3 coal = mix(vec3(0.024, 0.009, 0.004), vec3(0.086, 0.028, 0.011), 0.5 + heatNoise(uv * 39.0) * 0.5);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.38, 0.10, 0.021), browned * scorchAmount * 0.48);
        diffuseColor.rgb = mix(diffuseColor.rgb, coal, burned * scorchAmount * 0.78);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.24, 0.012), emberLine * (0.55 + 0.20 * sin(cardHeatTime * 8.0 + edge * 87.0)));
      }
    `,
      );
  };
}
