import type { RefObject } from "react";
import type { MeshBasicMaterial } from "three";

export type FrostUniform = { value: number };

export function addCardFrost(frost: RefObject<FrostUniform>): MeshBasicMaterial["onBeforeCompile"] {
  return (shader) => {
    shader.uniforms.cardFrost = frost.current;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `
      #include <common>
      uniform float cardFrost;

      vec2 frostHash(vec2 p) {
        return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
      }

      float frostNoise(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(frostHash(cell).x, frostHash(cell + vec2(1.0, 0.0)).x, f.x),
          mix(frostHash(cell + vec2(0.0, 1.0)).x, frostHash(cell + vec2(1.0, 1.0)).x, f.x),
          f.y
        );
      }

      float iceVeins(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        float first = 8.0;
        float second = 8.0;
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 delta = neighbor + frostHash(cell + neighbor) - f;
            float distanceToSeed = dot(delta, delta);
            second = min(second, max(first, distanceToSeed));
            first = min(first, distanceToSeed);
          }
        }
        return 1.0 - smoothstep(0.015, 0.075, second - first);
      }
    `,
      )
      .replace(
        "#include <map_fragment>",
        `
      #include <map_fragment>
      if (cardFrost > 0.001) {
        vec2 uv = vMapUv;
        vec2 edgeDistance = min(uv, 1.0 - uv);
        float edge = min(edgeDistance.x, edgeDistance.y * 1.4);
        vec2 crystalUv = uv * vec2(1.0, 1.4);
        float grain = frostNoise(crystalUv * 65.0);
        float roughFront = frostNoise(crystalUv * 13.0) * 0.11 + grain * 0.032;
        float freezeFront = cardFrost * 0.59;
        float coverage = (1.0 - smoothstep(freezeFront - 0.055, freezeFront + 0.025, edge + roughFront))
          * smoothstep(0.0, 0.1, cardFrost);
        float rim = 1.0 - smoothstep(0.006, 0.085, edge);
        float veins = iceVeins(crystalUv * 9.5 + (grain - 0.5) * 0.12);
        vec3 ice = mix(vec3(0.10, 0.38, 0.62), vec3(0.80, 0.94, 1.0), clamp(rim * 0.8 + grain * 0.28, 0.0, 1.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, ice, coverage * (0.48 + 0.43 * rim));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.87, 0.97, 1.0), coverage * veins * 0.75);
      }
    `,
      );
  };
}
