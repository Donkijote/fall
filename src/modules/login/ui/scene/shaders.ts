export const planeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sceneCoordinates = `
  varying vec2 vUv;
  uniform sampler2D uLandscape;
  uniform sampler2D uMatte;
  uniform vec2 uCover;
  uniform vec2 uPointer;
  vec2 sceneUv() {
    return clamp((vUv - 0.5) * uCover + 0.5 + uPointer * uCover * 0.003,
      vec2(0.001), vec2(0.999));
  }
  vec3 sceneGrade(vec3 color) {
    float vignette = smoothstep(0.2, 0.8, length((vUv - 0.5) * vec2(1.15, 1.0)));
    float shade = clamp(mix(0.96, 0.76, vUv.y) + vignette * 0.15, 0.0, 0.985);
    return mix(color, vec3(0.012, 0.006, 0.007), shade);
  }
`;

export const landscapeFragmentShader = `
  ${sceneCoordinates}
  uniform float uForeground;
  void main() {
    vec2 imageUv = sceneUv();
    vec3 landscape = texture2D(uLandscape, imageUv).rgb;
    float matte = texture2D(uMatte, imageUv).r;
    vec3 displayColor = pow(max(landscape, vec3(0.0)), vec3(1.0 / 2.2));
    float luminance = dot(displayColor, vec3(0.2126, 0.7152, 0.0722));
    float trees = matte * (1.0 - smoothstep(0.24, 0.58, luminance));
    gl_FragColor = vec4(sceneGrade(landscape), mix(1.0, trees, uForeground));
    #include <colorspace_fragment>
  }
`;

export const fogFragmentShader = `
  ${sceneCoordinates}
  uniform float uTime;
  uniform float uLayer;
  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 blend = fract(point);
    blend = blend * blend * (3.0 - 2.0 * blend);
    return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), blend.x), blend.y);
  }
  float turbulence(vec2 point) {
    float density = 0.0;
    float amplitude = 0.56;
    for (int octave = 0; octave < 3; octave++) {
      density += noise(point) * amplitude;
      point = mat2(1.6, -1.2, 1.2, 1.6) * point + 3.7;
      amplitude *= 0.5;
    }
    return density;
  }
  void main() {
    vec2 imageUv = sceneUv();
    vec2 drift = uPointer * (0.012 + uLayer * 0.009);
    vec2 flow = imageUv * vec2(5.2, 8.5) + drift;
    flow.y += uTime * (0.065 + uLayer * 0.028);
    flow.x += sin(uTime * 0.04 + uLayer * 2.0) * 0.24;
    float curls = turbulence(flow * 0.65 + uLayer * 9.0);
    float body = turbulence(flow + vec2(curls * 1.4, curls * 0.7));
    float center = mix(0.57, 0.36, uLayer);
    float band = exp(-pow((imageUv.y - center) / mix(0.16, 0.24, uLayer), 2.0));
    float lowerFade = smoothstep(0.05, 0.23, imageUv.y);
    float density = smoothstep(0.18, 0.77, body) * band * lowerFade;
    float alpha = min(density * mix(0.83, 0.92, uLayer), 0.83);
    vec3 fogColor = mix(vec3(0.35, 0.43, 0.40), vec3(0.57, 0.64, 0.59), body);
    gl_FragColor = vec4(sceneGrade(fogColor), alpha);
    #include <colorspace_fragment>
  }
`;

export const emberVertexShader = `
  uniform float uTime;
  uniform float uDpr;
  uniform float uNear;
  uniform vec2 uViewport;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vHeat;
  void main() {
    float phase = fract(position.y + uTime * mix(0.025, 0.055, position.z));
    float sway = sin(phase * 8.0 + position.y * 31.0) * 0.035;
    vec2 location = vec2((position.x + sway) * uViewport.x * 1.15,
      (phase * 1.2 - 0.6) * uViewport.y);
    location -= uPointer * (0.02 + 0.06 * uNear);
    float depth = mix(-2.0, 1.0, uNear) + position.z * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(location, depth, 1.0);
    gl_PointSize = mix(1.2, 3.8, position.z) * uDpr * mix(0.65, 1.0, uNear);
    vAlpha = smoothstep(0.0, 0.12, phase) * (1.0 - smoothstep(0.6, 1.0, phase));
    vHeat = step(0.27, position.z);
  }
`;

export const emberFragmentShader = `
  varying float vAlpha;
  varying float vHeat;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    float halo = 1.0 - smoothstep(0.08, 0.5, radius);
    vec3 ash = vec3(0.34, 0.29, 0.25);
    vec3 fire = mix(vec3(0.95, 0.15, 0.025), vec3(1.0, 0.68, 0.25), halo);
    gl_FragColor = vec4(mix(ash, fire, vHeat), halo * vAlpha * 0.8);
    #include <colorspace_fragment>
  }
`;
