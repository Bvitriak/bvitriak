export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uScroll;
  uniform float uLight;

  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 345.45));
    point += dot(point, point + 34.345);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float lower = mix(
      hash21(cell),
      hash21(cell + vec2(1.0, 0.0)),
      local.x
    );
    float upper = mix(
      hash21(cell + vec2(0.0, 1.0)),
      hash21(cell + vec2(1.0, 1.0)),
      local.x
    );

    return mix(lower, upper, local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = mat2(1.6, 1.2, -1.2, 1.6) * point;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    float aspect = max(uResolution.x / max(uResolution.y, 1.0), 0.8);
    vec2 point = (vUv - 0.5) * vec2(aspect, 1.0);

    float time = uTime * 1.8;
    float scroll = uScroll * 0.09;
    vec2 warp = vec2(
      noise(point * 1.45 + vec2(time * 0.085, -time * 0.12)),
      noise(point * 1.45 + vec2(13.7 - time * 0.105, 7.3 + time * 0.075))
    );
    vec2 warpedPoint = point + (warp - 0.5) * 0.82;
    vec2 flow = vec2(time * 0.18, -time * 0.14);
    float field = fbm(warpedPoint * 4.1 + flow + vec2(0.0, scroll));
    float detail = fbm(warpedPoint * 8.4 + vec2(-time * 0.21, time * 0.17));
    float wave = sin(
      warpedPoint.x * 2.2 + warpedPoint.y * 1.4 + field * 5.1 + time * 0.72
    );
    vec2 center = vec2(
      -0.2 + sin(time * 0.13 + field * 2.0) * 0.07,
      0.01 + cos(time * 0.11 + detail * 1.8) * 0.08
    );
    vec2 edgeFlow = (warp - 0.5) * 0.2;
    float warpedDistance = length(
      (warpedPoint / vec2(aspect, 1.0) - center + edgeFlow) * vec2(1.5, 0.95)
    );
    float contour = (field - 0.5) * 0.18 + (detail - 0.5) * 0.12 + wave * 0.025;
    float sphere = 1.0 - smoothstep(0.08, 0.82, warpedDistance + contour);
    float density = smoothstep(0.18, 0.82, field + wave * 0.16 + (detail - 0.5) * 0.25);
    float cloud = sphere * (0.52 + density * 0.48);
    float amount = clamp(cloud * (0.16 + density * 0.72), 0.0, 0.68);
    float veil = 1.0 - smoothstep(
      0.0, 0.72, length((vUv - vec2(0.37, 0.5)) * vec2(1.2, 1.0))
    );
    amount = max(amount, veil * 0.12);

    vec3 darkBase = vec3(0.0);
    vec3 lightBase = vec3(0.933, 0.933, 0.912);
    vec3 darkHaze = vec3(0.38);
    vec3 lightHaze = vec3(0.72, 0.73, 0.7);
    vec3 base = mix(darkBase, lightBase, uLight);
    vec3 haze = mix(darkHaze, lightHaze, uLight);
    vec3 color = mix(base, haze, amount);
    gl_FragColor = vec4(color, 1.0);
  }
`;
